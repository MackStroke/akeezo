import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MapPin,
  Award,
  Stethoscope,
  Users,
  Languages,
  CalendarDays,
  IndianRupee,
  Clock,
  ArrowRight,
  Plus,
  Check,
} from 'lucide-react';

export default function HospitalCard({
  hospital,
  selectedTreatment,
  isCompareSelected,
  onToggleCompare,
  onRequestConsultation,
  formatAmount,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = hospital.images || [];
  const city = hospital.location?.city || '';
  const distanceKm = hospital.location?.airportDistanceKm || '';
  const airportCode = hospital.location?.airportCode || '';
  const accreditations = hospital.accreditations || [];
  const centersOfExcellence = hospital.centersOfExcellence || [];
  const languages = hospital.languages || [];
  const estimates = hospital.estimates || [];

  const estimate = selectedTreatment
    ? estimates.find((e) => e.treatmentId === selectedTreatment) || estimates[0]
    : estimates[0];

  const hasSelectedTreatment = selectedTreatment && estimate && estimate.treatmentId === selectedTreatment;
  const isCenterOfExcellence = hasSelectedTreatment && centersOfExcellence.includes(estimate.treatmentId);

  const doctorsMatching = hospital.doctors?.filter(
    (d) => !hasSelectedTreatment || d.specialties?.includes(estimate.treatmentId)
  ) || [];
  const doctorCount = doctorsMatching.length;
  const doctorSpecialty = estimate?.treatmentName || 'Specialists';

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const newIndex = Math.round(scrollPosition / width);
    setActiveImageIndex(newIndex);
  };

  return (
    <Card className="bg-card border border-border rounded-[var(--radius)] shadow-card hover:shadow-widget transition-shadow overflow-hidden flex flex-col lg:flex-row mb-6">
      {/* Image Section */}
      <div className="relative w-full lg:w-[40%] h-56 lg:h-auto shrink-0 bg-secondary">
        {images.length > 0 ? (
          <>
            <div
              className="flex overflow-x-auto snap-x snap-mandatory h-full scrollbar-hide"
              onScroll={handleScroll}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${hospital.name} - view ${idx + 1}`}
                  className="w-full h-full object-cover snap-center shrink-0"
                />
              ))}
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === activeImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary text-muted-foreground">
            <Plus className="w-12 h-12 opacity-50" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-5 flex flex-col w-full lg:w-[60%] gap-4">
        <div>
          <h3 className="text-lg font-black text-ink-strong">{hospital.name}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>
                {city} ({distanceKm}km from {airportCode})
              </span>
            </div>
            {accreditations.length > 0 && (
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span className="font-medium text-ink-strong">
                  {accreditations.join(' & ')} Accredited
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {hasSelectedTreatment && (
            <div className="flex items-start gap-2">
              <Badge className="bg-secondary text-secondary-foreground text-[0.7rem] font-bold shrink-0 mt-0.5">
                {isCenterOfExcellence ? '★ Center of Excellence for ' + estimate.treatmentName : 'Available: ' + estimate.treatmentName}
              </Badge>
            </div>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span>
                {doctorCount} Senior {doctorSpecialty} Available
              </span>
            </div>
            {languages.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-primary" />
                <span>{languages.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Journey Estimate Box */}
        {estimate && (
          <div className="bg-secondary/30 rounded-md p-4 border-l-4 border-primary mt-auto">
            <h4 className="text-sm font-bold mb-2">
              AKEEZO Journey Estimate ({estimate.treatmentName || 'Procedure'})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2 text-sm">
              <div className="flex items-start gap-2">
                <CalendarDays className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Expected Stay</div>
                  <div className="text-muted-foreground">
                    {estimate.minDays}-{estimate.maxDays} Days (Hospital + Hotel Recovery)
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <IndianRupee className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Estimated Cost</div>
                  <div className="text-lg font-black text-primary">
                    {formatAmount(estimate.minCost)} – {formatAmount(estimate.maxCost)}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs italic text-muted-foreground">
              * Subject to medical evaluation
            </p>
          </div>
        )}

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`compare-${hospital.id}`}
              checked={isCompareSelected}
              onCheckedChange={() => onToggleCompare(hospital)}
            />
            <label
              htmlFor={`compare-${hospital.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {isCompareSelected ? (
                <span className="flex items-center text-primary">
                  <Check className="w-4 h-4 mr-1" /> Added to Compare
                </span>
              ) : (
                'Add to Compare'
              )}
            </label>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to={`/hospitals/${hospital.slug}`}>
                View Details <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 w-full sm:w-auto font-bold"
              onClick={() => onRequestConsultation(hospital)}
            >
              Request Consultation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
