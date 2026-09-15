import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

/**
 * One cell of the segmented search card.
 *
 * MMT's field anatomy, which this reproduces: a small quiet label on top, the
 * value set large and bold underneath, and an optional caption below it. The
 * whole cell is generously padded so it reads as one large target rather than
 * a cramped input.
 */
export function Field({ id, label, hint, icon: Icon, className, variant, children }) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div
      className={cn(
        'group flex min-w-0 flex-col gap-1 px-4 py-3.5 transition-colors',
        variant === 'mint'
          ? 'hover:bg-mint/10 focus-within:bg-mint/10'
          : 'hover:bg-accent/40 focus-within:bg-accent/40',
        className,
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          'flex items-center gap-1.5 text-[0.78rem] font-bold',
          variant === 'mint' ? 'text-muted-foreground group-hover:text-mint' : 'text-muted-foreground',
        )}
      >
        {Icon ? <Icon className={cn('size-3.5 shrink-0', variant === 'mint' && 'text-mint')} aria-hidden="true" /> : null}
        {label}
      </label>

      {/* Hints sit above the control so autocomplete popovers cannot cover
          them while the field is being edited. */}
      {hint ? (
        <span id={hintId} className="order-3 text-[0.72rem] text-muted-foreground">
          {hint}
        </span>
      ) : null}

      <div className="order-2 min-w-0" aria-describedby={hintId}>
        {children}
      </div>
    </div>
  );
}

/** A Field whose control is a shadcn Select dressed as MMT's big bold value. */
export function FieldSelect({
  id,
  name,
  label,
  hint,
  icon,
  options,
  value,
  onValueChange,
  defaultValue,
  placeholder,
  className,
  variant,
}) {
  const [internalVal, setInternalVal] = useState(defaultValue ?? options[0]?.value ?? '');
  const currentValue = value !== undefined ? value : internalVal;

  const handleChange = (val) => {
    setInternalVal(val);
    onValueChange?.(val);
  };

  return (
    <Field id={id} label={label} hint={hint} icon={icon} className={className} variant={variant}>
      <Select name={name} value={currentValue} onValueChange={handleChange}>
        <SelectTrigger
          id={id}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={cn(
            'h-auto w-full min-w-0 border-0 bg-transparent p-0 shadow-none',
            'text-lg font-bold text-ink-strong',
            'focus-visible:ring-0 focus-visible:outline-none',
            // The value truncates rather than forcing the grid track wider —
            // a select sizes to its longest option otherwise and pushes the
            // whole card past the viewport on a phone.
            '[&>span]:min-w-0 [&>span]:truncate',
            'data-[placeholder]:font-normal data-[placeholder]:text-muted-foreground',
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {options.map((opt) => (
            <SelectItem key={opt.value || 'any'} value={opt.value} className="text-sm">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={currentValue ?? ''} />
    </Field>
  );
}

