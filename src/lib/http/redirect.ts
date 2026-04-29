export function getRequestOrigin(request: Request) {
  const explicitBaseUrl =
    process.env.NEXTAUTH_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (explicitBaseUrl) {
    return explicitBaseUrl.replace(/\/+$/, "");
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = request.headers.get("host");

  if (host) {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    return `${protocol}://${host}`;
  }

  return new URL(request.url).origin;
}

export function buildRedirectUrl(request: Request, pathnameWithQuery: string) {
  return new URL(pathnameWithQuery, `${getRequestOrigin(request)}/`);
}
