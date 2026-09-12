import {
  Activity,
  Baby,
  Bone,
  Brain,
  ClipboardList,
  HeartPulse,
  Ribbon,
  Smile,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { treatments, cities } from '@/lib/site';

/**
 * MMT's category tiles: a dense grid of icon + label, each one a filter into
 * the search above rather than a separate page.
 */
const ICONS = {
  cardiac: HeartPulse,
  oncology: Ribbon,
  orthopaedics: Bone,
  neurology: Brain,
  transplant: Activity,
  fertility: Baby,
  'second-opinion': ClipboardList,
  dental: Smile,
  cosmetic: Sparkles,
  diagnosis: Stethoscope,
};

function DelhiIllustration(props) {
  return (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="80" cy="40" r="22" fill="#FDBA74" opacity="0.4" />
      <rect x="25" y="80" width="110" height="6" fill="#1E293B" opacity="0.8" />
      <path d="M40 80V35L48 26H112L120 35V80H106V40H54V80H40Z" fill="#F97316" />
      <path d="M62 80V48C62 40 98 40 98 48V80H62Z" fill="#FFEDD5" />
      <rect x="42" y="24" width="76" height="6" fill="#EA580C" />
      <rect x="52" y="16" width="56" height="8" fill="#C2410C" />
    </svg>
  );
}

function MumbaiIllustration(props) {
  return (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="80" cy="45" r="24" fill="#60A5FA" opacity="0.3" />
      <path d="M0 82Q40 78 80 82T160 82V90H0Z" fill="#3B82F6" opacity="0.3" />
      <rect x="20" y="80" width="120" height="6" fill="#1E293B" opacity="0.8" />
      <path d="M35 80V32L45 22H115L125 32V80H105V42C105 32 55 32 55 42V80H35Z" fill="#2563EB" />
      <path d="M60 80V46C60 36 100 36 100 46V80H60Z" fill="#DBEAFE" />
      <path d="M42 80V60C42 55 48 55 48 60V80H42Z" fill="#DBEAFE" />
      <path d="M112 80V60C112 55 118 55 118 60V80H112Z" fill="#DBEAFE" />
      <path d="M65 22C65 14 95 14 95 22H65Z" fill="#1D4ED8" />
    </svg>
  );
}

function ChennaiIllustration(props) {
  return (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="80" cy="40" r="22" fill="#FCA5A5" opacity="0.3" />
      <rect x="30" y="80" width="100" height="6" fill="#1E293B" opacity="0.8" />
      <path d="M45 80L52 62H108L115 80H45Z" fill="#DC2626" />
      <path d="M52 62L58 46H102L108 62H52Z" fill="#EF4444" />
      <path d="M58 46L64 32H96L102 46H58Z" fill="#F87171" />
      <path d="M64 32L70 20H90L96 32H64Z" fill="#FCA5A5" />
      <rect x="74" y="14" width="12" height="6" fill="#B91C1C" />
      <circle cx="80" cy="11" r="3" fill="#F59E0B" />
      <path d="M70 80V66C70 60 90 60 90 66V80H70Z" fill="#FEF2F2" />
    </svg>
  );
}

function HyderabadIllustration(props) {
  return (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="80" cy="42" r="22" fill="#6EE7B7" opacity="0.35" />
      <rect x="25" y="80" width="110" height="6" fill="#1E293B" opacity="0.8" />
      <rect x="42" y="40" width="76" height="40" fill="#059669" />
      <path d="M62 80V52C62 42 98 42 98 52V80H62Z" fill="#D1FAE5" />
      <rect x="34" y="14" width="12" height="66" fill="#047857" />
      <rect x="114" y="14" width="12" height="66" fill="#047857" />
      <path d="M34 14C34 8 46 8 46 14H34Z" fill="#065F46" />
      <path d="M114 14C114 8 126 8 126 14H114Z" fill="#065F46" />
      <rect x="38" y="32" width="84" height="8" fill="#10B981" />
    </svg>
  );
}

function BengaluruIllustration(props) {
  return (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="80" cy="38" r="24" fill="#C084FC" opacity="0.3" />
      <rect x="20" y="80" width="120" height="6" fill="#1E293B" opacity="0.8" />
      <rect x="30" y="48" width="100" height="32" fill="#7C3AED" />
      <path d="M60 48L80 24L100 48H60Z" fill="#6D28D9" />
      <path d="M68 28C68 16 92 16 92 28H68Z" fill="#9333EA" />
      <circle cx="80" cy="13" r="3" fill="#F59E0B" />
      <path d="M65 80V54C65 48 95 48 95 54V80H65Z" fill="#F3E8FF" />
    </svg>
  );
}

function KolkataIllustration(props) {
  return (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="80" cy="40" r="22" fill="#38BDF8" opacity="0.3" />
      <path d="M0 80Q40 76 80 80T160 80V90H0Z" fill="#0284C7" opacity="0.3" />
      <path d="M30 80L45 16L60 80H30Z" fill="#0284C7" />
      <path d="M100 80L115 16L130 80H100Z" fill="#0284C7" />
      <path d="M45 16L80 40L115 16" stroke="#0369A1" strokeWidth="3" />
      <path d="M10 65H150" stroke="#0369A1" strokeWidth="4" />
    </svg>
  );
}

function AhmedabadIllustration(props) {
  return (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="80" cy="40" r="22" fill="#FBBF24" opacity="0.35" />
      <rect x="25" y="80" width="110" height="6" fill="#1E293B" opacity="0.8" />
      <rect x="42" y="32" width="14" height="48" fill="#D97706" />
      <rect x="104" y="32" width="14" height="48" fill="#D97706" />
      <path d="M38 32C50 20 110 20 122 32H38Z" fill="#B45309" />
      <circle cx="80" cy="18" r="4" fill="#F59E0B" />
    </svg>
  );
}

function KochiIllustration(props) {
  return (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="100" cy="35" r="22" fill="#2DD4BF" opacity="0.35" />
      <path d="M0 80Q40 76 80 80T160 80V90H0Z" fill="#0D9488" opacity="0.3" />
      <path d="M25 80L135 25" stroke="#0F766E" strokeWidth="4" strokeLinecap="round" />
      <path d="M75 52L25 20" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
      <path d="M75 52L145 80" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
      <path d="M135 25L145 80L85 80Z" fill="#CCFBF1" opacity="0.7" stroke="#0D9488" strokeWidth="1.5" />
    </svg>
  );
}

const CITY_DATA = [
  {
    name: 'Delhi NCR',
    state: 'Delhi / Haryana / UP',
    tag: 'Cardiac, Cancer & Transplants',
    bgGradient: 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent',
    illustration: DelhiIllustration,
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    tag: 'Advanced Surgery & Ortho',
    bgGradient: 'bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent',
    illustration: MumbaiIllustration,
  },
  {
    name: 'Chennai',
    state: 'Tamil Nadu',
    tag: 'Multi-organ & Heart Hub',
    bgGradient: 'bg-gradient-to-br from-red-500/15 via-rose-500/10 to-transparent',
    illustration: ChennaiIllustration,
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    tag: 'Robotics & Liver Transplants',
    bgGradient: 'bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent',
    illustration: HyderabadIllustration,
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    tag: 'Oncology & Bone Marrow',
    bgGradient: 'bg-gradient-to-br from-purple-500/15 via-violet-500/10 to-transparent',
    illustration: BengaluruIllustration,
  },
  {
    name: 'Kolkata',
    state: 'West Bengal',
    tag: 'Super Speciality & Cardio',
    bgGradient: 'bg-gradient-to-br from-sky-500/15 via-cyan-500/10 to-transparent',
    illustration: KolkataIllustration,
  },
  {
    name: 'Ahmedabad',
    state: 'Gujarat',
    tag: 'Nephrology & Joint Care',
    bgGradient: 'bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-transparent',
    illustration: AhmedabadIllustration,
  },
  {
    name: 'Kochi',
    state: 'Kerala',
    tag: 'Ayurveda & Rehabilitation',
    bgGradient: 'bg-gradient-to-br from-teal-500/15 via-emerald-500/10 to-transparent',
    illustration: KochiIllustration,
  },
];

export function Treatments() {
  return (
    <section id="treatments" aria-labelledby="treatments-heading" className="bg-sunk py-14">
      <div className="mx-auto max-w-[76rem] px-4">
        <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">
          What do you need?
        </p>
        <h2 id="treatments-heading" className="mt-2 text-2xl sm:text-[1.85rem]">
          Start from the treatment
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Pick the closest match — or tell us in your own words. If you are not sure what you need
          yet, that is a normal place to start and we will help you work it out.
        </p>

        <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[...treatments, { id: 'not-sure', label: "I'm not sure — help me decide" }].map((t) => {
            const Icon = ICONS[t.id] ?? Stethoscope;
            return (
              <li key={t.id}>
                <a
                  href="#top"
                  className="flex h-full items-center gap-3 rounded-md border border-rule bg-card px-3.5 py-3 text-sm font-bold transition-colors hover:border-primary/50 hover:bg-accent hover:text-primary"
                >
                  <Icon
                    className="size-5 shrink-0 text-primary"
                    aria-hidden="true"
                    strokeWidth={1.7}
                  />
                  <span className="min-w-0 text-xs sm:text-sm">{t.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-12">
          <h3 className="text-xl font-black text-ink-strong sm:text-2xl">Where would you like to be treated?</h3>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Select a medical hub city in India. We match you with leading accredited hospitals, top specialists, and full travel coordination.
          </p>
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {CITY_DATA.map((c) => {
              const LandmarkIllustration = c.illustration;
              return (
                <li key={c.name} className="h-full">
                  <a
                    href="#top"
                    className="group flex flex-col justify-between overflow-hidden rounded-[var(--radius)] border border-rule bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-widget active:scale-[0.99] touch-manipulation h-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    {/* Top Visual Monument Landmark Illustration Banner */}
                    <div className={`relative h-24 sm:h-28 w-full flex items-center justify-center p-2.5 sm:p-3 border-b border-rule/60 overflow-hidden ${c.bgGradient}`}>
                      <LandmarkIllustration className="h-full w-auto max-w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105" />
                      <span className="absolute top-2 right-2 rounded-full bg-background/90 backdrop-blur-md px-2 sm:px-2.5 py-0.5 text-[0.62rem] sm:text-[0.68rem] font-bold text-foreground border border-rule shadow-xs">
                        {c.state}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-ink-strong group-hover:text-primary transition-colors leading-tight">
                          {c.name}
                        </h4>
                      </div>

                      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-rule/60 flex items-center justify-between text-[0.65rem] sm:text-[0.72rem] text-foreground font-bold leading-tight gap-1">
                        <span className="line-clamp-1">{c.tag}</span>
                        <span className="text-primary shrink-0 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}

            {/* Special Recommendation Card */}
            <li className="h-full col-span-2 sm:col-span-1">
              <a
                href="#top"
                className="group flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius)] border border-primary/40 bg-accent/40 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:bg-accent hover:shadow-widget active:scale-[0.99] touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <div className="relative h-24 sm:h-28 w-full flex items-center justify-center p-2.5 sm:p-3 border-b border-primary/20 bg-gradient-to-br from-primary/20 via-accent to-transparent overflow-hidden">
                  <Sparkles className="size-10 sm:size-12 text-primary animate-pulse" />
                  <span className="absolute top-2 right-2 rounded-full bg-primary/10 px-2 sm:px-2.5 py-0.5 text-[0.62rem] sm:text-[0.68rem] font-bold text-primary border border-primary/20">
                    Smart Matching
                  </span>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-primary leading-tight">
                      Recommend a City
                    </h4>
                    <p className="text-[0.7rem] sm:text-xs text-muted-foreground font-medium mt-0.5 sm:mt-1">
                      Based on specialty, doctors & travel
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-primary/20 flex items-center justify-between text-[0.65rem] sm:text-[0.72rem] font-bold text-primary gap-1">
                    <span>Let AKEEZO figure it out</span>
                    <span className="shrink-0 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
