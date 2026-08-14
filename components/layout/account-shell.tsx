import type { ReactNode } from "react";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { PageContainer } from "./page-container";
import { SiteFooter } from "./site-footer";
import { StoreHeader } from "./store-header";

export function AccountShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-dvh flex-col bg-background"><a className="sr-only absolute left-4 top-4 z-50 rounded-sm bg-card px-4 py-3 text-body-small font-semibold text-brand-primary focus:not-sr-only" href="#main-content">Skip to content</a><StoreHeader accountHref="/account/profile" /><main className="flex-1 pb-[calc(var(--spacing-bottom-nav)+env(safe-area-inset-bottom))] md:pb-0" id="main-content"><PageContainer className="grid gap-8 py-8 md:grid-cols-[220px_minmax(0,1fr)] md:py-12 lg:grid-cols-[256px_minmax(0,1fr)]"><aside className="hidden md:block" aria-label="Account navigation"><p className="mb-3 text-caption font-semibold uppercase tracking-[0.16em] text-text-muted">Your account</p><nav><a aria-current="page" className="block rounded-sm bg-surface-low px-4 py-3 text-body-small font-semibold text-brand-primary" href="/account/profile">Profile</a></nav></aside><section className="min-w-0">{children}</section></PageContainer></main><SiteFooter /><MobileBottomNav accountHref="/account/profile" /></div>;
}
