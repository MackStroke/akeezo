import { useState, useEffect, useRef } from 'react';
import {
  ClipboardList,
  UploadCloud,
  ShieldCheck,
  Receipt,
  PlaneTakeoff,
  HeartPulse,
  Home,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    id: 1,
    title: 'Tell Us the Requirement',
    desc: 'Diagnosis, sign/symptoms, any aesthetic requirement? Or what? Say out your heart and we are all EARS!',
    icon: ClipboardList,
    tag: 'Step 1 • Initial Inquiry',
    details: [
      'Share symptoms, medical history or initial diagnosis',
      'Choose preferred hospital style or location preferences',
      'Rapid clinical triage review within 2 hours',
    ],
  },
  {
    id: 2,
    title: 'Share Your Records',
    desc: 'Reports, scans, prescriptions and previous opinions — so specialists assess real case.',
    icon: UploadCloud,
    tag: 'Step 2 • Clinical Review',
    details: [
      'Secure encrypted document upload desk',
      'Multi-specialist medical board evaluation',
      'Medical translation for international records',
    ],
  },
  {
    id: 3,
    title: 'Get Options, Not a Pitch',
    desc: 'Suitable hospitals and doctors side by side, with accreditation, experience and cost.',
    icon: ShieldCheck,
    tag: 'Step 3 • Hospital Discovery',
    details: [
      'Impartial comparison across NABH & JCI hospitals',
      'Surgeon qualifications and success metrics',
      'Direct doctor consultation booking',
    ],
  },
  {
    id: 4,
    title: 'See the Full Estimate',
    desc: 'Treatment, doctor, diagnostics, medicines, stay, transport and attendant — itemised.',
    icon: Receipt,
    tag: 'Step 4 • Financial Clarity',
    details: [
      '100% itemised cost breakdown with zero hidden fees',
      'Dynamic currency conversion (USD, EUR, AED, KES, etc.)',
      'Written quote backed directly by host hospital',
    ],
  },
  {
    id: 5,
    title: 'We Arrange the Journey',
    desc: 'Appointments, visa documentation, flights, airport pickup and medical-friendly stay.',
    icon: PlaneTakeoff,
    tag: 'Step 5 • Travel & Visa Desk',
    details: [
      'Official Medical Visa invitation letter dispatch',
      'Airport pickup with dedicated medical escort',
      'Pre-booked serviced apartments near hospital',
    ],
  },
  {
    id: 6,
    title: 'Treatment and Recovery',
    desc: 'A coordinator on the ground, an attendant if you need one, family kept informed.',
    icon: HeartPulse,
    tag: 'Step 6 • In-Hospital Care',
    details: [
      'Personal 24/7 care manager on the ground',
      'Daily progress updates sent to family back home',
      'Interpreter support and insurance claims assistance',
    ],
  },
  {
    id: 7,
    title: 'Home, and After',
    desc: 'Fit-to-travel sign-off, the return journey, then nursing or physiotherapy at home.',
    icon: Home,
    tag: 'Step 7 • Post-Care Recovery',
    details: [
      'Fit-to-fly clearance certificate before departure',
      'Seamless transition to home nursing & rehab',
      'Scheduled tele-consultation follow-up appointments',
    ],
  },
];

export function Journey({ onSelectStep }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);
  const current = STEPS[activeStep];
  const CurrentIcon = current.icon;

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % STEPS.length);
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStepClick = (idx) => {
    setActiveStep(idx);
    setIsPlaying(false);
    if (onSelectStep) onSelectStep(STEPS[idx]);
  };

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % STEPS.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  };

  const progressPercent = ((activeStep + 1) / STEPS.length) * 100;

  return (
    <section id="journey" aria-labelledby="journey-heading" className="py-14 sm:py-20 bg-background overflow-hidden">
      <div className="mx-auto max-w-[76rem] px-4">
        {/* Header section */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1 text-xs font-bold text-primary mb-3">
            <Sparkles className="size-3.5 animate-pulse" />
            <span>Interactive Care Pathway</span>
          </div>
          <h2 id="journey-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink-strong tracking-tight">
            One Dedicated Coordinator for the Whole Journey
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Medical journey often gets overlooked after the hospital admission. AKEEZO coordinates the entire journey as one seamless path- from your first inquiry to post-care recovery at home, sharing real time updates with your family in your respective country.
          </p>
        </div>

        {/* Interactive Playback & Progress Bar */}
        <div className="mt-10 rounded-[1.5rem] border border-rule/80 bg-card p-4 sm:p-7 shadow-widget">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule/60 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {activeStep + 1}
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Current Stage
                </span>
                <p className="text-sm font-extrabold text-ink-strong">{current.title}</p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs',
                  isPlaying
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-primary/30'
                    : 'bg-accent text-primary hover:bg-primary/15',
                )}
              >
                {isPlaying ? (
                  <>
                    <Pause className="size-3.5" /> Auto-playing
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" /> Auto-play Flow
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 border-l border-rule pl-2 ml-1">
                <button
                  type="button"
                  onClick={prevStep}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
                  aria-label="Next step"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Animated Connecting Line & Step Indicators */}
          <div className="relative mb-8 pt-2">
            <div className="absolute top-[1.4rem] left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-mint to-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="relative flex justify-between gap-1 overflow-x-auto pb-2 no-scrollbar">
              {STEPS.map((step, idx) => {
                const isActive = idx === activeStep;
                const isPassed = idx < activeStep;
                const Icon = step.icon;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      setActiveStep(idx);
                      setIsPlaying(false);
                    }}
                    className="flex flex-col items-center gap-2 min-w-[4.2rem] group cursor-pointer"
                  >
                    <div
                      className={cn(
                        'relative flex size-11 items-center justify-center rounded-full border-2 transition-all duration-300',
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground shadow-widget scale-110 ring-4 ring-primary/20'
                          : isPassed
                            ? 'border-primary/60 bg-accent text-primary'
                            : 'border-rule bg-card text-muted-foreground hover:border-primary/40 hover:text-primary',
                      )}
                    >
                      <Icon className="size-5" />
                      {isActive && (
                        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-mint animate-ping" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-[0.72rem] font-bold text-center line-clamp-1 transition-colors',
                        isActive ? 'text-primary font-black' : 'text-muted-foreground group-hover:text-foreground',
                      )}
                    >
                      Step {step.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Feature Showcase Card (Animated spotlight) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl border border-primary/20 bg-accent/30 p-5 sm:p-7 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-accent px-3 py-1 rounded-full border border-primary/20">
                  {current.tag}
                </span>
                <h3 className="mt-3 text-xl sm:text-2xl font-black text-ink-strong flex items-center gap-2.5">
                  <CurrentIcon className="size-7 text-primary shrink-0" />
                  {current.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
                  {current.desc}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="#top"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md group"
                >
                  <span>{current.actionLabel}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Right Details Checklist */}
            <div className="lg:col-span-5 rounded-xl border border-rule/80 bg-card p-4 sm:p-5 shadow-xs flex flex-col justify-center">
              <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">
                What AKEEZO Delivers in Step {current.id}
              </h4>
              <ul className="space-y-2.5">
                {current.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90 font-medium leading-snug">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
