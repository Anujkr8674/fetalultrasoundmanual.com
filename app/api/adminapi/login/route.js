import { NextResponse } from "next/server";
import {
  ADMIN_AUTH_COOKIE_NAME,
  signToken,
  verifyPassword,
} from "../../../../lib/auth";
import { createRedirectUrl } from "../../../../lib/request-url";
import { ensureDefaultAdminAccount, query } from "../../../../lib/db";

function redirectWithError(request, message) {
  const url = createRedirectUrl(request, "/admin/login");
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  try {
    await ensureDefaultAdminAccount();

    const formData = await request.formData();
    const adminId = String(formData.get("adminId") || "").trim().toUpperCase();
    const password = String(formData.get("password") || "");

    if (!adminId || !password) {
      return redirectWithError(request, "Admin ID and password are required.");
    }

    const admins = await query(
      `SELECT id, admin_code, name, email, password_hash, token_version
       FROM admins
       WHERE admin_code = ?
       LIMIT 1`,
      [adminId]
    );

    const admin = admins[0];
    if (!admin) {
      return redirectWithError(request, "Invalid admin ID or password.");
    }

    const passwordMatches = await verifyPassword(password, admin.password_hash);
    if (!passwordMatches) {
      return redirectWithError(request, "Invalid admin ID or password.");
    }

    const token = signToken({
      sub: admin.id,
      adminCode: admin.admin_code,
      email: admin.email,
      tokenVersion: admin.token_version,
    });

    const response = NextResponse.redirect(
      createRedirectUrl(request, "/admin/dashboardoverview"),
      303
    );
    response.cookies.set(ADMIN_AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return redirectWithError(request, "Login failed. Please try again.");
  }
}
