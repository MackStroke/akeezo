import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  FileSpreadsheet,
  Plane,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';

const DEFAULT_SLIDES = [
  {
    id: 1,
    url: '/images/slider/hospital_doctors.webp',
    title: 'Hospital & Doctor Selection',
    subtitle: 'Matching medical needs with accredited specialists',
  },
  {
    id: 2,
    url: '/images/slider/estimate.webp',
    title: 'Itemised Upfront Estimate',
    subtitle: 'Transparent pricing with ₹0 hidden fees',
  },
  {
    id: 3,
    url: '/images/slider/travel-visa.webp',
    title: 'Travel, Visa & Logistics',
    subtitle: 'Seamless medical visa & airport transfers',
  },
  {
    id: 4,
    url: '/images/slider/homecare.webp',
    title: 'Post-Treatment Home Care',
    subtitle: 'Recovery support after hospital discharge',
  },
];

const STAGES = [
  { icon: Building2, label: 'Hospital & Doctor Consultations', color: 'text-primary bg-primary/10 border-primary/20' },
  { icon: FileSpreadsheet, label: 'Itemised Upfront Estimate', color: 'text-mint bg-mint/10 border-mint/20' },
  { icon: Plane, label: 'Visa, Travel & Stay Support', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { icon: HeartHandshake, label: 'A-Z Home Care Afterwards', color: 'text-primary bg-primary/10 border-primary/20' },
];

export function JourneySlider({ slides = DEFAULT_SLIDES }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayIntervalRef = useRef(null);
  const autoplayDelay = 3500;

  const changeSlide = (newIndex) => {
    const newSafeIndex = (newIndex + slides.length) % slides.length;
    setActiveIndex(newSafeIndex);
  };

  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
      }, autoplayDelay);
    }
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [isPaused, activeIndex, slides.length]);

  const onDragEnd = (event, info) => {
    const dragThreshold = 50;
    const dragOffset = info.offset.x;
    if (dragOffset > dragThreshold) {
      changeSlide(activeIndex - 1);
    } else if (dragOffset < -dragThreshold) {
      changeSlide(activeIndex + 1);
    }
  };

  return (
    <section className="relative py-12 sm:py-16 bg-card border-b border-rule/80 overflow-hidden select-none font-sans">
      <div className="mx-auto max-w-[76rem] px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Coordination Copy */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Eyebrow Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-widest border border-primary/20">
              <Sparkles className="size-3.5 text-primary" /> End-to-End Coordination
            </span>

            {/* Main Statement Content */}
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-[2.1rem] font-black font-sans text-slate-900 dark:text-white leading-tight tracking-tight">
              From finding the right care to complete recovery at home
            </h2>

            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
              Your dedicated care coordinator takes care of every step and every detail- so you can focus on what matters most- of course getting better.
            </p>

            {/* Journey Stages Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {STAGES.map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-rule/80 bg-background/50 p-3 shadow-xs transition-all hover:border-primary/30"
                >
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${color}`}>
                    <Icon className="size-4.5" />
                  </div>
                  <span className="font-sans text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Perspective Spring Carousel */}
          <div className="lg:col-span-6 relative w-full min-w-0">
            <div
              className="relative flex w-full flex-col items-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Badge Header */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-background px-3 py-1 text-xs font-bold text-foreground shadow-xs mb-3">
                <ShieldCheck className="size-3.5 text-mint" />
                <span>AKEEZO Journey Preview</span>
              </div>

              {/* 3D Motion Carousel Stage - 4:5 Aspect Ratio */}
              <div className="relative w-full aspect-[4/5] max-h-[380px] sm:max-h-[440px] flex items-center justify-center overflow-hidden">
                <motion.div
                  className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={onDragEnd}
                >
                  {slides.map((slide, index) => (
                    <Card
                      key={slide.id || index}
                      slide={slide}
                      index={index}
                      activeIndex={activeIndex}
                      totalCards={slides.length}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Controls & Pagination Indicators */}
              <div className="flex items-center justify-between gap-4 mt-4 w-full max-w-sm px-2">
                <button
                  type="button"
                  onClick={() => changeSlide(activeIndex - 1)}
                  aria-label="Previous Slide"
                  className="p-2 rounded-full bg-background hover:bg-primary hover:text-white border border-rule text-foreground transition-colors shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <ChevronLeft className="size-5" />
                </button>

                <div className="flex items-center justify-center gap-1.5">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => changeSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                        activeIndex === index
                          ? 'w-6 bg-primary'
                          : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => changeSlide(activeIndex + 1)}
                  aria-label="Next Slide"
                  className="p-2 rounded-full bg-background hover:bg-primary hover:text-white border border-rule text-foreground transition-colors shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ slide, index, activeIndex, totalCards }) {
  let offset = index - activeIndex;
  if (offset > totalCards / 2) {
    offset -= totalCards;
  } else if (offset < -totalCards / 2) {
    offset += totalCards;
  }

  const isVisible = Math.abs(offset) <= 1;

  const animate = {
    x: `${offset * 52}%`,
    scale: offset === 0 ? 1 : 0.82,
    zIndex: totalCards - Math.abs(offset),
    opacity: isVisible ? 1 : 0,
    transition: { type: 'spring', stiffness: 260, damping: 30 },
  };

  return (
    <motion.div
      className="absolute w-[68%] sm:w-[60%] aspect-[4/5] h-[95%]"
      style={{ transformStyle: 'preserve-3d' }}
      animate={animate}
      initial={false}
    >
      <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-neutral-900 group">
        <img
          src={slide.url}
          alt={slide.title}
          className="w-full h-full object-cover pointer-events-none"
          onError={(e) => {
            const target = e.target;
            target.onerror = null;
            target.src = '/images/medical_tourism_plan.webp';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 text-white">
          <h4 className="text-white text-sm sm:text-base font-sans font-black leading-tight drop-shadow-md">
            {slide.title}
          </h4>
          {slide.subtitle && (
            <p className="text-[0.72rem] sm:text-xs text-white/80 mt-0.5 font-sans leading-snug drop-shadow-xs">
              {slide.subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
