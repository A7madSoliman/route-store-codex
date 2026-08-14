import "server-only";

import { productListingHref, parseProductListingQuery } from "@/features/catalog/product-listing-query";
import { getServerEnvironment } from "@/lib/env/server";

const dynamicCatalogRoute = /^(?:products|categories|subcategories|brands)\/([^/]+)$/u;

function hasUnsafePathSegment(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments.some((segment) => {
    if (/%(?:2f|5c|00|0a|0d)/iu.test(segment)) return true;
    try {
      const decoded = decodeURIComponent(segment);
      return /[\\\u0000-\u001f\u007f]/u.test(decoded);
    } catch {
      return true;
    }
  });
}

function isImplementedPath(pathname: string): boolean {
  if (["/", "/products", "/categories", "/subcategories", "/brands", "/account/profile"].includes(pathname)) {
    return true;
  }
  const match = dynamicCatalogRoute.exec(pathname.slice(1));
  return match !== null && !hasUnsafePathSegment(pathname);
}

function isCanonicalProductsQuery(url: URL, appOrigin: string): boolean {
  const query: Record<string, string | readonly string[]> = {};
  for (const key of new Set(url.searchParams.keys())) {
    const values = url.searchParams.getAll(key);
    query[key] = values.length > 1 ? values : values[0];
  }
  const state = parseProductListingQuery(query);
  const canonical = new URL(productListingHref(state), appOrigin);
  return canonical.searchParams.toString() === url.searchParams.toString();
}

export function normalizeReturnTo(candidate: unknown): string {
  const fallback = "/";
  if (typeof candidate !== "string" || candidate.length === 0 || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }
  if (/[\\\u0000-\u001f\u007f#]/u.test(candidate) || /(?:^|:)\/\//u.test(candidate)) return fallback;
  const rawPath = candidate.split(/[?#]/u, 1)[0];
  if (rawPath.split("/").some((segment) => segment === "." || segment === ".." || /%2e/iu.test(segment))) {
    return fallback;
  }

  const appOrigin = getServerEnvironment().appOrigin;
  try {
    const url = new URL(candidate, appOrigin);
    if (url.origin !== appOrigin || url.username || url.password || url.hash || !isImplementedPath(url.pathname)) {
      return fallback;
    }
    if (url.pathname === "/products") {
      if (!isCanonicalProductsQuery(url, appOrigin)) return fallback;
    } else if (url.search) {
      return fallback;
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return fallback;
  }
}
