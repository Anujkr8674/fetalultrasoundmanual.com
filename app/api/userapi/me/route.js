import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getAuthenticatedUserFromToken } from "../../../../lib/auth";

export async function GET(request) {
  const user = await getAuthenticatedUserFromToken(
    request.cookies.get(AUTH_COOKIE_NAME)?.value
  );
  if (!user) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.created_at,
    },
  });
}
