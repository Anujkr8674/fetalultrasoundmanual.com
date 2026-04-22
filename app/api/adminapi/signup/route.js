import { NextResponse } from "next/server";
import { createRedirectUrl } from "../../../../lib/request-url";

export async function POST(request) {
  const url = createRedirectUrl(request, "/admin/login");
  url.searchParams.set("error", "admin_signup_disabled");
  return NextResponse.redirect(url, 303);
}
