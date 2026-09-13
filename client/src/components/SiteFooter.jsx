import { Link } from 'react-router-dom';
import { Globe, Handshake, HeartHandshake, PhoneCall, ShieldAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Logomark } from '@/components/Logomark';
import { navigation, site, formatPhone, telHref } from '@/lib/site';
import { useSocialLinks } from '@/lib/socialStore';

const SocialIcon = ({ id, className = 'size-4' }) => {
  switch (id) {
    case 'facebook':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.415 1.065 2.747 1.213 2.945c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.794 0-3.557-.482-5.111-1.396l-.367-.217-3.797.996 1.014-3.7-.238-.379a9.85 9.85 0 0 1-1.516-5.26c0-5.446 4.431-9.877 9.877-9.877 2.638 0 5.119 1.028 6.984 2.894 1.865 1.866 2.892 4.347 2.891 6.985 0 5.447-4.431 9.878-9.877 9.878" />
        </svg>
      );
    default:
      return <Globe className={className} />;
  }
};

export function SiteFooter() {
  const year = new Date().getFullYear();
  const socialLinks = useSocialLinks();
  const activeSocials = socialLinks.filter((s) => s.enabled && s.url);

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
            <div className="mt-4 flex flex-col gap-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <PhoneCall className="size-3.5" aria-hidden="true" />
                </span>
                <span className="font-bold text-ink-strong">24/7 Desk: </span>
                <a href={telHref(site.emergencyPhone)} className="font-bold text-primary underline">
                  {formatPhone(site.emergencyPhone)}
                </a>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <HeartHandshake className="size-3.5" aria-hidden="true" />
                  </span>
                  <strong className="text-foreground font-semibold">Care Team: </strong>
                  <a href={`mailto:${site.careEmail}`} className="font-bold text-primary underline">
                    {site.careEmail}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <Globe className="size-3.5" aria-hidden="true" />
                  </span>
                  <strong className="text-foreground font-semibold">Medical Tourism: </strong>
                  <a href={`mailto:${site.medicalEmail}`} className="font-bold text-primary underline">
                    {site.medicalEmail}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <Handshake className="size-3.5" aria-hidden="true" />
                  </span>
                  <strong className="text-foreground font-semibold">Partners: </strong>
                  <a href={`mailto:${site.partnersEmail}`} className="font-bold text-primary underline">
                    {site.partnersEmail}
                  </a>
                </div>
              </div>

              {/* Social Media Icons Strip */}
              {activeSocials.length > 0 && (
                <div className="mt-5 pt-3.5 border-t border-rule/60 flex flex-col gap-2">
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Connect with AKEEZO
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeSocials.map((social) => (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`AKEEZO on ${social.name}`}
                        className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-xs"
                        title={social.name}
                      >
                        <SocialIcon id={social.id} className="size-4" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between">
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

            {/* Medical Disclaimer Banner */}
            <div className="mt-8 rounded-xl border border-rule/80 bg-accent/40 p-4 sm:p-5 text-xs text-muted-foreground leading-relaxed shadow-xs">
              <div className="flex items-center gap-2 font-extrabold text-ink-strong text-xs mb-1.5 uppercase tracking-wider">
                <ShieldAlert className="size-4 text-primary shrink-0" />
                <span>Medical Disclaimer</span>
              </div>
              <p>
                AKEEZO coordinates healthcare journey services; it does not practise medicine and does not provide medical advice, diagnosis, or treatment. All clinical decisions rest entirely with accredited treating doctors and hospitals. Costs displayed across this platform are estimates subject to clinical evaluation. In a life-threatening emergency, contact your local emergency response immediately.
              </p>
            </div>
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
            {[
              { label: 'Privacy policy', path: '/privacy' },
              { label: 'Terms of service', path: '/terms' },
              { label: 'Medical disclaimer', path: '/disclaimer' },
              { label: 'Patient data & consent', path: '/consent' },
            ].map(({ label, path }) => (
              <li key={label}>
                <Link to={path} className="hover:text-primary hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
