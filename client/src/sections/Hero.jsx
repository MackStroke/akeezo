import { useState, useEffect } from 'react';
import {
  BadgeCheck,
  Building2,
  ChevronRight,
  FileSpreadsheet,
  Heart,
  HeartHandshake,
  ShieldCheck,
  UserCheck,
  Pill,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchWidget } from '@/components/SearchWidget';

const MISSION_SLIDES = [
  '“No one should be deprived of healthcare because of budget constraints, financial limitations, or lack of access.”',
  '“Tell us your requirements, & of course the budget. We’ll help you figure out the next steps.”',
];

const PROOF = [
  {
    id: 'treatment-plan',
    icon: Building2,
    title: 'Top Partner Hospitals',
    note: 'JCI & NABH Accredited Desks',
    badge: 'VERIFIED',
  },
  {
    id: 'cost-estimate',
    icon: FileSpreadsheet,
    title: 'Itemised Bill Estimates',
    note: 'Upfront prices with ₹0 hidden fees',
    badge: 'TRANSPARENT',
  },
  {
    id: 'travel-support',
    icon: UserCheck,
    title: 'Visa & Stay Assistance',
    note: 'Airport pickup & local logistics',
    badge: 'FULL SUPPORT',
  },
  {
    id: 'continuum-care',
    icon: BadgeCheck,
    title: 'Single Coordinator',
    note: 'First call to complete recovery',
    badge: 'DEDICATED',
  },
];

export function Hero({ onPlan, onEmergency, onHome, onMedicines }) {
  const [activeTab, setActiveTab] = useState('plan');
  
  const THEME_COLORS = {
    plan: { start: '#00c7be', end: '#009b94' },
    home: { start: '#ff6b00', end: '#db5800' },
    emergency: { start: '#d92d20', end: '#a32118' },
    medicines: { start: '#ff6b00', end: '#db5800' },
  };
  
  const currentColors = THEME_COLORS[activeTab] || THEME_COLORS.plan;

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % MISSION_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="top" aria-labelledby="hero-heading" className="relative">
      {/* Colour band & hero background image behind the widget. */}
              <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[353px] sm:h-[400px] w-full overflow-hidden z-0"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 256" 
            fill="none" 
            preserveAspectRatio="xMidYMax slice"
            className="absolute inset-0 w-full h-full"
          >
            <path fill="url(#curveGradient)" fillRule="evenodd" d="M1440 167.207C1224.62 223.655 980.573 255.5 722 255.5c-260.175 0-505.644-32.241-722-89.345V0h1440v167.207Z" clipRule="evenodd"/>
            <defs>
              <linearGradient id="curveGradient" x1="0" x2="1048.73" y1="0" y2="787.836" gradientUnits="userSpaceOnUse">
                <stop stopColor={currentColors.start} className="transition-all duration-500 ease-in-out" />
                <stop offset="1" stopColor={currentColors.end} className="transition-all duration-500 ease-in-out" />
              </linearGradient>
            </defs>
          </svg>
        </div>

      <div className="relative mx-auto max-w-[76rem] px-4 pt-10 pb-16 sm:pt-12">
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <h1
              id="hero-heading"
              className="text-3xl text-white sm:text-4xl lg:text-[2.75rem] font-black leading-tight tracking-tight"
              style={{ color: '#fff' }}
            >
              Looking for the right treatment within your budget?
            </h1>
            <p className="mt-3 max-w-2xl text-[0.98rem] sm:text-base text-white/90 font-medium leading-relaxed">
              Akeezo helps you explore suitable healthcare options based on your medical needs and budget, helping you make informed choices for your care.
            </p>
          </div>

          {/* Floating White Box with Auto-Rotating 4s Text Slider */}
          <div className="lg:col-span-5 relative mt-3 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative rounded-2xl border-2 border-primary/40 bg-white/95 dark:bg-card/95 p-4.5 sm:p-5 text-foreground shadow-[0_12px_36px_rgba(255,107,0,0.18)] backdrop-blur-md overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/30 mt-0.5">
                  <Heart className="size-5 fill-primary/20 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[0.62rem] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      OUR MISSION
                    </span>
                    {/* Slide Pagination Dots */}
                    <div className="flex items-center gap-1">
                      {MISSION_SLIDES.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveSlide(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            activeSlide === idx ? 'w-4 bg-primary' : 'w-1.5 bg-primary/25 hover:bg-primary/50'
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative min-h-[4rem] sm:min-h-[3.6rem] mt-1.5 flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeSlide}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="font-serif text-sm sm:text-[0.95rem] font-extrabold leading-snug text-slate-900 dark:text-white"
                      >
                        {MISSION_SLIDES[activeSlide]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Small Floating Teal Icon Badge (Top Right) */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, 2.5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3.5 -right-2 sm:-right-3 flex items-center gap-1.5 rounded-xl border border-white/40 bg-mint px-2.5 sm:px-3 py-1 text-white shadow-lg backdrop-blur-xs text-[0.72rem] sm:text-xs font-extrabold z-10"
            >
              <ShieldCheck className="size-3.5 text-white shrink-0" />
              <span>Verified Care</span>
            </motion.div>

            {/* Small Floating Orange Icon Badge (Bottom Left) */}
            <motion.div
              animate={{ y: [0, 6, 0], rotate: [0, -2.5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-3.5 -left-2 sm:-left-3 flex items-center gap-1.5 rounded-xl border border-white/40 bg-primary px-2.5 sm:px-3 py-1 text-white shadow-lg backdrop-blur-xs text-[0.72rem] sm:text-xs font-extrabold z-10"
            >
              <HeartHandshake className="size-3.5 text-white shrink-0" />
              <span>Budget Inclusive</span>
            </motion.div>
          </div>
        </div>

        <SearchWidget onTabChange={setActiveTab} onPlan={onPlan} onEmergency={onEmergency} onHome={onHome} onMedicines={onMedicines} />

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

        {/* Mobile-only Medicines CTA Banner */}
        <div className="block lg:hidden mt-4 rounded-[var(--radius)] bg-primary/5 border border-primary/20 p-4 shadow-sm text-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Pill className="size-24" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
              <Pill className="size-4" />
              <span>Medicines & Supplements</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Tell us what you need and we'll handle the rest. Delivery straight to your door.
            </p>
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.dispatchEvent(new CustomEvent('akeezo:switch-tab', { detail: 'medicines' }));
              }}
              className="mt-2 w-full max-w-[200px] rounded-full bg-primary py-2 text-xs font-bold text-primary-foreground shadow-md transition-transform active:scale-95"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
