import { NextResponse } from "next/server";

export async function POST(request) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", "admin_signup_disabled");
  return NextResponse.redirect(url, 303);
}
