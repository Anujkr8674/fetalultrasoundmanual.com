import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  hashPassword,
  isValidFullName,
  isStrongPassword,
  isValidGender,
  normalizeEmail,
  normalizeGender,
  sanitizePhone,
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
    const email = normalizeEmail(formData.get("email"));
    const phone = sanitizePhone(formData.get("phone"));
    const gender = normalizeGender(formData.get("gender"));
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!name || !email || !password || !confirmPassword) {
      return redirectWithError(request, "Please fill all required fields.");
    }

    if (!isValidFullName(name)) {
      return redirectWithError(request, "Enter a valid full name.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return redirectWithError(request, "Enter a valid email address.");
    }

    if (phone && !/^\d{7,15}$/.test(phone)) {
      return redirectWithError(request, "Phone number must contain only digits.");
    }

    if (!isValidGender(gender)) {
      return redirectWithError(request, "Please select a valid gender.");
    }

    if (password !== confirmPassword) {
      return redirectWithError(request, "Password and confirm password do not match.");
    }

    if (!isStrongPassword(password)) {
      return redirectWithError(
        request,
        "Password must be 8+ chars with uppercase, lowercase, number, and symbol."
      );
    }

    const existing = await query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (existing.length) {
      return redirectWithError(request, "This email is already registered.");
    }

    const passwordHash = await hashPassword(password);
    const [result] = await getPool().execute(
      `INSERT INTO users (name, email, phone, gender, password_hash, token_version)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [name, email, phone || null, gender, passwordHash]
    );

    const userId = result.insertId;
    const token = signToken({ sub: userId, email, tokenVersion: 0 });

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
