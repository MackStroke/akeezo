import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ambulance, Building2, Globe, Menu, Phone, UserRound, X, LogOut, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { navigation, site, formatPhone, telHref } from '@/lib/site';
import { Logomark } from '@/components/Logomark';
import { LocaleSelector } from '@/components/LocaleSelector';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { CustomerLoginDialog } from '@/components/CustomerLoginDialog';

/**
 * MMT's header is two strips: a dark utility bar carrying business links, then
 * the brand row. Ours keeps that shape but the emergency number lives in the
 * dark bar, because the brief requires an emergency affordance to be
 * permanently visible and the dark bar never scrolls away with the nav.
 */
function UtilityBar({ onOpenLogin }) {
  const { customerUser, isAuthenticated } = useCustomerAuth();

  return (
    <div className="bg-black text-white">
      <div className="mx-auto flex max-w-[76rem] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1.5 text-[0.78rem]">
        <p className="flex items-center gap-2 font-bold">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emergency opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-emergency" />
          </span>
          Medical emergency?
          <a href={telHref(site.emergencyPhone)} className="underline decoration-2">
            {formatPhone(site.emergencyPhone)}
          </a>
          <span className="font-normal text-navy-foreground/70">· 24/7</span>
        </p>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <li>
            <a
              href="#partners"
              className="flex items-center gap-1.5 font-bold hover:underline"
            >
              <Building2 className="size-3.5" aria-hidden="true" />
              List your hospital
            </a>
          </li>
          <li>
            <a href="#partners" className="flex items-center gap-1.5 font-bold hover:underline">
              <Globe className="size-3.5" aria-hidden="true" />
              Agent portal
            </a>
          </li>
          <li>
            {isAuthenticated ? (
              <Link
                to="/my-journey"
                className="flex items-center gap-1.5 font-bold text-sky-300 hover:text-white transition-colors"
              >
                <span className="size-4 rounded-full bg-sky-400 text-navy font-bold flex items-center justify-center text-[0.65rem]">
                  {customerUser?.name?.charAt(0) || 'P'}
                </span>
                <span>My Journey ({customerUser?.name?.split(' ')[0]})</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 font-bold hover:underline cursor-pointer bg-transparent border-0 text-inherit p-0 font-inherit"
              >
                <UserRound className="size-3.5" aria-hidden="true" />
                My journey / Patient Login
              </button>
            )}
          </li>
          <LocaleSelector />
        </ul>
      </div>
    </div>
  );
}

/** Desktop dropdown. Radix Popover handles the top layer, Escape and dismiss. */
function NavDropdown({ group, isScrolled }) {
  const [open, setOpen] = useState(false);
  const hasDropdown = Boolean(group.items && group.items.length > 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold transition-colors cursor-pointer',
          isScrolled
            ? 'text-foreground hover:bg-accent hover:text-primary data-[state=open]:bg-accent data-[state=open]:text-primary'
            : 'text-white/90 hover:bg-white/15 hover:text-white data-[state=open]:bg-white/20 data-[state=open]:text-white',
        )}
      >
        <span>{group.label}</span>
        {hasDropdown && (
          <ChevronDown
            className={cn(
              'size-3.5 transition-transform duration-200 opacity-75',
              open && 'rotate-180'
            )}
            aria-hidden="true"
          />
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 p-1.5">
        <ul>
          {group.items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-sm px-3 py-2 text-sm font-medium hover:bg-accent hover:text-primary"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function SiteHeader() {
  const location = useLocation();
  const drawerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [initialMode, setInitialMode] = useState('login');

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (['/login', '/customer/login', '/signup', '/register', '/customer/signup'].includes(path)) {
      setInitialMode(path.includes('signup') || path.includes('register') ? 'signup' : 'login');
      setLoginOpen(true);
    }
  }, [location.pathname]);

  // Close the drawer once the viewport is wide enough for the real nav,
  // otherwise the page is left behind an invisible modal backdrop.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 64rem)');
    const onChange = (e) => {
      if (e.matches && drawerRef.current?.open) drawerRef.current.close();
    };
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Check initial scroll
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => drawerRef.current?.close();

  return (
    <>
      <CustomerLoginDialog open={loginOpen} onOpenChange={setLoginOpen} initialMode={initialMode} />

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white text-foreground shadow-tab dark:bg-card dark:text-foreground border-b border-rule'
            : 'bg-navy/85 backdrop-blur-md text-white shadow-none border-b border-white/10',
        )}
      >
        <UtilityBar onOpenLogin={() => {
          setInitialMode('login');
          setLoginOpen(true);
        }} />

        <div className="mx-auto flex max-w-[76rem] items-center justify-between gap-4 px-4 py-2.5">
          <Link
            to="/"
            onClick={() => {
              if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex shrink-0 items-center gap-2.5 cursor-pointer"
            aria-label="AKEEZO home"
          >
            <img
              src={isScrolled ? '/images/logo-dark.svg' : '/images/logo-light.svg'}
              alt="AKEEZO"
              className="h-7 sm:h-8 w-auto transition-opacity duration-300 hover:opacity-90"
            />
          </Link>

          <nav className="hidden lg:block" aria-label="Primary">
            <ul className="flex items-center gap-0.5">
              {navigation.map((group) => (
                <li key={group.label}>
                  <NavDropdown group={group} isScrolled={isScrolled} />
                </li>
              ))}
              <li>
                <Link
                  to="/blog"
                  className={cn(
                    'inline-flex items-center rounded-md px-3 py-2 text-sm font-bold transition-colors',
                    isScrolled
                      ? 'hover:bg-accent hover:text-primary'
                      : 'text-white/90 hover:bg-white/15 hover:text-white',
                  )}
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="#about"
                  className={cn(
                    'inline-flex items-center rounded-md px-3 py-2 text-sm font-bold transition-colors',
                    isScrolled
                      ? 'hover:bg-accent hover:text-primary'
                      : 'text-white/90 hover:bg-white/15 hover:text-white',
                  )}
                >
                  About
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              variant="outline"
              className={cn(
                'hidden font-bold lg:inline-flex transition-colors',
                !isScrolled && 'border-white/30 text-white bg-transparent hover:bg-white/20 hover:text-white',
              )}
            >
              <a href={telHref(site.emergencyPhone)}>
                <Phone aria-hidden="true" />
                <span className="visually-hidden">Call AKEEZO on </span>
                {formatPhone(site.emergencyPhone)}
              </a>
            </Button>

            {/* Brand + worded CTA + hamburger overflow 375px by 15px, so the
                CTA goes icon-only on the narrowest screens. It stays a red
                button either way, and the utility bar above still carries a
                tappable number, so the emergency affordance is never lost. */}
            <Button
              asChild
              size="icon"
              className="bg-emergency text-white hover:bg-emergency-strong sm:hidden"
            >
              <a href="#emergency">
                <Ambulance aria-hidden="true" />
                <span className="visually-hidden">Get emergency help</span>
              </a>
            </Button>

            <Button
              asChild
              className="hidden bg-emergency font-bold text-white hover:bg-emergency-strong sm:inline-flex"
            >
              <a href="#emergency">Emergency help</a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'lg:hidden border-0 bg-transparent shadow-none hover:bg-transparent p-1 h-auto w-auto focus-visible:ring-2 focus-visible:ring-primary',
                isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80',
              )}
              aria-label="Open menu"
              onClick={() => drawerRef.current?.showModal()}
            >
              <Menu className="size-7 stroke-[2.2]" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      {/* Native <dialog>: modal semantics, focus containment and Escape come
          free, so there is no focus-trap code of our own. */}
      <dialog
        ref={drawerRef}
        aria-label="Site menu"
        className={cn(
          'ml-auto h-dvh max-h-dvh w-[min(22rem,100vw)] max-w-full bg-card p-5 text-foreground',
          'overflow-y-auto backdrop:bg-black/55',
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2 cursor-pointer"
            aria-label="AKEEZO home"
          >
            <img src="/images/logo-dark.svg" alt="AKEEZO" className="h-7 w-auto dark:hidden" />
            <img src="/images/logo-light.svg" alt="AKEEZO" className="h-7 w-auto hidden dark:block" />
          </Link>
          <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent rounded-full size-9" aria-label="Close menu" onClick={close}>
            <X className="size-6 stroke-[2.2]" aria-hidden="true" />
          </Button>
        </div>

        <nav aria-label="Site">
          {navigation.map((group, i) => (
            <div key={group.label}>
              {i > 0 ? <Separator className="my-4" /> : null}
              <p className="mb-1 text-[0.7rem] font-bold tracking-[0.08em] text-muted-foreground uppercase">
                {group.label}
              </p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={close}
                      className="block py-1.5 text-sm font-medium hover:text-primary hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <Separator className="my-4" />
          <ul>
            <li>
              <Link
                to="/blog"
                onClick={close}
                className="block py-1.5 text-sm font-bold text-primary hover:underline"
              >
                Blog & Knowledge Hub
              </Link>
            </li>
            <li>
              <a
                href="#about"
                onClick={close}
                className="block py-1.5 text-sm font-medium hover:text-primary hover:underline"
              >
                About AKEEZO
              </a>
            </li>
            <li>
              <a
                href="#partners"
                onClick={close}
                className="block py-1.5 text-sm font-medium hover:text-primary hover:underline"
              >
                For partners
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-6 flex flex-col gap-2">
          <Button
            asChild
            className="w-full bg-emergency font-bold text-white hover:bg-emergency-strong"
          >
            <a href="#emergency" onClick={close}>
              Get emergency help
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full font-bold">
            <a href={telHref(site.emergencyPhone)}>
              <Phone aria-hidden="true" />
              {formatPhone(site.emergencyPhone)}
            </a>
          </Button>
        </div>
      </dialog>
    </>
  );
}
