import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  isValidFullName,
  signToken,
} from "../../../../lib/auth";
import { createRedirectUrl } from "../../../../lib/request-url";
import { ensureUserTable, getPool, query } from "../../../../lib/db";

function redirectWithError(request, message) {
  const url = createRedirectUrl(request, "/user/signup");
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  try {
    await ensureUserTable();

    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const place = String(formData.get("place") || "").trim();

    if (!name || !place) {
      return redirectWithError(request, "Please fill all required fields.");
    }

    if (!isValidFullName(name)) {
      return redirectWithError(request, "Enter a valid full name.");
    }

    const existing = await query("SELECT id FROM users WHERE name = ? LIMIT 1", [name]);
    if (existing.length) {
      return redirectWithError(request, "This full name is already registered.");
    }

    const [result] = await getPool().execute(
      `INSERT INTO users (name, place, token_version)
       VALUES (?, ?, 0)`,
      [name, place]
    );

    const userId = result.insertId;
    const token = signToken({ sub: userId, name, tokenVersion: 0 });

    const response = NextResponse.redirect(
      createRedirectUrl(request, "/user/dashboardoverview"),
      303
    );
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return redirectWithError(request, "Signup failed. Please try again.");
  }
}
