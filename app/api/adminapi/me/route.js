import { NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE_NAME, getAuthenticatedAdminFromToken } from "../../../../lib/auth";

export async function GET(request) {
  const admin = await getAuthenticatedAdminFromToken(
    request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value
  );
  if (!admin) {
    return NextResponse.json({ ok: false, admin: null }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    admin: {
      id: admin.id,
      adminCode: admin.admin_code,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      createdAt: admin.created_at,
    },
  });
}
