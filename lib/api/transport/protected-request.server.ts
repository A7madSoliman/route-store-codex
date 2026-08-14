import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { getServerEnvironment } from "@/lib/env/server";
import { getSessionToken } from "@/lib/auth/session.server";
import { SessionRequiredError } from "@/lib/auth/require-session.server";

const requestTimeoutMs = 10_000;

function assertPathSegment(segment: string): void {
  if (
    typeof segment !== "string" ||
    segment.length === 0 ||
    segment.trim().length === 0 ||
    /[\u0000-\u001f\u007f]/u.test(segment)
  ) {
    throw new ProtectedApiError("invalid-request");
  }
}

function buildUrl(baseUrl: string, pathSegments: readonly string[], searchParams?: URLSearchParams): URL {
  if (pathSegments.length === 0) throw new ProtectedApiError("invalid-request");
  pathSegments.forEach(assertPathSegment);
  const url = new URL(pathSegments.map((segment) => encodeURIComponent(segment)).join("/"), `${baseUrl}/`);
  if (searchParams) url.search = searchParams.toString();
  return url;
}

function isAbortLike(error: unknown): boolean {
  return error instanceof DOMException && (error.name === "AbortError" || error.name === "TimeoutError");
}

export async function protectedGet(
  pathSegments: readonly string[],
  searchParams?: URLSearchParams,
): Promise<unknown> {
  const token = await getSessionToken();
  if (!token) throw new SessionRequiredError();

  const environment = getServerEnvironment();
  const url = buildUrl(environment.ecommerceApiBaseUrl, pathSegments, searchParams);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", token },
      credentials: "omit",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
  } catch (error) {
    if (isAbortLike(error) || error instanceof TypeError) throw new ProtectedApiError("unavailable");
    throw new ProtectedApiError("unavailable");
  }

  if (!response.ok || (response.status >= 300 && response.status < 400)) {
    throw new ProtectedApiError("upstream-failure", response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new ProtectedApiError("invalid-response", response.status);
  }
}

export async function protectedPutJson(
  pathSegments: readonly string[],
  body: Record<string, string>,
): Promise<{ status: number; body: unknown }> {
  const token = await getSessionToken();
  if (!token) throw new SessionRequiredError();

  const environment = getServerEnvironment();
  const url = buildUrl(environment.ecommerceApiBaseUrl, pathSegments);
  let response: Response;
  try {
    response = await fetch(url, {
      method: "PUT",
      headers: { Accept: "application/json", "Content-Type": "application/json", token },
      credentials: "omit",
      redirect: "manual",
      cache: "no-store",
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
  } catch (error) {
    if (isAbortLike(error) || error instanceof TypeError) throw new ProtectedApiError("unavailable");
    throw new ProtectedApiError("unavailable");
  }

  if (response.status >= 300 && response.status < 400) {
    throw new ProtectedApiError("upstream-failure", response.status);
  }

  let parsed: unknown = null;
  try {
    parsed = await response.json();
  } catch {
    if (response.ok) throw new ProtectedApiError("invalid-response", response.status);
  }
  return { status: response.status, body: parsed };
}
