import { Activity, Heart, Brain, Bone, Baby, Eye, Stethoscope, Microscope, Bandage } from 'lucide-react';

const getDepartmentIcon = (str) => {
  const lower = str.toLowerCase();
  if (lower.includes('cardio') || lower.includes('heart')) return <Heart className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('neuro') || lower.includes('brain')) return <Brain className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('ortho') || lower.includes('bone') || lower.includes('spine')) return <Bone className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('pedia') || lower.includes('matern') || lower.includes('child')) return <Baby className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('opthal') || lower.includes('eye')) return <Eye className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('onco') || lower.includes('cancer')) return <Activity className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('patho') || lower.includes('lab') || lower.includes('diagnos')) return <Microscope className="w-5 h-5 text-muted-foreground" />;
  if (lower.includes('surg')) return <Bandage className="w-5 h-5 text-muted-foreground" />;
  // generic fallback
  return <Stethoscope className="w-5 h-5 text-muted-foreground" />;
};

export function DepartmentsSection({ title = "Departments", items = [] }) {
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
              {getDepartmentIcon(item)}
            </div>
            <p className="text-[13px] md:text-[14px] leading-tight text-ink-strong m-0 font-medium capitalize">
              {item.replace(/-/g, ' ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
