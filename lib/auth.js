import crypto from "crypto";
import { cookies } from "next/headers";
import { query } from "./db";

export const AUTH_COOKIE_NAME = "fogsi_auth";
export const ADMIN_AUTH_COOKIE_NAME = "fogsi_admin_auth";
const DEFAULT_SECRET = "change-this-secret-in-production";

export function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_SECRET;
}

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function base64UrlBuffer(input) {
  return Buffer.from(
    input
      .replace(/-/g, "+")
      .replace(/_/g, "/") +
      "=".repeat((4 - (input.length % 4)) % 4),
    "base64"
  );
}

export function signToken(payload, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(body));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(data)
    .digest();

  return `${data}.${base64UrlEncode(signature)}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(data)
    .digest();
  const providedSignature = base64UrlBuffer(encodedSignature);

  if (
    expectedSignature.length !== providedSignature.length ||
    !crypto.timingSafeEqual(expectedSignature, providedSignature)
  ) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp <= now) return null;

  return payload;
}

export function isStrongPassword(password) {
  const value = String(password || "");
  return (
    value.length >= 8 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function sanitizePhone(phone) {
  return String(phone || "")
    .replace(/\D/g, "")
    .trim();
}

export function isValidGender(gender) {
  return ["Male", "Female", "Other"].includes(String(gender || ""));
}

export function normalizeGender(gender) {
  const value = String(gender || "").trim();
  return isValidGender(value) ? value : "";
}

export function isValidFullName(name) {
  const value = String(name || "").trim();
  return value.length >= 2 && /^[A-Za-z][A-Za-z\s.'-]*$/.test(value);
}

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = String(storedHash || "").split(":");
    if (!salt || !key) {
      resolve(false);
      return;
    }

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }

      const expected = Buffer.from(key, "hex");
      const actual = Buffer.from(derivedKey);
      if (expected.length !== actual.length) {
        resolve(false);
        return;
      }

      resolve(crypto.timingSafeEqual(expected, actual));
    });
  });
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function getAuthenticatedUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return getAuthenticatedUserFromToken(token);
}

export async function getAuthenticatedUserFromToken(token) {
  const payload = verifyToken(token);

  if (!payload?.sub) {
    return null;
  }

  const users = await query(
    `SELECT id, name, place, created_at, updated_at, token_version
     FROM users
     WHERE id = ? AND token_version = ?
     LIMIT 1`,
    [payload.sub, payload.tokenVersion ?? 0]
  );

  return users[0] || null;
}

export async function getAuthenticatedAdminFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_AUTH_COOKIE_NAME)?.value;
  return getAuthenticatedAdminFromToken(token);
}

export async function getAuthenticatedAdminFromToken(token) {
  const payload = verifyToken(token);

  if (!payload?.sub) {
    return null;
  }

  const admins = await query(
    `SELECT id, admin_code, name, email, phone, created_at, token_version
     FROM admins
     WHERE id = ? AND token_version = ?
     LIMIT 1`,
    [payload.sub, payload.tokenVersion ?? 0]
  );

  return admins[0] || null;
}
