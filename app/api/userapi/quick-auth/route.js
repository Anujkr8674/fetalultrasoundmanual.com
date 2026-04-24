import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, isValidFullName, signToken } from "../../../../lib/auth";
import { ensureUserTable, getPool, query } from "../../../../lib/db";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function setAuthCookie(response, token) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function POST(request) {
  try {
    await ensureUserTable();

    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const place = String(formData.get("place") || "").trim();

    if (!name || !place) {
      return jsonError("Full name and place are required.");
    }

    if (!isValidFullName(name)) {
      return jsonError("Enter a valid full name.");
    }

    const existingUsers = await query(
      "SELECT id, name, place, token_version FROM users WHERE name = ? LIMIT 1",
      [name]
    );
    const existingUser = existingUsers[0];

    if (existingUser) {
      if (String(existingUser.place || "") !== place) {
        return jsonError("Invalid full name or place.", 401);
      }

      const token = signToken({
        sub: existingUser.id,
        name: existingUser.name,
        tokenVersion: existingUser.token_version,
      });

      const response = NextResponse.json({ ok: true, mode: "login" });
      return setAuthCookie(response, token);
    }

    const [insertResult] = await getPool().execute(
      "INSERT INTO users (name, place, token_version) VALUES (?, ?, 0)",
      [name, place]
    );

    const token = signToken({
      sub: insertResult.insertId,
      name,
      tokenVersion: 0,
    });

    const response = NextResponse.json({ ok: true, mode: "register" });
    return setAuthCookie(response, token);
  } catch (error) {
    console.error("Quick auth error:", error);
    return jsonError("Unable to continue right now.", 500);
  }
}
