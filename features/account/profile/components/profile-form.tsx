"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertBanner } from "@/components/ui/alert-banner";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateProfileAction } from "@/features/account/profile/actions/update-profile.action";
import { initialProfileState, type ProfileField } from "@/features/account/profile/profile-state";

const inputClass = "h-12 w-full rounded-md border border-outline bg-card px-4 text-body text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

function ProfileFieldForm({ field, label, autoComplete, initialValue, type = "text" }: { field: ProfileField; label: string; autoComplete: string; initialValue: string; type?: "text" | "email" | "tel" }) {
  const [value, setValue] = useState(initialValue);
  const [state, action] = useActionState(updateProfileAction, initialProfileState(field, initialValue));
  const summaryRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.status !== "idle") summaryRef.current?.focus(); }, [state.status, state.message]);
  return (
    <form action={action} className="space-y-3">
      <input name="field" type="hidden" value={field} readOnly />
      <FormField control={<input autoComplete={autoComplete} className={inputClass} name="value" onChange={(event) => setValue(event.target.value)} type={type} value={value} />} description={field === "phone" ? "Phone is saved as a separate profile field." : undefined} error={state.status === "error" || state.status === "identity-missing" ? state.message : undefined} id={`profile-${field}`} label={label} />
      <div aria-live="polite" className="min-h-6 outline-none" ref={summaryRef} tabIndex={-1}>{state.status === "success" ? <AlertBanner tone="info">{state.message}</AlertBanner> : null}</div>
      <SubmitButton className="h-11 w-auto px-5" pendingLabel={`Saving ${label.toLowerCase()}...`}>{`Save ${label}`}</SubmitButton>
    </form>
  );
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  return <div className="space-y-7"><ProfileFieldForm autoComplete="name" field="name" initialValue={name} label="Full Name" /><ProfileFieldForm autoComplete="email" field="email" initialValue={email} label="Email Address" type="email" /><ProfileFieldForm autoComplete="tel" field="phone" initialValue="" label="Phone Number" type="tel" /></div>;
}
