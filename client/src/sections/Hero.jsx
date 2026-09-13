import { BadgeCheck, ChevronRight, Globe2, Languages, ShieldCheck } from 'lucide-react';
import { SearchWidget } from '@/components/SearchWidget';

/**
 * MMT's hero is a shallow image band that the search card sits on top of and
 * overhangs. We keep the proportions but skip the photograph: there is no
 * honest stock image for "your father needs a bypass", and a hero image would
 * be the page's LCP for no informational gain. A teal gradient wash does the
 * same compositional job at zero bytes.
 */
const PROOF = [
  {
    id: 'accredited',
    icon: ShieldCheck,
    title: 'Accredited Hospitals',
    note: 'NABH & JCI partner network',
    badge: 'VERIFIED',
  },
  {
    id: 'global',
    icon: Globe2,
    title: 'Global Patients',
    note: 'Africa, Gulf, CIS & South Asia',
    badge: '20+ COUNTRIES',
  },
  {
    id: 'multilingual',
    icon: Languages,
    title: 'Multi Languages Support',
    note: 'Arabic, French, Swahili & more',
    badge: '24/7 CARE',
  },
  {
    id: 'coordinator',
    icon: BadgeCheck,
    title: 'Single Coordinator',
    note: 'First call to complete recovery',
    badge: 'DEDICATED',
  },
];

export function Hero({ onPlan, onEmergency, onHome }) {
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative">
      {/* Colour band & hero background image behind the widget. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[22rem] bg-hero-band overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url("/images/hero section.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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

        {/* MMT-style Explore More / Care Features strip */}
        <div data-cy="tertiaryRowContainer" className="choosFrom mt-12 mb-4">
          <div data-cy="tertiaryRowHeaderContainer" className="choosFrom__header mb-3.5 flex items-center justify-center gap-3">
            <span data-cy="tertiaryRowHeaderIconLeft" className="makeFlex column arwWrap text-primary flex items-center -space-x-1">
              <ChevronRight className="size-3.5 rotate-180" />
              <ChevronRight className="size-3.5 rotate-180" />
            </span>
            <span data-cy="tertiaryRowHeaderText" className="choosFrom__header--text text-[0.78rem] font-black uppercase tracking-widest text-muted-foreground">
              Explore AKEEZO Care
            </span>
            <span data-cy="tertiaryRowHeaderIconRight" className="makeFlex column arwWrap text-primary flex items-center -space-x-1">
              <ChevronRight className="size-3.5" />
              <ChevronRight className="size-3.5" />
            </span>
          </div>

          <div className="choosFrom__wrap rounded-[var(--radius)] border border-rule bg-card p-3 shadow-card sm:p-4">
            <ul data-cy="tertiaryRowItemsContainer" className="choosFrom__list grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PROOF.map(({ id, icon: Icon, title, note, badge }) => (
                <li
                  key={id}
                  data-cy={`tertiaryRowItem_${id}`}
                  className="choosFrom__list--item group flex items-center gap-3 rounded-lg border border-transparent p-2.5 transition-all duration-200 hover:border-primary/30 hover:bg-accent/50 cursor-pointer"
                >
                  <span data-cy={`tertiaryRowIcon_${id}`} className="choosFrom__list--itemIcon flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-all duration-200 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="choosFrom__list--itemDesc flex flex-1 flex-col">
                    <p data-cy={`tertiaryRowTitle_${id}`} className="flex items-center gap-1.5 font-sans text-[0.88rem] font-bold text-ink-strong group-hover:text-primary">
                      <span>{title}</span>
                      {badge && (
                        <span data-cy="newTag" className="trpMnyHdr__new rounded-full bg-primary/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-primary">
                          {badge}
                        </span>
                      )}
                    </p>
                    <span data-cy={`tertiaryRowSubTitle_${note}`} className="mt-0.5 text-xs text-muted-foreground">{note}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
