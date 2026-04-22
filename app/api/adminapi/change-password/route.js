import { NextResponse } from "next/server";
import {
  ADMIN_AUTH_COOKIE_NAME,
  getAuthenticatedAdminFromToken,
  hashPassword,
  isStrongPassword,
  verifyPassword,
} from "../../../../lib/auth";
import { createRedirectUrl } from "../../../../lib/request-url";
import { ensureAdminTable, getPool } from "../../../../lib/db";

function redirectWithError(request, message) {
  const url = createRedirectUrl(request, "/admin/changepassword");
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  try {
    await ensureAdminTable();
    const admin = await getAuthenticatedAdminFromToken(
      request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value
    );
    if (!admin) {
      return redirectWithError(request, "session_expired");
    }

    const formData = await request.formData();
    const currentPassword = String(formData.get("currentPassword") || "");
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return redirectWithError(request, "All fields are required.");
    }

    const [rows] = await getPool().execute(
      "SELECT password_hash FROM admins WHERE id = ? LIMIT 1",
      [admin.id]
    );
    const currentHash = rows[0]?.password_hash;
    const validCurrentPassword = await verifyPassword(currentPassword, currentHash);
    if (!validCurrentPassword) {
      return redirectWithError(request, "Current password is incorrect.");
    }

    if (newPassword !== confirmPassword) {
      return redirectWithError(request, "New password and confirm password must match.");
    }

    if (!isStrongPassword(newPassword)) {
      return redirectWithError(
        request,
        "Password must be 8+ chars with uppercase, lowercase, number, and symbol."
      );
    }

    const passwordHash = await hashPassword(newPassword);
    await getPool().execute(
      "UPDATE admins SET password_hash = ?, token_version = token_version + 1 WHERE id = ?",
      [passwordHash, admin.id]
    );

    const response = NextResponse.redirect(
      createRedirectUrl(request, "/admin/login?message=password_changed"),
      303
    );
    response.cookies.set(ADMIN_AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    console.error("Admin change password error:", error);
    return redirectWithError(request, "Unable to change password.");
  }
}
