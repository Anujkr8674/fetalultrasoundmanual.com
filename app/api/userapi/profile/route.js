import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  getAuthenticatedUserFromToken,
  isValidFullName,
  signToken,
} from "../../../../lib/auth";
import { createRedirectUrl } from "../../../../lib/request-url";
import { ensureUserTable, getPool, query } from "../../../../lib/db";

function redirectToProfile(request, params = {}) {
  const url = createRedirectUrl(request, "/user/myprofile");
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return NextResponse.redirect(url, 303);
}

function redirectToEdit(request, params = {}) {
  const url = createRedirectUrl(request, "/user/editprofile");
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return NextResponse.redirect(url, 303);
}

export async function GET(request) {
  await ensureUserTable();
  const user = await getAuthenticatedUserFromToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      place: user.place,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
  });
}

export async function POST(request) {
  try {
    await ensureUserTable();
    const user = await getAuthenticatedUserFromToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);
    if (!user) {
      return redirectToEdit(request, { error: "session_expired" });
    }

    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const place = String(formData.get("place") || "").trim();

    if (!name || !place) {
      return redirectToEdit(request, { error: "Full name and place are required." });
    }

    if (!isValidFullName(name)) {
      return redirectToEdit(request, { error: "Enter a valid full name." });
    }

    const existing = await query("SELECT id FROM users WHERE name = ? AND id <> ? LIMIT 1", [
      name,
      user.id,
    ]);

    if (existing.length) {
      return redirectToEdit(request, { error: "This full name is already in use." });
    }

    await getPool().execute("UPDATE users SET name = ?, place = ? WHERE id = ?", [
      name,
      place,
      user.id,
    ]);

    const response = redirectToProfile(request, { message: "Profile updated successfully." });
    response.cookies.set(
      AUTH_COOKIE_NAME,
      signToken({
        sub: user.id,
        name,
        tokenVersion: user.token_version,
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );
    return response;
  } catch (error) {
    console.error("Profile update error:", error);
    return redirectToEdit(request, { error: "Unable to update profile." });
  }
}
