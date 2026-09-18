import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const FILTER_GROUPS = {
  city: {
    title: 'Location / City',
    options: [
      { id: 'Delhi NCR', label: 'Delhi NCR' },
      { id: 'Mumbai', label: 'Mumbai' },
      { id: 'Chennai', label: 'Chennai' },
      { id: 'Hyderabad', label: 'Hyderabad' },
      { id: 'Bengaluru', label: 'Bengaluru' },
      { id: 'Kolkata', label: 'Kolkata' },
      { id: 'Ahmedabad', label: 'Ahmedabad' },
      { id: 'Kochi', label: 'Kochi' },
      { id: 'Jaipur', label: 'Jaipur' },
      { id: 'Chandigarh', label: 'Chandigarh' },
    ]
  },
  specialty: {
    title: 'Specialty / Department',
    options: [
      { id: 'cardiac', label: 'Cardiac care' },
      { id: 'oncology', label: 'Cancer treatment' },
      { id: 'orthopaedics', label: 'Orthopaedics' },
      { id: 'neurology', label: 'Neurology & neurosurgery' },
      { id: 'transplant', label: 'Organ transplant' },
      { id: 'fertility', label: 'Fertility & IVF' },
      { id: 'dental', label: 'Dental' },
      { id: 'cosmetic', label: 'Cosmetic & plastic surgery' },
      { id: 'diagnosis', label: 'Diagnosis & health checks' },
    ]
  },
  experience: {
    title: 'Experience & Optimization',
    type: 'radio',
    options: [
      { id: 'best_value', label: 'Best Value' },
      { id: 'best_medical', label: 'Best Medical Option' },
      { id: 'premium', label: 'Premium Experience' },
    ]
  },
  accreditation: {
    title: 'Accreditation & Quality',
    options: [
      { id: 'NABH', label: 'NABH' },
      { id: 'JCI', label: 'JCI' },
    ]
  },
  amenity: {
    title: 'Patient Amenities',
    options: [
      { id: 'international_patient_desk', label: 'International Patient Desk' },
      { id: 'multilingual', label: 'Multilingual Support' },
      { id: 'english_speaking', label: 'English-speaking Staff' },
      { id: 'family_friendly', label: 'Family-friendly' },
    ]
  },
  stayLogistic: {
    title: 'Stay Logistics',
    options: [
      { id: 'shortest_stay', label: 'Shortest Stay' },
      { id: 'luxury', label: 'Luxury / Premium' },
      { id: 'privacy', label: 'Privacy' },
    ]
  }
};

const FilterSection = ({ 
  filterKey, 
  group, 
  selectedValues, 
  onFilterChange 
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleCheckboxChange = (optionId, checked) => {
    let newValues = Array.isArray(selectedValues) ? [...selectedValues] : [];
    if (checked) {
      newValues.push(optionId);
    } else {
      newValues = newValues.filter(id => id !== optionId);
    }
    onFilterChange(filterKey, newValues);
  };

  const handleRadioChange = (optionId) => {
    onFilterChange(filterKey, selectedValues === optionId ? '' : optionId);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-border py-4 last:border-b-0"
    >
      <div className="flex items-center justify-between space-x-4 px-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {group.title}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0 hover:bg-secondary">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-3 pt-4 px-1">
        {group.options.map((option) => {
          const isSelected = group.type === 'radio' 
            ? selectedValues === option.id 
            : Array.isArray(selectedValues) && selectedValues.includes(option.id);
            
          return (
            <div key={option.id} className="flex items-start space-x-3">
              <Checkbox
                id={`${filterKey}-${option.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  if (group.type === 'radio') {
                    handleRadioChange(option.id);
                  } else {
                    handleCheckboxChange(option.id, checked);
                  }
                }}
                className={group.type === 'radio' ? 'rounded-full' : 'rounded-sm'}
              />
              <label
                htmlFor={`${filterKey}-${option.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-ink-strong cursor-pointer mt-0.5"
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const FilterSidebar = ({
  filters,
  onFilterChange,
  onClearAll,
  resultCount = 0,
  className = ''
}) => {
  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(filters || {}).forEach(val => {
      if (Array.isArray(val)) {
        count += val.length;
      } else if (val && typeof val === 'string') {
        count += 1;
      }
    });
    return count;
  };

  const activeCount = getActiveFilterCount();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="font-bold text-lg">Filters</h3>
        {activeCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="h-8 text-xs font-semibold cta-gradient text-white rounded-full px-3"
          >
            Clear All
          </Button>
        )}
      </div>
      
      {resultCount > 0 && (
        <div className="py-3 text-sm font-medium text-muted-foreground">
          Showing {resultCount} results
        </div>
      )}

      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="pb-8">
          {Object.entries(FILTER_GROUPS).map(([key, group]) => (
            <FilterSection
              key={key}
              filterKey={key}
              group={group}
              selectedValues={filters[key]}
              onFilterChange={onFilterChange}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block w-72 shrink-0 ${className}`}>
        <div className="sticky top-24 bg-card rounded-[10px] border border-border p-4 shadow-sm h-[calc(100vh-8rem)]">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sheet Trigger handled via FilterTriggerButton externally or inline */}
      <div className="lg:hidden block">
         <Sheet>
            <SheetTrigger asChild>
               <Button variant="outline" size="sm" className="gap-2 rounded-[10px]">
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeCount > 0 && (
                     <Badge variant="secondary" className="ml-1 rounded-full px-1.5 min-w-[20px] text-center">
                        {activeCount}
                     </Badge>
                  )}
               </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[340px] p-4 flex flex-col gap-0 rounded-r-[10px]">
               <SheetHeader className="sr-only">
                  <SheetTitle>Filters</SheetTitle>
               </SheetHeader>
               <SidebarContent />
            </SheetContent>
         </Sheet>
      </div>
    </>
  );
};

export const FilterTriggerButton = ({ filters, onClick }) => {
  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(filters || {}).forEach(val => {
      if (Array.isArray(val)) {
        count += val.length;
      } else if (val && typeof val === 'string') {
        count += 1;
      }
    });
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <Button variant="outline" size="sm" className="gap-2 rounded-[10px]" onClick={onClick}>
      <Filter className="w-4 h-4" />
      Filters
      {activeCount > 0 && (
        <Badge variant="secondary" className="ml-1 rounded-full px-1.5 min-w-[20px] text-center">
          {activeCount}
        </Badge>
      )}
    </Button>
  );
};

export default FilterSidebar;
