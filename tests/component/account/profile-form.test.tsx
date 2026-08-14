import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("react", async (importOriginal) => { const actual = await importOriginal<typeof import("react")>(); return { ...actual, useActionState: (_action: unknown, initial: unknown) => [initial, vi.fn()] }; });

import { ProfileForm } from "@/features/account/profile/components/profile-form";

afterEach(() => cleanup());

describe("profile form", () => {
  it("renders only the three verified profile fields and field-scoped saves", () => {
    render(<ProfileForm email="email@example.test" name="Test User" />);
    expect(screen.getByRole("textbox", { name: "Full Name" }).getAttribute("value")).toBe("Test User");
    expect(screen.getByRole("textbox", { name: "Email Address" }).getAttribute("value")).toBe("email@example.test");
    expect(screen.getByRole("textbox", { name: "Phone Number" }).getAttribute("value")).toBe("");
    expect(screen.getAllByRole("button", { name: /^Save / })).toHaveLength(3);
    expect(screen.queryByText(/avatar|country|bio|storage|notification|payment/i)).toBeNull();
  });
});
