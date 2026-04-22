import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  normalizeEmail,
  signToken,
  verifyPassword,
} from "../../../../lib/auth";
import { ensureUserTable, query } from "../../../../lib/db";

function redirectWithError(request, message) {
  const url = new URL("/user/login", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, 303);
}

function getSafeRedirectPath(value) {
  const redirectTo = String(value || "").trim();
  if (!redirectTo.startsWith("/")) {
    return "/user/dashboardoverview";
  }
  return redirectTo;
}

export async function POST(request) {
  try {
    await ensureUserTable();

    const formData = await request.formData();
    const email = normalizeEmail(formData.get("email"));
    const password = String(formData.get("password") || "");
    const redirectTo = getSafeRedirectPath(formData.get("redirectTo"));

    if (!email || !password) {
      return redirectWithError(request, "Email and password are required.");
    }

    const users = await query(
      `SELECT id, email, password_hash, token_version
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    const user = users[0];
    if (!user) {
      return redirectWithError(request, "Invalid email or password.");
    }

    const passwordMatches = await verifyPassword(password, user.password_hash);
    if (!passwordMatches) {
      return redirectWithError(request, "Invalid email or password.");
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      tokenVersion: user.token_version,
    });

    const response = NextResponse.redirect(new URL(redirectTo, request.url), 303);
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
