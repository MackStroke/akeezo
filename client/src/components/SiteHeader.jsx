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
import { navigation, site, formatPhone, telHref, whatsappHref } from '@/lib/site';
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
    <div className="hidden lg:block bg-black text-white">
      <div className="mx-auto flex max-w-[76rem] flex-wrap items-center justify-between gap-x-6 gap-y-1.5 px-4 py-1.5 text-[0.78rem]">
        <p className="flex items-center gap-2 font-bold flex-wrap">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emergency opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-emergency" />
          </span>
          Medical emergency? Call:
          <a href={telHref(site.emergencyPhone)} className="underline decoration-2 text-white hover:text-primary transition-colors">
            {formatPhone(site.emergencyPhone)}
          </a>
          <span className="font-normal text-white/50">· 24/7</span>
          <span className="text-white/30 hidden sm:inline">|</span>
          <a
            href={whatsappHref('Hello AKEEZO, I need help with a healthcare requirement.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-[#25D366] hover:underline"
          >
            WhatsApp: {formatPhone(site.emergencyPhone)}
          </a>
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
  const { customerUser, isAuthenticated } = useCustomerAuth();

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

  const [openGroups, setOpenGroups] = useState({
    'Medical tourism': true,
  });

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

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
              <a href="#emergency">
                <Ambulance aria-hidden="true" />
                Emergency help
              </a>
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

      {/* Structured Dropdown Accordion Mobile Navigation Drawer */}
      <dialog
        ref={drawerRef}
        aria-label="Site menu"
        className={cn(
          'ml-auto h-dvh max-h-dvh w-[min(24rem,100vw)] max-w-full bg-card p-4 sm:p-5 text-foreground',
          'overflow-y-auto backdrop:bg-black/60 shadow-2xl border-l border-rule select-none',
        )}
      >
        {/* Drawer Header */}
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-rule/60 pb-3">
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2 cursor-pointer"
            aria-label="AKEEZO home"
          >
            <img src="/images/logo-dark.svg" alt="AKEEZO" className="h-7 w-auto dark:hidden" />
            <img src="/images/logo-light.svg" alt="AKEEZO" className="h-7 w-auto hidden dark:block" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-accent rounded-full size-9 shrink-0"
            aria-label="Close menu"
            onClick={close}
          >
            <X className="size-6 stroke-[2.2]" aria-hidden="true" />
          </Button>
        </div>

        {/* User Account & Currency Bar */}
        <div className="mb-4 rounded-xl border border-rule/80 bg-accent/40 p-3 flex items-center justify-between gap-2 shadow-xs">
          {isAuthenticated ? (
            <Link
              to="/my-journey"
              onClick={close}
              className="flex items-center gap-2 font-bold text-sm text-primary hover:underline truncate"
            >
              <span className="size-7 rounded-full bg-primary text-white font-black flex items-center justify-center text-xs shrink-0">
                {customerUser?.name?.charAt(0) || 'P'}
              </span>
              <span className="truncate">My Journey ({customerUser?.name?.split(' ')[0]})</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                close();
                setInitialMode('login');
                setLoginOpen(true);
              }}
              className="flex items-center gap-2 text-xs font-extrabold text-ink-strong hover:text-primary cursor-pointer bg-transparent border-0 p-0 text-left"
            >
              <UserRound className="size-4 text-primary shrink-0" aria-hidden="true" />
              <span>Patient Portal / Login</span>
            </button>
          )}

          <div className="shrink-0">
            <LocaleSelector />
          </div>
        </div>

        {/* Dropdown Accordion Navigation List */}
        <nav aria-label="Site" className="space-y-2">
          {navigation.map((group) => {
            const isOpen = Boolean(openGroups[group.label]);

            return (
              <div
                key={group.label}
                className={cn(
                  'rounded-xl border transition-all duration-200 overflow-hidden',
                  isOpen ? 'border-primary/40 bg-accent/20 shadow-xs' : 'border-rule/70 bg-card hover:border-primary/30',
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between p-3 text-left text-xs sm:text-sm font-extrabold text-ink-strong hover:text-primary cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="uppercase tracking-wider text-[0.72rem] text-primary font-black">
                      {group.label}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'size-4 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180 text-primary',
                    )}
                  />
                </button>

                {isOpen && (
                  <ul className="px-2 pb-2.5 space-y-0.5 border-t border-rule/40 pt-1.5 bg-card/60">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          onClick={close}
                          className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <span>{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          {/* Collapsible Partners & Portals Group */}
          {(() => {
            const isPartnersOpen = Boolean(openGroups['Partners & Portals']);
            return (
              <div
                className={cn(
                  'rounded-xl border transition-all duration-200 overflow-hidden',
                  isPartnersOpen ? 'border-primary/40 bg-accent/20 shadow-xs' : 'border-rule/70 bg-card hover:border-primary/30',
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleGroup('Partners & Portals')}
                  className="w-full flex items-center justify-between p-3 text-left text-xs sm:text-sm font-extrabold text-ink-strong hover:text-primary cursor-pointer"
                >
                  <span className="uppercase tracking-wider text-[0.72rem] text-primary font-black">
                    Partners & Portals
                  </span>
                  <ChevronDown
                    className={cn(
                      'size-4 text-muted-foreground transition-transform duration-200',
                      isPartnersOpen && 'rotate-180 text-primary',
                    )}
                  />
                </button>

                {isPartnersOpen && (
                  <ul className="px-2 pb-2.5 space-y-0.5 border-t border-rule/40 pt-1.5 bg-card/60">
                    <li>
                      <a
                        href="#partners"
                        onClick={close}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Building2 className="size-3.5 text-primary shrink-0" aria-hidden="true" />
                        <span>List your hospital</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#partners"
                        onClick={close}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Globe className="size-3.5 text-primary shrink-0" aria-hidden="true" />
                        <span>Agent portal</span>
                      </a>
                    </li>
                    <li>
                      <Link
                        to="/blog"
                        onClick={close}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <span>Blog & Knowledge Hub</span>
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#about"
                        onClick={close}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <span>About AKEEZO</span>
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            );
          })()}
        </nav>

        {/* Bottom Emergency Contacts */}
        <div className="mt-5 space-y-2 border-t border-rule/60 pt-3">
          <p className="text-[0.65rem] font-black tracking-[0.1em] text-emergency uppercase px-1">
            24/7 Emergency Assistance
          </p>
          <Button
            asChild
            className="w-full bg-emergency font-bold text-white hover:bg-emergency-strong shadow-md justify-center text-xs h-9"
          >
            <a href="#emergency" onClick={close}>
              <Ambulance className="size-3.5 mr-1.5" />
              Get Emergency Help
            </a>
          </Button>

          <Button asChild variant="outline" className="w-full font-bold justify-center border-emergency/30 text-emergency hover:bg-emergency/10 text-xs h-9">
            <a href={telHref(site.emergencyPhone)}>
              <Phone className="size-3.5 mr-1.5" aria-hidden="true" />
              Call: {formatPhone(site.emergencyPhone)}
            </a>
          </Button>

          <a
            href={whatsappHref('Hello AKEEZO, I need help with a healthcare requirement.')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 px-3 py-2 text-xs font-extrabold text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
          >
            <span>WhatsApp Assistance</span>
          </a>
        </div>
      </dialog>
    </>
  );
}
