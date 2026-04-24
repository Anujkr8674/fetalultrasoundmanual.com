import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  getAuthenticatedUserFromToken,
} from "../../../../lib/auth";
import { createRedirectUrl } from "../../../../lib/request-url";
import { ensureUserTable, getPool } from "../../../../lib/db";

function redirectWithError(request, message) {
  const url = createRedirectUrl(request, "/user/changepassword");
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  try {
    await ensureUserTable();
    const user = await getAuthenticatedUserFromToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);
    if (!user) {
      return redirectWithError(request, "session_expired");
    }

    const formData = await request.formData();
    const currentPlace = String(formData.get("currentPlace") || "").trim();
    const newPlace = String(formData.get("newPlace") || "").trim();
    const confirmPlace = String(formData.get("confirmPlace") || "").trim();

    if (!currentPlace || !newPlace || !confirmPlace) {
      return redirectWithError(request, "All fields are required.");
    }

    const [rows] = await getPool().execute(
      "SELECT place FROM users WHERE id = ? LIMIT 1",
      [user.id]
    );
    const storedPlace = String(rows[0]?.place || "");
    if (storedPlace !== currentPlace) {
      return redirectWithError(request, "Current place is incorrect.");
    }

    if (newPlace !== confirmPlace) {
      return redirectWithError(request, "New place and confirm place must match.");
    }

    await getPool().execute(
      "UPDATE users SET place = ?, token_version = token_version + 1 WHERE id = ?",
      [newPlace, user.id]
    );

    const response = NextResponse.redirect(
      createRedirectUrl(request, "/user/login?message=password_changed"),
      303
    );
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    console.error("Change password error:", error);
    return redirectWithError(request, "Unable to change password.");
  }
}
