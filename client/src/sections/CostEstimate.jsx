import {
  Check,
  FileText,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/context/LocaleContext';

/**
 * Redesigned as an authentic, high-clarity Medical Bill Invoice breakdown card.
 * Itemises medical, surgeon, stay, and transit costs line-by-line with dynamic currency support.
 */
const LINE_ITEMS = [
  { category: 'Clinical Care', code: 'MED-101', label: 'Hospital & Treatment Package', detail: 'Procedure, OT charges, ICU & private room stay', amount: 450000 },
  { category: 'Clinical Care', code: 'MED-102', label: 'Surgeon & Specialist Fee', detail: 'Primary operating surgeon & anaesthetist consultations', amount: 25000 },
  { category: 'Clinical Care', code: 'MED-103', label: 'Pre-op & Post-op Diagnostics', detail: 'Cath lab, blood tests, ECG, CT & echo imaging', amount: 30000 },
  { category: 'Clinical Care', code: 'MED-104', label: 'Pharmaceuticals & Supplies', detail: 'In-hospital medication, stents & discharge prescription', amount: 20000 },
  { category: 'Logistics & Stay', code: 'LOG-201', label: 'Medical-Friendly Accommodation', detail: 'Serviced apartment near hospital for 2 people (18-21 days)', amount: 45000 },
  { category: 'Logistics & Stay', code: 'LOG-202', label: 'Airport & Local Medical Transit', detail: 'Dedicated airport pick-up & daily hospital transfer vehicle', amount: 15000 },
  { category: 'Care & Recovery', code: 'REC-301', label: 'Personal Attendant & Caregiver', detail: 'Dedicated bedside caregiver support during recovery stay', amount: 20000 },
];

const TOTAL = LINE_ITEMS.reduce((sum, i) => sum + i.amount, 0);

const ASSURANCES = [
  'Itemised line-by-line transparency with zero surprise fees',
  'Converted instantly into your local currency on request',
  'Cross-compared across top NABH/JCI accredited hospitals',
  'Final written quote issued directly by hospital upon evaluation',
  'NO SINGLE MONEY to be paid after what has been promised* (excludes any other illness, medicines, longer stay)',
  'Free consultation - as Akeezo wants you not be health deprived due to budget constraints.',
];

export function CostEstimate() {
  const { currency, country, formatAmount } = useLocale();

  return (
    <section id="cost" aria-labelledby="cost-heading" className="py-10 sm:py-16 bg-background">
      <div className="mx-auto grid max-w-[76rem] items-start gap-8 sm:gap-10 px-4 lg:grid-cols-12">
        {/* Left Column: Explanatory Copy & Value Proposition */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
            <Receipt className="size-3.5" aria-hidden="true" />
            100% Upfront Financial Clarity
          </span>

          <h2
            id="cost-heading"
            className="mt-3 text-xl sm:text-2xl lg:text-[2rem] font-black tracking-tight text-ink-strong leading-tight"
          >
            Be Ready to Experience the Goodness, and Not Just the Surgery
          </h2>

          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Most families are quoted a surgical price and later face hidden hospital & stay bills.
            AKEEZO itemises your entire journey up front — hospital treatment, surgeon fees, stay,
            transit, and post-op care.
          </p>

          <ul className="mt-5 sm:mt-6 flex flex-col gap-2.5 sm:gap-3">
            {ASSURANCES.map((a) => (
              <li key={a} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-foreground font-medium">
                <div className="mt-0.5 flex size-4.5 sm:size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3 sm:size-3.5 stroke-[3]" aria-hidden="true" />
                </div>
                <span>{a}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <Button asChild size="lg" className="cta-gradient font-bold text-white shadow-md rounded-full px-6 sm:px-8 w-full sm:w-auto text-center justify-center">
              <a href="#top">Get My Journey Estimate</a>
            </Button>
            <span className="text-xs text-muted-foreground font-medium text-center sm:text-left">
              Free consultation · No commitment
            </span>
          </div>

          <div className="mt-6 sm:mt-8 relative overflow-hidden rounded-[var(--radius)] border border-rule bg-card shadow-card group">
            <img
              src="/images/cost_estimate_transparency.webp"
              alt="Transparent medical billing coordinator reviewing itemised estimate with patient family"
              className="h-40 sm:h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
              <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">
                Transparent Care Guarantee
              </span>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5 sm:mt-1">
                Dedicated financial coordinator assigned to every patient journey
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Redesigned Medical Bill Breakdown Card */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-xl sm:rounded-[1.25rem] border border-rule bg-card shadow-[0_8px_30px_rgb(29_38_93/0.12)]">
            {/* Bill Header Strip */}
            <div className="border-b border-rule bg-navy p-4 sm:p-6 text-white relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-primary-foreground border border-white/15">
                    <FileText className="size-4.5 sm:size-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-lg font-black tracking-tight text-white">AKEEZO Medical Bill Estimate</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider font-extrabold px-2 py-0.5">
                        Verified Quote
                      </Badge>
                    </div>
                    <p className="text-[0.68rem] sm:text-xs text-white/70 mt-0.5 leading-tight">
                      Ref: <span className="font-mono text-white/90 font-bold">EST-2026-8849</span> · Medical Journey Planning
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end border-t border-white/10 sm:border-t-0 pt-2.5 sm:pt-0">
                  <span className="block text-[0.65rem] sm:text-[0.68rem] font-bold text-white/60 uppercase tracking-wider">Estimated Total</span>
                  <span className="text-lg sm:text-xl font-black text-primary tracking-tight ml-2">
                    {formatAmount(TOTAL)}
                  </span>
                </div>
              </div>

              {/* Patient & Journey Metadata Grid */}
              <div className="mt-3.5 sm:mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 text-xs border-t border-white/10 pt-3 sm:pt-4">
                <div className="rounded-lg bg-white/5 p-2 sm:p-2.5 border border-white/10">
                  <span className="text-white/60 block text-[0.62rem] sm:text-[0.68rem]">Procedure</span>
                  <span className="font-bold text-white text-[0.72rem] sm:text-xs truncate block mt-0.5">Coronary Angioplasty</span>
                </div>
                <div className="rounded-lg bg-white/5 p-2 sm:p-2.5 border border-white/10">
                  <span className="text-white/60 block text-[0.62rem] sm:text-[0.68rem]">Destination</span>
                  <span className="font-bold text-white text-[0.72rem] sm:text-xs truncate block mt-0.5">Delhi NCR, India</span>
                </div>
                <div className="rounded-lg bg-white/5 p-2 sm:p-2.5 border border-white/10">
                  <span className="text-white/60 block text-[0.62rem] sm:text-[0.68rem]">Duration & Pax</span>
                  <span className="font-bold text-white text-[0.72rem] sm:text-xs truncate block mt-0.5">18–21 Days (2 Pax)</span>
                </div>
                <div className="rounded-lg bg-white/5 p-2 sm:p-2.5 border border-white/10">
                  <span className="text-white/60 block text-[0.62rem] sm:text-[0.68rem]">Currency</span>
                  <span className="font-bold text-primary text-[0.72rem] sm:text-xs truncate block mt-0.5">{currency.code} ({currency.symbol})</span>
                </div>
              </div>
            </div>

            {/* Bill Body - Mobile Native Cards (< sm) & Full Table (>= sm) */}
            <div className="p-3.5 sm:p-6">
              {/* Mobile Line Items View (< sm) */}
              <div className="block sm:hidden space-y-2.5">
                {LINE_ITEMS.map((item) => (
                  <div key={item.code} className="rounded-lg border border-rule/80 bg-card p-3 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[0.65rem] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-rule">
                          {item.code}
                        </span>
                        <span className="inline-block rounded-md bg-accent px-2 py-0.5 text-[0.65rem] text-primary font-bold">
                          {item.category}
                        </span>
                      </div>
                      <span className="font-bold text-sm tabular-nums text-primary">
                        {formatAmount(item.amount)}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-ink-strong leading-snug">
                      {item.label}
                    </h4>
                    <p className="text-[0.68rem] text-muted-foreground mt-0.5 leading-normal">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop & Tablet Table View (>= sm) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[440px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-rule text-[0.7rem] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="pb-3 pl-2">Item Code & Description</th>
                      <th className="pb-3 px-2">Category</th>
                      <th className="pb-3 pr-2 text-right">Estimated ({currency.code})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule/60 text-sm">
                    {LINE_ITEMS.map((item) => (
                      <tr key={item.code} className="group hover:bg-muted/40 transition-colors">
                        <td className="py-3.5 pl-2 pr-4 align-top">
                          <div className="flex items-start gap-2.5">
                            <span className="text-[0.7rem] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-rule mt-0.5">
                              {item.code}
                            </span>
                            <div>
                              <span className="font-bold text-ink-strong group-hover:text-primary transition-colors block">
                                {item.label}
                              </span>
                              <span className="text-xs text-muted-foreground block mt-0.5">
                                {item.detail}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 align-top text-xs font-semibold text-muted-foreground whitespace-nowrap">
                          <span className="inline-block rounded-md bg-accent px-2 py-0.5 text-[0.7rem] text-primary font-bold">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 pr-2 align-top text-right font-bold tabular-nums text-ink-strong whitespace-nowrap">
                          {formatAmount(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bill Totals Summary Box */}
              <div className="mt-4 sm:mt-6 rounded-xl border border-primary/20 bg-accent/50 p-3.5 sm:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[0.75rem] sm:text-xs text-muted-foreground">
                    <span>Medical & Surgical Subtotal</span>
                    <span className="font-bold text-foreground tabular-nums">{formatAmount(525000)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[0.75rem] sm:text-xs text-muted-foreground">
                    <span>Accommodation & Care Logistics Subtotal</span>
                    <span className="font-bold text-foreground tabular-nums">{formatAmount(80000)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[0.72rem] sm:text-xs text-emerald-600 font-semibold gap-1">
                    <span className="flex items-center gap-1 font-bold">
                      <ShieldCheck className="size-3.5 shrink-0" /> AKEEZO Coordination Fee
                    </span>
                    <span className="font-bold shrink-0">Included (₹0 hidden fees)</span>
                  </div>

                  <div className="my-1.5 sm:my-2 border-t border-primary/20" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                    <div>
                      <span className="text-sm sm:text-base font-black text-ink-strong block leading-tight">ESTIMATED JOURNEY TOTAL</span>
                      <span className="text-[0.65rem] sm:text-[0.7rem] text-muted-foreground block mt-0.5">
                        Includes procedure, surgeon, stay & transfers in {country.name}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-xl sm:text-2xl font-black text-primary tabular-nums">
                        {formatAmount(TOTAL)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill Disclaimer & Verification Footer */}
              <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-between gap-2.5 text-[0.68rem] sm:text-[0.72rem] text-muted-foreground border-t border-rule pt-3 sm:pt-4">
                <div className="flex items-start sm:items-center gap-2">
                  <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
                  <span>
                    Illustrative sample bill ({currency.code}). Final binding quotes issued by partner hospitals after medical records review.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
