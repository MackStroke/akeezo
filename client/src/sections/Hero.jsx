import { BadgeCheck, Globe2, Languages, ShieldCheck } from 'lucide-react';
import { SearchWidget } from '@/components/SearchWidget';

/**
 * MMT's hero is a shallow image band that the search card sits on top of and
 * overhangs. We keep the proportions but skip the photograph: there is no
 * honest stock image for "your father needs a bypass", and a hero image would
 * be the page's LCP for no informational gain. A teal gradient wash does the
 * same compositional job at zero bytes.
 */
const PROOF = [
  { icon: ShieldCheck, label: 'Accredited hospitals', note: 'NABH & JCI partners' },
  { icon: Globe2, label: 'Patients from 20+ countries', note: 'Africa, Gulf, CIS, South Asia' },
  { icon: Languages, label: '7 languages', note: 'Including Arabic, French, Swahili' },
  { icon: BadgeCheck, label: 'One coordinator', note: 'First call to follow-up' },
];

export function Hero({ onPlan, onEmergency, onHome }) {
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative">
      {/* Colour band behind the widget. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[22rem] bg-hero-band"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 120% at 15% 0%, color-mix(in oklab, var(--mint) 40%, transparent), transparent 60%), radial-gradient(ellipse 70% 100% at 90% 10%, color-mix(in oklab, var(--mint) 22%, transparent), transparent 65%)',
        }}
      />

      <div className="relative mx-auto max-w-[76rem] px-4 pt-10 pb-16 sm:pt-12">
        <div className="mb-7 max-w-3xl">
          <h1
            id="hero-heading"
            className="text-3xl text-white sm:text-4xl lg:text-[2.9rem]"
            style={{ color: '#fff' }}
          >
            Tell AKEEZO what you need.
            <br className="hidden sm:block" /> We figure out the healthcare journey.
          </h1>
          <p className="mt-3 max-w-2xl text-[0.98rem] text-white/85">
            Not a hospital. Not a booking site. AKEEZO coordinates the whole journey in India —
            hospital and doctor options, an itemised estimate, travel and visa support, then care at
            home afterwards.
          </p>
        </div>

        <SearchWidget onPlan={onPlan} onEmergency={onEmergency} onHome={onHome} />

        {/* Trust strip, clear of the CTA that overhangs the card. */}
        <ul className="mt-16 grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-6 lg:grid-cols-4">
          {PROOF.map(({ icon: Icon, label, note }) => (
            <li key={label} className="flex items-start gap-2.5">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-ink-strong">{label}</span>
                <span className="block text-xs text-muted-foreground">{note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
