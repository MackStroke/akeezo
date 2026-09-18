import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Map, LayoutGrid } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'AKEEZO Recommended' },
  { value: 'cost_asc', label: 'Cost: Low to High' },
  { value: 'cost_desc', label: 'Cost: High to Low' },
  { value: 'airport_distance', label: 'Distance from Airport' },
  { value: 'availability', label: 'Earliest Availability' },
];

export default function SortBar({
  sort = 'recommended',
  onSortChange,
  totalResults = 0,
  currentPage = 1,
  totalPages = 1,
}) {
  const handleMapClick = () => {
    window.alert('Map view coming soon — Mapbox/Google Maps integration is planned for a follow-up release.');
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-border">
      <div className="flex items-center gap-2">
        <LayoutGrid className="size-4 text-muted-foreground hidden sm:block" aria-hidden="true" />
        <span className="text-sm font-medium text-muted-foreground">
          Showing {totalResults} hospitals
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Select value={sort} onValueChange={(val) => onSortChange?.(val)}>
          <SelectTrigger className="w-[220px] text-xs font-bold" aria-label="Sort hospitals">
            <span className="flex items-center gap-2 truncate">
              <ArrowUpDown className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
              <SelectValue placeholder="Sort by" />
            </span>
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleMapClick}
          className="text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Map className="size-3.5 shrink-0" aria-hidden="true" />
          <span>Map View</span>
        </Button>
      </div>
    </div>
  );
}
