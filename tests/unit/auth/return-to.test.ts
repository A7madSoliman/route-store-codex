// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { normalizeReturnTo } from "@/lib/auth/return-to.server";

beforeEach(() => {
  vi.stubEnv("ECOMMERCE_API_BASE_URL", "https://ecommerce.routemisr.com/api/v1");
  vi.stubEnv("APP_ORIGIN", "http://localhost:3000");
});

describe("safe returnTo normalization", () => {
  it.each([
    "/",
    "/products",
    "/categories",
    "/subcategories",
    "/brands",
    "/products/product-1",
    "/categories/category-1",
    "/products?sort=price",
    "/products?category%5Bin%5D=category-1&sort=price",
    "/account/profile",
  ])("accepts implemented canonical destination %s", (candidate) => {
    expect(normalizeReturnTo(candidate)).toBe(candidate);
  });

  it.each([
    "https://evil.example/",
    "//evil.example/path",
    "/products\\secret",
    "/products#fragment",
    "/products/%2Fother",
    "/products/%5Cother",
    "/products/../brands",
    "/products/%2e%2e/brands",
    "/products/nested/id",
    "/brands/brand-1?tab=all",
    "/products?unknown=value",
    "/products?brand=brand-1&price%5Bgte%5D=1",
    "/products?brand=brand-1&sort=price",
    "/products?category%5Bin%5D=category-1&sort=-price",
    "/products?category%5Bin%5D=one&category%5Bin%5D=two&brand=brand-1",
    "/products?sort=price&page=2",
    "/products/%ZZ",
    "/not-implemented",
  ])("falls back for unsafe or unsupported destination %s", (candidate) => {
    expect(normalizeReturnTo(candidate)).toBe("/");
  });
});
