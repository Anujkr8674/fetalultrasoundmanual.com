import { NextResponse } from "next/server";
import {
  generateResetToken,
  hashResetToken,
} from "../../../../lib/auth";
import { createRedirectUrl } from "../../../../lib/request-url";
import { ensureUserTable, query } from "../../../../lib/db";

function redirectWithMessage(request, params) {
  const url = createRedirectUrl(request, "/user/forgotpassword");
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  try {
    await ensureUserTable();

    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();

    if (!name) {
      return redirectWithMessage(request, { error: "Please enter full name." });
    }

    const users = await query("SELECT id FROM users WHERE name = ? LIMIT 1", [name]);
    if (!users.length) {
      return redirectWithMessage(request, {
        message: "If the full name exists, a reset token has been generated.",
        name,
      });
    }

    const resetToken = generateResetToken();
    const resetTokenHash = hashResetToken(resetToken);
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    await query(
      `UPDATE users
       SET reset_token_hash = ?, reset_token_expires = ?
       WHERE id = ?`,
      [resetTokenHash, resetTokenExpires, users[0].id]
    );

    return redirectWithMessage(request, {
      message: "Reset token generated successfully.",
      token: resetToken,
      name,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return redirectWithMessage(request, {
      error: "Unable to generate reset token right now.",
    });
  }
}
