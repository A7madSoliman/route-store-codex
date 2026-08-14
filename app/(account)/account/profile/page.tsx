import type { Metadata } from "next";
import { AccountShell } from "@/components/layout/account-shell";
import { ProfileForm } from "@/features/account/profile/components/profile-form";
import { requireProtectedRoute } from "@/lib/auth/protected-route.server";
import { getSessionIdentity } from "@/lib/auth/session.server";

export const metadata: Metadata = { title: "Profile | Nexa Store" };

export default async function ProfilePage() {
  await requireProtectedRoute("/account/profile");
  const identity = await getSessionIdentity();
  return <AccountShell><div className="max-w-2xl"><p className="text-body-small font-semibold uppercase tracking-[0.16em] text-brand-primary">Account</p><h1 className="mt-2 text-heading-2 font-semibold text-text-primary">Profile</h1><p className="mt-3 text-body text-text-muted">Manage the profile details connected to your account.</p>{identity ? <div className="mt-8 rounded-lg border border-outline-subtle bg-card p-5 shadow-subtle md:p-7"><ProfileForm email={identity.email} name={identity.name} /></div> : <div className="mt-8 rounded-lg border border-outline-subtle bg-card p-5 text-body text-text-muted shadow-subtle md:p-7" role="status">We could not load your verified profile. Please sign in again.</div>}</div></AccountShell>;
}
