import { MapPin, X, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CompareTray({ hospitals, onRemove, onClear, onCompare }) {
  if (hospitals.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-card border-t-2 border-primary shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="mx-auto max-w-[76rem] px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-ink-strong shrink-0">
          <Scale className="size-4 text-primary" />
          Compare ({hospitals.length}/3)
        </div>

        <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {hospitals.map((h) => (
            <div
              key={h._id || h.slug}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full border border-border shrink-0"
            >
              <span className="text-xs font-bold text-ink-strong truncate max-w-[140px]">
                {h.name}
              </span>
              <span className="text-[0.65rem] text-muted-foreground flex items-center gap-0.5">
                <MapPin className="size-2.5" />
                {h.city}
              </span>
              <button
                type="button"
                onClick={() => onRemove(h)}
                className="size-4 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={`Remove ${h.name} from comparison`}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="text-xs font-bold"
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={onCompare}
            disabled={hospitals.length < 2}
            className="cta-gradient text-white text-xs font-bold rounded-full"
          >
            Compare Now
          </Button>
        </div>
      </div>
    </div>
  );
}
