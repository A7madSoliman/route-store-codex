import Link from "next/link";
import { StorefrontIcon } from "@/components/icons/storefront-icons";
import { ActiveNavLink } from "./active-nav-link";
import { MobileMenu } from "./mobile-menu";
import { PageContainer } from "./page-container";
import { primaryNavigation, utilityNavigation } from "./navigation";

export function StoreHeader({ accountHref }: { accountHref?: string } = {}) {
  const search = utilityNavigation[0];
  const cart = utilityNavigation[2];

  return (
    <header className="relative border-b border-outline-subtle bg-card" role="banner">
      <PageContainer className="flex h-header-compact items-center justify-between gap-4 md:h-header-standard">
        <div className="flex min-w-0 items-center gap-2 md:gap-8">
          <MobileMenu primaryItems={primaryNavigation} />
          <Link className="shrink-0 text-heading-4 font-semibold tracking-tight text-brand-primary" href="/">
            Nexa Store
          </Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
            {primaryNavigation.map((item) => (
              <ActiveNavLink
                key={item.href}
                item={item}
                className="min-h-11 inline-flex items-center py-3 text-body-small font-medium text-text-secondary hover:text-brand-primary"
              />
            ))}
          </nav>
        </div>

        <nav aria-label="Store utilities" className="flex items-center gap-1 md:gap-2">
          <Link
            aria-label={search.label}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-text-secondary hover:bg-surface-low hover:text-brand-primary"
            href={search.href}
            title={search.label}
          >
            <StorefrontIcon name="search" />
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {utilityNavigation.slice(1).map((item) => (
              <Link
                key={item.label}
                aria-label={item.label}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-text-secondary hover:bg-surface-low hover:text-brand-primary"
                href={item.label === "Account" && accountHref ? accountHref : item.href}
                title={item.label}
              >
                {item.icon ? <StorefrontIcon name={item.icon} /> : null}
              </Link>
            ))}
          </div>
          <Link
            aria-label={cart.label}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-text-secondary hover:bg-surface-low hover:text-brand-primary md:hidden"
            href={cart.href}
            title={cart.label}
          >
            <StorefrontIcon name="cart" />
          </Link>
        </nav>
      </PageContainer>
    </header>
  );
}
