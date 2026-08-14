"use client";

export default function AccountError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-dvh items-center justify-center px-gutter-mobile py-12"><div className="max-w-md text-center"><h1 className="text-heading-2 font-semibold text-text-primary">Account unavailable</h1><p className="mt-3 text-body text-text-muted">We could not load this account page safely.</p><button className="mt-6 min-h-11 rounded-sm bg-brand-primary px-5 py-3 text-button text-white" onClick={reset} type="button">Try again</button></div></main>;
}
