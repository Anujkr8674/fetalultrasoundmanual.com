export function getRequestOrigin(request) {
  const envOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.APP_URL ||
    "";

  if (envOrigin) {
    try {
      return new URL(envOrigin).origin;
    } catch {
      // Ignore invalid env values and fall back to request headers.
    }
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host");
  const proto = forwardedProto || "https";
  const hostname = forwardedHost || host;

  if (hostname) {
    return `${proto}://${hostname}`;
  }

  return request.nextUrl.origin;
}

export function createRedirectUrl(request, path) {
  return new URL(path, getRequestOrigin(request));
}

export function getSafeRedirectPath(value, fallback = "/user/dashboardoverview") {
  const redirectTo = String(value || "").trim();
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return fallback;
  }
  return redirectTo;
}
