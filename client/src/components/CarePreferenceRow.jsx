import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  PiggyBank,
  Stethoscope,
  Zap,
  Plane,
  Languages,
  PackageCheck,
  UserCheck,
  Sparkles,
} from 'lucide-react';

/**
 * MMT's "Select a special fare" strip, reworked as care preference.
 *
 * The brief asks a version of this question explicitly — "should we optimise
 * for treatment cost, or the best available option?" — and says the answer
 * should drive the recommendations. MMT's selectable chip row is exactly the
 * right control for it: a single choice, visible options, no dropdown.
 */
const PREFERENCES = [
  { value: 'best_value', label: 'Best value', note: 'Good care, sensible cost', icon: PiggyBank },
  { value: 'best_medical', label: 'Best medical option', note: 'Top doctor & outcome first', icon: Stethoscope },
  { value: 'fastest', label: 'Fastest slot', note: 'Earliest available admission', icon: Zap },
  { value: 'travel_assist', label: 'Visa & travel assist', note: 'Airport pickup & visa help', icon: Plane },
  { value: 'lang_support', label: 'Language assistance', note: 'Dedicated interpreter & guide', icon: Languages },
  { value: 'all_inclusive', label: 'All-inclusive package', note: 'Treatment, hotel & stay bundled', icon: PackageCheck },
  { value: 'second_opinion', label: 'Free second opinion', note: 'Remote pre-travel review', icon: UserCheck },
  { value: 'premium', label: 'VIP / Premium care', note: 'Private suite & personal care', icon: Sparkles },
];

export function CarePreferenceRow({ name = 'preference', variant = 'mint' }) {
  const [selected, setSelected] = useState('best_value');
  const scrollRef = useRef(null);

  const isMint = variant === 'mint';

  // Mouse drag-to-slide state
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    isMouseDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    // Brief timeout so click handler can check if a drag just ended
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Drag speed multiplier
    if (Math.abs(walk) > 4) {
      isDraggingRef.current = true;
      e.preventDefault();
      scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const handleCardClick = (e, val) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setSelected(val);
  };

  // min-w-0 on the fieldset is load-bearing: a <fieldset> defaults to
  // min-width:min-content in the UA stylesheet, so it grows to fit all chips
  // and defeats the overflow-x-auto rail inside it — the page then
  // scrolls sideways on a phone. Same failure mode as an unconstrained <select>.
  return (
    <fieldset className="mt-4 min-w-0">
      <legend className="mb-2 text-[0.78rem] font-bold text-muted-foreground">
        What matters most to you?
      </legend>

      {/* Drag-to-slide interactive horizontal rail */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={cn(
          'flex gap-2 overflow-x-auto pb-1 no-scrollbar select-none cursor-grab active:cursor-grabbing',
          'touch-pan-x scroll-smooth',
        )}
      >
        {PREFERENCES.map((pref) => {
          const id = `${name}-${pref.value}`;
          const active = selected === pref.value;
          const Icon = pref.icon;

          return (
            <label
              key={pref.value}
              htmlFor={id}
              onClick={(e) => handleCardClick(e, pref.value)}
              className={cn(
                'group flex min-w-[11rem] shrink-0 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5',
                'transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2',
                isMint ? 'has-[:focus-visible]:outline-mint' : 'has-[:focus-visible]:outline-ring',
                active
                  ? isMint
                    ? 'border-mint bg-mint/10 shadow-sm'
                    : 'border-primary bg-accent/60 shadow-sm'
                  : isMint
                    ? 'border-rule bg-card hover:border-mint/50 hover:bg-mint/5'
                    : 'border-rule bg-card hover:border-primary/40 hover:bg-accent/40',
              )}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={pref.value}
                checked={active}
                onChange={() => {
                  if (!isDraggingRef.current) {
                    setSelected(pref.value);
                  }
                }}
                className="sr-only"
              />
              {Icon && (
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                    active
                      ? isMint
                        ? 'bg-mint text-white shadow-xs'
                        : 'bg-primary text-primary-foreground shadow-xs'
                      : isMint
                        ? 'bg-muted text-mint group-hover:scale-105 group-hover:bg-mint group-hover:text-white'
                        : 'bg-accent text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              )}
              <div className="flex flex-col">
                <span
                  className={cn(
                    'text-[0.82rem] font-bold leading-tight',
                    active
                      ? isMint
                        ? 'text-mint font-black'
                        : 'text-primary'
                      : isMint
                        ? 'text-foreground group-hover:text-mint'
                        : 'text-foreground group-hover:text-primary',
                  )}
                >
                  {pref.label}
                </span>
                <span className="mt-0.5 text-[0.7rem] text-muted-foreground leading-tight">
                  {pref.note}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}


