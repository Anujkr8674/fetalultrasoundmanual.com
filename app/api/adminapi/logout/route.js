import { NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE_NAME, getAuthenticatedAdminFromToken } from "../../../../lib/auth";
import { createRedirectUrl } from "../../../../lib/request-url";
import { ensureAdminTable, query } from "../../../../lib/db";

export async function POST(request) {
  try {
    await ensureAdminTable();
    const admin = await getAuthenticatedAdminFromToken(
      request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value
    );

    if (admin?.id) {
      await query("UPDATE admins SET token_version = token_version + 1 WHERE id = ?", [admin.id]);
    }

    const response = NextResponse.redirect(
      createRedirectUrl(request, "/admin/login?message=logged_out"),
      303
    );
    response.cookies.set(ADMIN_AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    console.error("Admin logout error:", error);
    const response = NextResponse.redirect(
      createRedirectUrl(request, "/admin/login?message=logged_out"),
      303
    );
    response.cookies.set(ADMIN_AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  }
}
