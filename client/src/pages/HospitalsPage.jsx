import { useState } from 'react';
import { Loader2, Hospital, HeartPulse, Search } from 'lucide-react';
import SEO from '@/components/SEO';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useHospitalFilters } from '@/hooks/useHospitalFilters';
import { useLocale } from '@/context/LocaleContext';
import FilterSidebar, { FilterTriggerButton } from '@/components/hospitals/FilterSidebar';
import HospitalCard from '@/components/hospitals/HospitalCard';
import SearchRibbon from '@/components/hospitals/SearchRibbon';
import SortBar from '@/components/hospitals/SortBar';
import CompareTray from '@/components/hospitals/CompareTray';
import CompareDialog from '@/components/hospitals/CompareDialog';
import { EnquiryDialog } from '@/components/EnquiryDialog';

const hospitalsPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Find Hospitals | AKEEZO',
  url: 'https://www.akeezo.com/hospitals',
  description:
    'Discover accredited hospitals across India for medical tourism. Filter by specialty, city, accreditation, and compare treatment cost estimates.',
  publisher: {
    '@type': 'Organization',
    name: 'AKEEZO',
    url: 'https://www.akeezo.com',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.akeezo.com' },
      { '@type': 'ListItem', position: 2, name: 'Hospitals', item: 'https://www.akeezo.com/hospitals' },
    ],
  },
};

export default function HospitalsPage() {
  const {
    filters,
    hospitals,
    pagination,
    isLoading,
    error,
    activeFilterCount,
    updateFilter,
    clearAllFilters,
    setPage,
    setSort,
    compareSet,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    isInCompareSet,
  } = useHospitalFilters();

  const { formatAmount } = useLocale();
  const [compareOpen, setCompareOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryHospital, setEnquiryHospital] = useState(null);

  const selectedTreatment = filters.specialty?.[0] || '';

  function handleRequestConsultation(hospital) {
    setEnquiryHospital(hospital);
    setEnquiryOpen(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEO
        title="Find Hospitals in India | AKEEZO Hospital Discovery"
        description="Discover NABH & JCI accredited hospitals across India. Compare treatment costs, doctor availability, and international patient amenities for your medical tourism journey."
        canonical="/hospitals"
        jsonLd={hospitalsPageJsonLd}
      />
      <SiteHeader />

      <main className="flex-1">
        {/* Search Ribbon */}
        <SearchRibbon
          filters={filters}
          onFilterChange={updateFilter}
          onClearAll={clearAllFilters}
        />

        {/* Hero Banner */}
        <section className="bg-navy text-white relative py-8 sm:py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-primary/20" />
          <div className="relative mx-auto max-w-[76rem] px-4 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-sky-300 text-xs font-bold border border-white/20">
              <HeartPulse className="size-3.5 text-primary animate-pulse" />
              AKEEZO Hospital Discovery
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Find the Right Hospital for Your Journey
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
              Compare accredited hospitals across India — treatment costs, doctor availability, international patient services, and journey estimates.
            </p>

            {/* Quick search */}
            <div className="max-w-xl mx-auto pt-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search hospitals by name or city..."
                  value={filters.q || ''}
                  onChange={(e) => updateFilter('q', e.target.value)}
                  className="pl-12 pr-4 py-3 h-12 bg-white text-foreground rounded-full shadow-lg text-sm border-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Two-column layout */}
        <div className="mx-auto max-w-[76rem] px-4 py-6">
          <div className="flex gap-6">
            {/* Left sidebar — desktop only */}
            <aside className="hidden lg:block w-[280px] shrink-0">
              <div className="sticky top-4">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={updateFilter}
                  onClearAll={clearAllFilters}
                  resultCount={pagination.total}
                />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Mobile filter trigger + sort bar */}
              <div className="flex items-center gap-3 lg:hidden mb-4">
                <FilterTriggerButton
                  filters={filters}
                  onFilterChange={updateFilter}
                  onClearAll={clearAllFilters}
                  resultCount={pagination.total}
                  activeFilterCount={activeFilterCount}
                />
              </div>

              <SortBar
                sort={filters.sort || 'recommended'}
                onSortChange={(val) => setSort(val)}
                totalResults={pagination.total}
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
              />

              {/* Hospital listings */}
              <div className="mt-4 space-y-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-sm font-medium">Finding hospitals...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border space-y-3">
                    <Hospital className="size-10 text-muted-foreground mx-auto opacity-50" />
                    <h3 className="text-lg font-bold text-ink-strong">Unable to Load Hospitals</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">{error}</p>
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      size="sm"
                      className="font-bold text-xs"
                    >
                      Clear Filters & Retry
                    </Button>
                  </div>
                ) : hospitals.length === 0 ? (
                  <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border space-y-3">
                    <Hospital className="size-10 text-muted-foreground mx-auto opacity-50" />
                    <h3 className="text-lg font-bold text-ink-strong">No Hospitals Found</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      No hospitals match your current filters. Try adjusting your search criteria.
                    </p>
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      size="sm"
                      className="font-bold text-xs"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    {hospitals.map((hospital) => (
                      <HospitalCard
                        key={hospital._id || hospital.slug}
                        hospital={hospital}
                        selectedTreatment={selectedTreatment}
                        isCompareSelected={isInCompareSet(hospital)}
                        onToggleCompare={toggleCompare}
                        formatAmount={formatAmount}
                        onRequestConsultation={handleRequestConsultation}
                      />
                    ))}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-6 pb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pagination.page <= 1}
                          onClick={() => setPage(pagination.page - 1)}
                          className="text-xs font-bold"
                        >
                          Previous
                        </Button>
                        <span className="text-xs font-medium text-muted-foreground px-3">
                          Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pagination.page >= pagination.totalPages}
                          onClick={() => setPage(pagination.page + 1)}
                          className="text-xs font-bold"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Compare Tray */}
      <CompareTray
        hospitals={compareSet}
        onRemove={removeFromCompare}
        onClear={clearCompare}
        onCompare={() => setCompareOpen(true)}
      />

      {/* Compare Dialog */}
      <CompareDialog
        open={compareOpen}
        onOpenChange={setCompareOpen}
        hospitals={compareSet}
        formatAmount={formatAmount}
        selectedTreatment={selectedTreatment}
      />

      {/* Enquiry Dialog — respects consent-before-submission */}
      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        payload={
          enquiryHospital
            ? {
                treatment: selectedTreatment || enquiryHospital.specialties?.[0],
                preferredCity: enquiryHospital.city,
                message: `I am interested in treatment at ${enquiryHospital.name}, ${enquiryHospital.city}.`,
              }
            : undefined
        }
      />

      <SiteFooter />
    </div>
  );
}
