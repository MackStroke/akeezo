import { IndianRupee, CalendarDays, ReceiptText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function TreatmentEstimates({ estimates = [] }) {
  if (!estimates || estimates.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed rounded-lg text-muted-foreground">
        No treatment estimates available for this hospital yet.
      </div>
    );
  }

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {estimates.map((est, idx) => (
        <Card key={idx} className="overflow-hidden bg-card hover:shadow-md transition-shadow">
          <div className="h-1.5 w-full bg-primary/20">
            <div className="h-full bg-primary w-1/3 rounded-r-full" />
          </div>
          
          <CardContent className="p-5">
            <div className="flex flex-col h-full gap-4">
              
              <div>
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  {est.treatmentLabel}
                </div>
                <h4 className="font-bold text-ink-strong leading-tight">
                  {est.procedure || 'Standard Treatment'}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-border/50">
                
                <div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <ReceiptText className="w-3.5 h-3.5" />
                    Estimated Cost
                  </div>
                  <div className="font-semibold text-sm">
                    {formatMoney(est.costRange.min)} - {formatMoney(est.costRange.max)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Recovery Stay
                  </div>
                  <div className="font-semibold text-sm">
                    {est.stayDays.min} to {est.stayDays.max} Days
                  </div>
                </div>

              </div>

            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
