import { NextResponse } from "next/server";
import {
  hashResetToken,
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
    const name = String(formData.get("name") || "").trim();
    const token = String(formData.get("token") || "").trim();
    const newPlace = String(formData.get("newPlace") || "").trim();
    const confirmPlace = String(formData.get("confirmPlace") || "").trim();

    if (!name || !token || !newPlace || !confirmPlace) {
      return redirectWithError(request, "All fields are required.");
    }

    if (newPlace !== confirmPlace) {
      return redirectWithError(request, "New place and confirm place must match.");
    }

    const users = await query(
      `SELECT id, reset_token_hash, reset_token_expires
       FROM users
       WHERE name = ?
       LIMIT 1`,
      [name]
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

    await query(
      `UPDATE users
       SET place = ?, reset_token_hash = NULL, reset_token_expires = NULL, token_version = token_version + 1
       WHERE id = ?`,
      [newPlace, user.id]
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
