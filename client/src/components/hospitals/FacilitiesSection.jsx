import { CheckCircle2, Wifi, Car, Clock, Dumbbell, Utensils, Beer, Flag, Activity } from 'lucide-react';

// Attempt to match facility to a specific icon based on keyword
const getIconForString = (str) => {
  const lower = str.toLowerCase();
  if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet')) return <Wifi className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('parking') || lower.includes('valet')) return <Car className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('24-hour') || lower.includes('24x7') || lower.includes('desk')) return <Clock className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('fitness') || lower.includes('gym')) return <Dumbbell className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('restaurant') || lower.includes('food')) return <Utensils className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('bar') || lower.includes('lounge')) return <Beer className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('golf')) return <Flag className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('massage') || lower.includes('spa')) return <Activity className="w-5 h-5 text-muted-foreground" />;
  // generic icon fallback
  return <CheckCircle2 className="w-5 h-5 text-muted-foreground" />;
};

export function FacilitiesSection({ title = "Facilities", items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white border border-border rounded-[4px] p-4 mt-4 shadow-sm">
      <div className="mb-4 justify-between items-center flex flex-row">
        <h2 className="text-[20px] md:text-[24px] font-bold text-ink-strong">
          {title}
        </h2>
        {items.length > 8 && (
          <button
            type="button"
            className="text-primary font-medium hover:underline text-[14px] bg-transparent border-0 cursor-pointer p-0"
          >
            See all
          </button>
        )}
      </div>
      <div role="list" className="items-center flex flex-wrap">
        {items.slice(0, 8).map((item, idx) => (
          <div
            key={idx}
            role="listitem"
            className="w-1/2 md:w-1/4 items-center flex pb-4 pr-2"
          >
            <div className="items-center flex mr-2 shrink-0">
              {getIconForString(item)}
            </div>
            <p className="text-[13px] md:text-[14px] leading-tight text-ink-strong m-0 font-medium">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
