import { Ambulance, ArrowRight, HouseHeart, Plane } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * The three doors, as MMT-style offer cards.
 *
 * The widget above already puts all three journeys one tab away, so these
 * restate them for anyone who scrolled past it — and give the emergency path a
 * second, unmissable entry point.
 */
const ENTRIES = [
  {
    icon: Plane,
    title: 'Plan My Treatment',
    blurb:
      'Treatment, surgery, a consultation or a second opinion in India - planned properly, with the cost visible before you travel.',
    bullets: ['Hospital & doctor options', 'Itemised estimate', 'Visa, travel & stay'],
    cta: 'Start my healthcare journey',
    href: '/hospitals',
    type: 'plan',
    image: '/images/medical_tourism_plan.webp',
    imageAlt: 'Medical tourism treatment planning',
  },
  {
    icon: Ambulance,
    title: 'Need Emergency Help',
    blurb:
      'Someone needs urgent medical help at home, in a hotel, at an airport, while travelling etc. Share the concern and coordinates, Akeezo reaches in no time.',
    bullets: [
      'Emergency response require first aid from medical experts',
      'General attendant/nurses on hourly/weekly/monthly basis from renowned hospital',
      'Family kept informed on each and every parameter',
    ],
    cta: 'Get emergency help',
    href: '#emergency',
    type: 'emergency',
    image: '/images/emergency_help_response.webp',
    imageAlt: '24/7 Medical emergency response',
  },
  {
    icon: HouseHeart,
    title: 'Looking for Home Healthcare',
    blurb:
      'A Doctor, nurse, attendant, physiotherapist, dentist visit at home - including post-operative, maternity, jhapa maids, or elder care.',
    bullets: ['Nurses & caregivers', 'Doctor visits & Physiotherapy', 'Post-operative & elder care'],
    cta: 'Find any kind of care at home',
    href: '#home-care',
    type: 'home',
    image: '/images/neonatal-care.jpeg',
    imageAlt: 'Home healthcare and nursing care',
  },
];

export function EntryPoints() {
  return (
    <section aria-labelledby="entry-heading" className="bg-sunk py-12">
      <div className="mx-auto max-w-[76rem] px-4">
        <h2 id="entry-heading" className="text-2xl sm:text-[1.75rem]">
          How Akeezo can help?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every requirement is different and we are here to support which requires utmost attention.
        </p>

        <ul className="mt-6 grid gap-5 md:grid-cols-3">
          {ENTRIES.map(({ icon: Icon, title, blurb, bullets, cta, href, type, image, imageAlt }) => {
            const isPlan = type === 'plan';
            const isEmergency = type === 'emergency';

            return (
              <li key={title}>
                {/* The heading holds the only link; its ::after stretches the hit
                    area across the card, so there is one accessible name per
                    destination instead of three overlapping links. */}
                <Card
                  className={cn(
                    'group relative h-full flex-col overflow-hidden p-0 transition-all duration-200',
                    'has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2',
                    isEmergency
                      ? 'border-emergency/35 bg-emergency-surface has-[a:hover]:shadow-widget-emergency has-[a:focus-visible]:shadow-widget-emergency has-[a:focus-visible]:outline-emergency'
                      : isPlan
                        ? 'hover:border-mint/50 has-[a:hover]:shadow-widget has-[a:focus-visible]:shadow-widget has-[a:focus-visible]:outline-mint'
                        : 'hover:border-primary/50 has-[a:hover]:shadow-widget-orange has-[a:focus-visible]:shadow-widget-orange has-[a:focus-visible]:outline-primary',
                  )}
                >
                  {/* Image Banner Header - Exact 16:9 view frame fit */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt={imageAlt}
                      className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                    <span
                      className={cn(
                        'absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-md shadow-lg backdrop-blur-xs border border-white/20',
                        isEmergency
                          ? 'bg-emergency text-white'
                          : isPlan
                            ? 'bg-mint text-white'
                            : 'bg-primary text-white',
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" strokeWidth={1.8} />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-lg font-black">
                      <a href={href} className="after:absolute after:inset-0 after:rounded-[inherit]">
                        {title}
                      </a>
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">{blurb}</p>

                    <ul className="flex flex-col gap-1.5 mt-1">
                      {bullets.map((b) => (
                        <li key={b} className="relative pl-4 text-xs font-medium text-muted-foreground">
                          <span
                            aria-hidden="true"
                            className={cn(
                              'absolute top-[0.55em] left-0 size-1.5 rounded-full',
                              isEmergency
                                ? 'bg-emergency'
                                : isPlan
                                  ? 'bg-mint'
                                  : 'bg-primary',
                            )}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>

                    {/* Visual affordance only — the card is already one link. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-bold',
                        isEmergency
                          ? 'text-emergency-ink'
                          : isPlan
                            ? 'text-mint'
                            : 'text-primary',
                      )}
                    >
                      {cta}
                      <ArrowRight className="size-4 transition-transform group-has-[a:hover]:translate-x-1" />
                    </span>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
