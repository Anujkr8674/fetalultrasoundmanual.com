import { NextResponse } from "next/server";
import {
  hashPassword,
  hashResetToken,
  isStrongPassword,
  normalizeEmail,
} from "../../../../lib/auth";
import { createRedirectUrl } from "../../../../lib/request-url";
import { ensureUserTable, query } from "../../../../lib/db";

function redirectWithError(request, message) {
  const url = createRedirectUrl(request, "/user/forgotpassword");
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  try {
    await ensureUserTable();

    const formData = await request.formData();
    const email = normalizeEmail(formData.get("email"));
    const token = String(formData.get("token") || "").trim();
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!email || !token || !newPassword || !confirmPassword) {
      return redirectWithError(request, "All fields are required.");
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

    const users = await query(
      `SELECT id, reset_token_hash, reset_token_expires
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    const user = users[0];
    if (!user || !user.reset_token_hash || !user.reset_token_expires) {
      return redirectWithError(request, "Reset token is invalid or expired.");
    }

    if (new Date(user.reset_token_expires).getTime() < Date.now()) {
      return redirectWithError(request, "Reset token is invalid or expired.");
    }

    if (hashResetToken(token) !== user.reset_token_hash) {
      return redirectWithError(request, "Reset token is invalid or expired.");
    }

    const passwordHash = await hashPassword(newPassword);
    await query(
      `UPDATE users
       SET password_hash = ?, reset_token_hash = NULL, reset_token_expires = NULL, token_version = token_version + 1
       WHERE id = ?`,
      [passwordHash, user.id]
    );

    return NextResponse.redirect(
      createRedirectUrl(request, "/user/login?message=password_reset_success"),
      303
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return redirectWithError(request, "Password reset failed.");
  }
}
