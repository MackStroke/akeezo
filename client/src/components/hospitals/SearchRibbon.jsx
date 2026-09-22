import React from 'react';
import { Search, MapPin, Stethoscope, Wallet, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { treatments } from '@/lib/site';

const SPECIALTY_LABELS = {
  cardiac: 'Cardiac care',
  cardiac_treatment: 'Cardiac Treatment',
  oncology: 'Cancer treatment',
  orthopaedics: 'Orthopaedics',
  neurology: 'Neurology & neurosurgery',
  transplant: 'Organ transplant',
  fertility: 'Fertility & IVF',
  dental: 'Dental',
  cosmetic: 'Cosmetic & plastic surgery',
  diagnosis: 'Diagnosis & health checks',
  'second-opinion': 'Second opinion',
};

const TREATMENT_MAP = (treatments || []).reduce(
  (acc, item) => {
    if (item.id && item.label) {
      acc[item.id] = item.label;
    }
    return acc;
  },
  { ...SPECIALTY_LABELS }
);

const EXPERIENCE_LABELS = {
  best_value: 'Best Value',
  best_medical: 'Best Medical Option',
  premium: 'Premium Experience',
};

function formatSpecialtyLabel(value) {
  if (!value || typeof value !== 'string') return '';
  return TREATMENT_MAP[value] || TREATMENT_MAP[value.toLowerCase()] || value;
}

function formatExperienceLabel(value) {
  if (!value || typeof value !== 'string') return '';
  const key = value.toLowerCase().replace(/-/g, '_');
  return EXPERIENCE_LABELS[key] || EXPERIENCE_LABELS[value] || value;
}

function extractActiveFilters(filters) {
  if (!filters || typeof filters !== 'object') return [];

  const items = [];

  const addValues = (key, type, icon, formatFn) => {
    const val = filters[key];
    if (!val) return;

    if (Array.isArray(val)) {
      val.forEach((item) => {
        if (item && typeof item === 'string') {
          items.push({
            key,
            type,
            value: item,
            label: formatFn ? formatFn(item) : item,
            icon,
          });
        }
      });
    } else if (typeof val === 'string' && val.trim() !== '') {
      items.push({
        key,
        type,
        value: val,
        label: formatFn ? formatFn(val) : val,
        icon,
      });
    }
  };

  if ('specialty' in filters) {
    addValues('specialty', 'specialty', Stethoscope, formatSpecialtyLabel);
  } else if ('specialties' in filters) {
    addValues('specialties', 'specialty', Stethoscope, formatSpecialtyLabel);
  }

  if ('city' in filters) {
    addValues('city', 'city', MapPin, (v) => v);
  } else if ('cities' in filters) {
    addValues('cities', 'city', MapPin, (v) => v);
  }

  if ('country' in filters) {
    addValues('country', 'country', MapPin, (v) => v);
  }

  if ('experience' in filters) {
    addValues('experience', 'experience', Wallet, formatExperienceLabel);
  } else if ('experienceTier' in filters) {
    addValues('experienceTier', 'experience', Wallet, formatExperienceLabel);
  } else if ('experiences' in filters) {
    addValues('experiences', 'experience', Wallet, formatExperienceLabel);
  }

  const recognized = new Set([
    'specialty',
    'specialties',
    'city',
    'cities',
    'country',
    'countries',
    'experience',
    'experienceTier',
    'experiences',
    'q',
    'search',
    'page',
    'limit',
    'sort',
    'sortBy',
    'sortOrder',
  ]);

  Object.keys(filters).forEach((k) => {
    if (!recognized.has(k)) {
      addValues(k, k, Search, (v) => v);
    }
  });

  return items;
}

export function SearchRibbon({
  filters = {},
  onFilterChange,
  onClearAll,
  className,
}) {
  const activeFilters = extractActiveFilters(filters);

  const handleRemove = (key, value) => {
    if (typeof onFilterChange !== 'function') return;

    const current = filters?.[key];
    if (Array.isArray(current)) {
      onFilterChange(
        key,
        current.filter((item) => item !== value)
      );
    } else {
      onFilterChange(key, '');
    }
  };

  return (
    <div
      className={cn(
        'w-full bg-navy text-navy-foreground text-white py-2.5 px-4',
        className
      )}
    >
      <div className="mx-auto max-w-[76rem] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Search className="size-4 text-white/70 shrink-0" aria-hidden="true" />

          {activeFilters.length === 0 ? (
            <span className="text-xs sm:text-sm text-white/70 font-medium truncate select-none">
              Search hospitals by specialty, city, or experience...
            </span>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 min-w-0">
              {activeFilters.map((filter, index) => (
                <React.Fragment key={`${filter.key}-${filter.value}`}>
                  {index > 0 && (
                    <span
                      className="text-white/40 text-xs font-bold select-none shrink-0"
                      aria-hidden="true"
                    >
                      ·
                    </span>
                  )}
                  <Badge
                    variant="outline"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleRemove(filter.key, filter.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRemove(filter.key, filter.value);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-bold border border-white/20 hover:bg-white/25 hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    <filter.icon className="size-3 text-white/80 shrink-0" aria-hidden="true" />
                    <span>{filter.label}</span>
                    <X
                      className="size-3 opacity-60 hover:opacity-100 cursor-pointer pointer-events-auto shrink-0 transition-opacity"
                      aria-label={`Remove ${filter.label} filter`}
                    />
                  </Badge>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {onClearAll && activeFilters.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClearAll}
            className="text-xs font-bold text-white/70 hover:text-white hover:bg-white/15 rounded-full px-2.5 py-1 shrink-0 h-auto transition-colors"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}

export default SearchRibbon;
