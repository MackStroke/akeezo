import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Logomark } from '@/components/Logomark';
import { navigation, site, formatPhone, telHref } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-card pt-12 pb-20 sm:pb-8">
      <div className="mx-auto max-w-[76rem] px-4">
        <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
          <div>
            <Link
              to="/"
              onClick={() => {
                if (window.location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-2 cursor-pointer inline-block"
              aria-label="AKEEZO home"
            >
              <img src="/images/logo-dark.svg" alt="AKEEZO" className="h-8 w-auto dark:hidden hover:opacity-90 transition-opacity" />
              <img src="/images/logo-light.svg" alt="AKEEZO" className="h-8 w-auto hidden dark:block hover:opacity-90 transition-opacity" />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              A healthcare journey platform that helps patients discover, plan, access and
              coordinate care — from emergency assistance and hospital treatment to medical tourism
              and recovery at home.
            </p>
            <p className="mt-3 text-sm">
              <a href={telHref(site.emergencyPhone)} className="font-bold text-primary underline">
                {formatPhone(site.emergencyPhone)}
              </a>
              <span className="text-muted-foreground"> · </span>
              <a href={`mailto:${site.email}`} className="font-bold text-primary underline">
                {site.email}
              </a>
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {navigation.map((group) => (
              <div key={group.label}>
                <h3 className="text-[0.7rem] font-bold tracking-[0.08em] text-muted-foreground uppercase">
                  {group.label}
                </h3>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-primary hover:underline"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <p>
            © {year} {site.legalName}. Estimates are not quotations.
          </p>
          {/* Placeholder targets: the legal pages are a Phase 1 launch
              blocker, tracked in docs/PHASES.md. */}
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {['Privacy policy', 'Terms of service', 'Medical disclaimer', 'Patient data & consent'].map(
              (label) => (
                <li key={label}>
                  <a href="#faq" className="hover:text-primary hover:underline">
                    {label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}
