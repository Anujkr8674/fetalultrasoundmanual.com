import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  signToken,
} from "../../../../lib/auth";
import { createRedirectUrl, getSafeRedirectPath } from "../../../../lib/request-url";
import { ensureUserTable, query } from "../../../../lib/db";

function redirectWithError(request, message) {
  const url = createRedirectUrl(request, "/user/login");
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  try {
    await ensureUserTable();

    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const place = String(formData.get("place") || "").trim();
    const redirectTo = getSafeRedirectPath(formData.get("redirectTo"));

    if (!name || !place) {
      return redirectWithError(request, "Full name and place are required.");
    }

    const users = await query(
      `SELECT id, name, place, token_version
       FROM users
       WHERE name = ?
       LIMIT 1`,
      [name]
    );

    const user = users[0];
    if (!user) {
      return redirectWithError(request, "Invalid full name or place.");
    }

    const storedPlace = String(user.place || "");
    if (storedPlace !== place) {
      return redirectWithError(request, "Invalid full name or place.");
    }

    const token = signToken({
      sub: user.id,
      name: user.name,
      tokenVersion: user.token_version,
    });

    const response = NextResponse.redirect(createRedirectUrl(request, redirectTo), 303);
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return redirectWithError(request, "Login failed. Please try again.");
  }
}
