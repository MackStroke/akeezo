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

export function Hero({ onPlan, onEmergency, onHome }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % MISSION_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="top" aria-labelledby="hero-heading" className="relative">
      {/* Colour band & hero background image behind the widget. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[26rem] sm:h-[24rem] bg-hero-band overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url("/images/hero section.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative mx-auto max-w-[76rem] px-4 pt-10 pb-16 sm:pt-12">
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <h1
              id="hero-heading"
              className="text-3xl text-white sm:text-4xl lg:text-[2.75rem] font-black leading-tight tracking-tight"
              style={{ color: '#fff' }}
            >
              Too many hospitals, Too many quotations,
              <br />
              Low on budget or not sure from where to get treated?
            </h1>
            <p className="mt-3 max-w-2xl text-[0.98rem] sm:text-base text-white/90 font-medium leading-relaxed">
              Whether you’re looking for treatment in India or any other country, Akeezo helps you find suitable healthcare options based on your medical needs and budget.
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
