import {
  MapPin,
  Award,
  Stethoscope,
  Users,
  Languages,
  Clock,
  X,
  Check,
  Minus,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { treatments } from '@/lib/site';

const TREATMENT_MAP = Object.fromEntries(treatments.map(t => [t.id, t.label]));

const AMENITY_LABELS = {
  international_patient_desk: 'International Patient Desk',
  multilingual: 'Multilingual Support',
  english_speaking: 'English-speaking Staff',
  family_friendly: 'Family-friendly',
};

const EXPERIENCE_LABELS = {
  best_value: 'Best Value',
  best_medical: 'Best Medical Option',
  premium: 'Premium Experience',
};

function CompareRow({ label, icon: Icon, children }) {
  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="py-3 px-4 text-xs font-bold text-muted-foreground whitespace-nowrap bg-muted/30 sticky left-0 z-10">
        <span className="flex items-center gap-2">
          {Icon && <Icon className="size-3.5 text-primary" />}
          {label}
        </span>
      </td>
      {children}
    </tr>
  );
}

function CompareCell({ children, highlight }) {
  return (
    <td className={`py-3 px-4 text-xs text-foreground min-w-[200px] ${highlight ? 'bg-secondary/30' : ''}`}>
      {children}
    </td>
  );
}

function CheckMark({ value }) {
  return value ? (
    <Check className="size-4 text-green-600" />
  ) : (
    <Minus className="size-4 text-muted-foreground/40" />
  );
}

export default function CompareDialog({
  open,
  onOpenChange,
  hospitals,
  formatAmount,
  selectedTreatment,
}) {
  if (!hospitals || hospitals.length === 0) return null;

  function getEstimate(hospital) {
    if (selectedTreatment) {
      const match = hospital.treatmentEstimates?.find(
        t => t.treatmentId === selectedTreatment,
      );
      if (match) return match;
    }
    return hospital.treatmentEstimates?.[0];
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-auto max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border bg-navy text-white rounded-t-lg">
          <DialogTitle className="text-lg font-black">
            Hospital Comparison
          </DialogTitle>
          <p className="text-xs text-white/70">
            Side-by-side comparison of {hospitals.length} hospitals
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left text-xs font-bold text-muted-foreground bg-muted/30 sticky left-0 z-10 min-w-[140px]">
                    Attribute
                  </th>
                  {hospitals.map((h) => (
                    <th
                      key={h._id || h.slug}
                      className="py-3 px-4 text-left min-w-[200px]"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-black text-ink-strong">
                          {h.name}
                        </p>
                        <p className="text-[0.65rem] text-muted-foreground flex items-center gap-1">
                          <MapPin className="size-2.5" />
                          {h.city}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Accreditations" icon={Award}>
                  {hospitals.map((h) => (
                    <CompareCell key={h.slug}>
                      <div className="flex flex-wrap gap-1">
                        {h.accreditations?.map(a => (
                          <Badge
                            key={a}
                            className="bg-secondary text-secondary-foreground text-[0.65rem] font-bold"
                          >
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </CompareCell>
                  ))}
                </CompareRow>

                <CompareRow label="Specialty Match" icon={Stethoscope}>
                  {hospitals.map((h) => {
                    const treatmentId = selectedTreatment || h.specialties?.[0];
                    const isCoE = h.centersOfExcellence?.includes(treatmentId);
                    return (
                      <CompareCell key={h.slug} highlight={isCoE}>
                        <span className={isCoE ? 'font-bold text-primary' : ''}>
                          {isCoE ? '★ Center of Excellence' : '✓ Available'}
                        </span>
                        <p className="text-[0.65rem] text-muted-foreground mt-0.5">
                          {TREATMENT_MAP[treatmentId] || treatmentId}
                        </p>
                      </CompareCell>
                    );
                  })}
                </CompareRow>

                <CompareRow label="Doctors Available" icon={Users}>
                  {hospitals.map((h) => {
                    const treatmentId = selectedTreatment || h.specialties?.[0];
                    const count = h.doctors?.filter(
                      d => d.specialty === treatmentId,
                    ).length || 0;
                    return (
                      <CompareCell key={h.slug}>
                        <span className="font-bold">{count}</span>{' '}
                        <span className="text-muted-foreground">specialist{count !== 1 ? 's' : ''}</span>
                      </CompareCell>
                    );
                  })}
                </CompareRow>

                <CompareRow label="Languages" icon={Languages}>
                  {hospitals.map((h) => (
                    <CompareCell key={h.slug}>
                      {h.languages?.join(', ') || '—'}
                    </CompareCell>
                  ))}
                </CompareRow>

                <CompareRow label="Estimated Cost">
                  {hospitals.map((h) => {
                    const est = getEstimate(h);
                    return (
                      <CompareCell key={h.slug}>
                        {est ? (
                          <>
                            <span className="font-black text-primary text-sm">
                              {formatAmount(est.costRange.min)} – {formatAmount(est.costRange.max)}
                            </span>
                            <p className="text-[0.6rem] text-muted-foreground italic mt-0.5">
                              {est.procedure} · Subject to medical evaluation
                            </p>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </CompareCell>
                    );
                  })}
                </CompareRow>

                <CompareRow label="Expected Stay" icon={Clock}>
                  {hospitals.map((h) => {
                    const est = getEstimate(h);
                    return (
                      <CompareCell key={h.slug}>
                        {est ? (
                          `${est.stayDays.min}–${est.stayDays.max} days`
                        ) : (
                          '—'
                        )}
                      </CompareCell>
                    );
                  })}
                </CompareRow>

                <CompareRow label="Distance from Airport" icon={MapPin}>
                  {hospitals.map((h) => (
                    <CompareCell key={h.slug}>
                      {h.nearestAirport ? (
                        <>
                          <span className="font-bold">{h.nearestAirport.distanceKm} km</span>
                          <span className="text-muted-foreground ml-1">
                            from {h.nearestAirport.code}
                          </span>
                        </>
                      ) : (
                        '—'
                      )}
                    </CompareCell>
                  ))}
                </CompareRow>

                <CompareRow label="Experience Tier">
                  {hospitals.map((h) => (
                    <CompareCell key={h.slug}>
                      <Badge variant="outline" className="text-[0.65rem] font-bold">
                        {EXPERIENCE_LABELS[h.experienceTier] || h.experienceTier}
                      </Badge>
                    </CompareCell>
                  ))}
                </CompareRow>

                <CompareRow label="Amenities">
                  {hospitals.map((h) => (
                    <CompareCell key={h.slug}>
                      <div className="space-y-1">
                        {['international_patient_desk', 'multilingual', 'english_speaking', 'family_friendly'].map(a => (
                          <div key={a} className="flex items-center gap-1.5">
                            <CheckMark value={h.amenities?.includes(a)} />
                            <span className="text-[0.65rem]">{AMENITY_LABELS[a]}</span>
                          </div>
                        ))}
                      </div>
                    </CompareCell>
                  ))}
                </CompareRow>

                <CompareRow label="Partner Tier">
                  {hospitals.map((h) => (
                    <CompareCell key={h.slug}>
                      <Badge
                        className={`text-[0.65rem] font-bold ${
                          h.partnerTier === 'platinum'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : h.partnerTier === 'gold'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {h.partnerTier?.charAt(0).toUpperCase() + h.partnerTier?.slice(1)}
                      </Badge>
                    </CompareCell>
                  ))}
                </CompareRow>
              </tbody>
            </table>
          </div>

          {/* Action row */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 justify-center flex-wrap">
              {hospitals.map((h) => (
                <Button
                  key={h.slug}
                  asChild
                  size="sm"
                  className="cta-gradient text-white text-xs font-bold rounded-full"
                >
                  <Link to={`/hospitals/${h.slug}`}>
                    View {h.name.split(' ')[0]} Details
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
