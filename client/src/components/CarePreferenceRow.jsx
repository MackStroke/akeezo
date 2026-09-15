import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PiggyBank, Stethoscope, Zap, BadgeCheck, Sparkles } from 'lucide-react';

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
  { value: 'best_medical', label: 'Best medical option', note: 'Clinical outcome first', icon: Stethoscope },
  { value: 'fastest', label: 'Fastest', note: 'Earliest available slot', icon: Zap },
  { value: 'accredited', label: 'Accredited only', note: 'NABH / JCI hospitals', icon: BadgeCheck },
  { value: 'premium', label: 'Premium', note: 'Private, higher comfort', icon: Sparkles },
];

export function CarePreferenceRow({ name = 'preference' }) {
  const [selected, setSelected] = useState('best_value');

  // min-w-0 on the fieldset is load-bearing: a <fieldset> defaults to
  // min-width:min-content in the UA stylesheet, so it grows to fit all five
  // chips and defeats the overflow-x-auto rail inside it — the page then
  // scrolls sideways on a phone. Same failure mode as an unconstrained
  // <select>.
  return (
    <fieldset className="mt-4 min-w-0">
      <legend className="mb-2 text-[0.78rem] font-bold text-muted-foreground">
        What matters most to you?
      </legend>

      {/* A radio group, not buttons: one choice, and it submits with the form. */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PREFERENCES.map((pref) => {
          const id = `${name}-${pref.value}`;
          const active = selected === pref.value;
          const Icon = pref.icon;

          return (
            <label
              key={pref.value}
              htmlFor={id}
              className={cn(
                'group flex min-w-[11rem] shrink-0 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5',
                'transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2',
                'has-[:focus-visible]:outline-ring',
                active
                  ? 'border-primary bg-accent/60 shadow-sm'
                  : 'border-rule bg-card hover:border-primary/40 hover:bg-accent/40',
              )}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={pref.value}
                checked={active}
                onChange={() => setSelected(pref.value)}
                className="sr-only"
              />
              {Icon && (
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                    active
                      ? 'bg-primary text-primary-foreground shadow-xs'
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
                    active ? 'text-primary' : 'text-foreground group-hover:text-primary',
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

