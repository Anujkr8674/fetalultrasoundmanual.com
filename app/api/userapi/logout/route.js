import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getAuthenticatedUserFromToken } from "../../../../lib/auth";
import { createRedirectUrl } from "../../../../lib/request-url";
import { ensureUserTable, query } from "../../../../lib/db";

export async function POST(request) {
  try {
    await ensureUserTable();
    const user = await getAuthenticatedUserFromToken(
      request.cookies.get(AUTH_COOKIE_NAME)?.value
    );

    if (user?.id) {
      await query("UPDATE users SET token_version = token_version + 1 WHERE id = ?", [
        user.id,
      ]);
    }

    const response = NextResponse.redirect(
      createRedirectUrl(request, "/user/login?message=logged_out"),
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
    console.error("Logout error:", error);
    const response = NextResponse.redirect(
      createRedirectUrl(request, "/user/login?message=logged_out"),
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
  }
}
