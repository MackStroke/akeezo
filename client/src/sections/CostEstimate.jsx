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
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-mint/15 px-3 py-1 text-xs font-bold text-mint border border-mint/30">
            <Receipt className="size-3.5 text-mint" aria-hidden="true" />
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
                <div className="mt-0.5 flex size-4.5 sm:size-5 shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint">
                  <Check className="size-3 sm:size-3.5 stroke-[3]" aria-hidden="true" />
                </div>
                <span>{a}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <Button asChild size="lg" className="cta-gradient-mint font-bold text-white shadow-md rounded-full px-6 sm:px-8 w-full sm:w-auto text-center justify-center">
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
              <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider text-mint">
                Transparent Care Guarantee
              </span>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5 sm:mt-1">
                Dedicated financial coordinator assigned to every patient journey
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Authentic Paper-Style Hospital Bill Invoice */}
        <div className="lg:col-span-7">
          <div className="relative rounded-xl border border-[#e2ddd3] dark:border-rule bg-[#fcfbf9] dark:bg-[#0c1a17] text-foreground shadow-[0_16px_45px_-10px_rgba(0,0,0,0.15),0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Top Perforation & Brand Color Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-navy via-mint to-navy" />

            {/* Verified Watermark Stamp Effect */}
            <div aria-hidden="true" className="absolute top-20 right-6 sm:right-10 pointer-events-none select-none z-10 rotate-[-12deg] opacity-20 sm:opacity-25">
              <div className="border-4 border-mint px-3.5 py-1.5 rounded-lg text-center font-black tracking-widest text-mint uppercase text-xs sm:text-sm shadow-xs">
                AKEEZO VERIFIED
                <span className="block text-[0.6rem] tracking-normal font-bold">100% UPFRONT ESTIMATE</span>
              </div>
            </div>

            {/* Letterhead Header Section */}
            <div className="p-4 sm:p-7 border-b border-dashed border-[#e0dad0] dark:border-white/10 bg-[#f4f1e8] dark:bg-white/5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Hospital / Desk Logo & Letterhead */}
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0b4f46] text-white shadow-sm border border-[#0b4f46]/30">
                    <FileText className="size-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.65rem] font-bold text-white uppercase tracking-widest bg-[#0b4f46] px-2.5 py-0.5 rounded shadow-xs">
                        OFFICIAL MEDICAL ESTIMATE
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1 font-serif">
                      AKEEZO Healthcare Network
                    </h3>
                    <p className="text-[0.75rem] text-slate-600 dark:text-slate-300 font-sans font-medium">
                      NABH & JCI Accredited Hospital Partner Desk · New Delhi, India
                    </p>
                  </div>
                </div>

                {/* Invoice Reference Metadata Box */}
                <div className="sm:text-right font-mono text-xs bg-white dark:bg-card p-2.5 rounded-md border border-[#d8d3c7] dark:border-white/15 shadow-xs shrink-0">
                  <div className="text-[0.65rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estimate Ref</div>
                  <div className="font-extrabold text-[#007a6c] dark:text-[#00c7be] text-sm">EST-2026-8849</div>
                  <div className="text-[0.65rem] text-slate-600 dark:text-slate-300 mt-0.5">Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              {/* Patient & Case Information Grid */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-dashed border-[#d8d3c7] dark:border-white/10 text-xs font-sans">
                <div className="rounded bg-white/80 dark:bg-white/5 p-2 border border-[#dfd9ce] dark:border-white/10 shadow-xs">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Patient Case</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 block mt-0.5 text-xs truncate">International Patient</span>
                </div>
                <div className="rounded bg-white/80 dark:bg-white/5 p-2 border border-[#dfd9ce] dark:border-white/10 shadow-xs">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Procedure</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 block mt-0.5 text-xs truncate">Coronary Angioplasty</span>
                </div>
                <div className="rounded bg-white/80 dark:bg-white/5 p-2 border border-[#dfd9ce] dark:border-white/10 shadow-xs">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Est. Duration</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 block mt-0.5 text-xs truncate">18–21 Days (2 Pax)</span>
                </div>
                <div className="rounded bg-white/80 dark:bg-white/5 p-2 border border-[#dfd9ce] dark:border-white/10 shadow-xs">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Currency</span>
                  <span className="font-extrabold text-[#007a6c] dark:text-[#00c7be] block mt-0.5 text-xs truncate">{currency.code} ({currency.symbol})</span>
                </div>
              </div>
            </div>

            {/* Paper Bill Itemised Table */}
            <div className="p-4 sm:p-7">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-ink-strong/20 dark:border-white/20 text-[0.7rem] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="pb-2.5 pl-1">Item Code & Medical Description</th>
                      <th className="pb-2.5 px-2 text-center">Category</th>
                      <th className="pb-2.5 pr-1 text-right">Amount ({currency.symbol})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-[#e0dad0] dark:divide-white/10 font-sans text-xs sm:text-sm">
                    {LINE_ITEMS.map((item) => (
                      <tr key={item.code} className="hover:bg-[#f4f1e8] dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 pl-1 pr-3 align-top">
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-[0.68rem] font-bold text-muted-foreground bg-[#eae6dc] dark:bg-muted px-1.5 py-0.5 rounded border border-[#dfd9ce] dark:border-rule shrink-0 mt-0.5">
                              {item.code}
                            </span>
                            <div>
                              <span className="font-bold text-ink-strong block leading-snug">
                                {item.label}
                              </span>
                              <span className="text-[0.72rem] text-muted-foreground block mt-0.5 leading-normal">
                                {item.detail}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 align-top text-center text-[0.7rem] font-semibold text-muted-foreground whitespace-nowrap">
                          <span className="inline-block rounded bg-mint/15 text-mint font-bold px-2 py-0.5 border border-mint/30 text-[0.65rem]">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 pr-1 align-top text-right font-mono font-extrabold tabular-nums text-ink-strong whitespace-nowrap text-sm sm:text-base">
                          {formatAmount(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bill Totals Summary & Stamp Box */}
              <div className="mt-6 rounded-lg border border-dashed border-[#dcd6c8] dark:border-white/15 bg-[#f5f2e9] dark:bg-white/5 p-4 sm:p-5">
                <div className="flex flex-col gap-2 font-sans text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Medical & Surgical Package Subtotal</span>
                    <span className="font-mono font-bold text-foreground tabular-nums">{formatAmount(525000)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Accommodation, Stay & Local Transfer Subtotal</span>
                    <span className="font-mono font-bold text-foreground tabular-nums">{formatAmount(80000)}</span>
                  </div>
                  <div className="flex items-center justify-between text-mint font-bold pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-4 shrink-0" /> AKEEZO 24/7 Journey Coordination Fee
                    </span>
                    <span className="font-mono text-[0.65rem] uppercase bg-mint/15 px-2 py-0.5 rounded border border-mint/30 font-bold">
                      INCLUDED (₹0 HIDDEN FEES)
                    </span>
                  </div>

                  <div className="my-2 border-t-2 border-dashed border-ink-strong/20 dark:border-white/20" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-sm sm:text-base font-black text-ink-strong block font-serif tracking-tight">
                        TOTAL ESTIMATED HOSPITAL BILL
                      </span>
                      <span className="text-[0.68rem] text-muted-foreground block mt-0.5">
                        All-inclusive procedure, surgeon, hospital stay & local transport estimate in {country.name}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-mint tabular-nums">
                        {formatAmount(TOTAL)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Signature / Verification Paper Footer */}
              <div className="mt-5 pt-4 border-t border-dashed border-[#e0dad0] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
                <div className="flex items-center gap-2 text-muted-foreground text-[0.72rem]">
                  <ShieldCheck className="size-4 text-mint shrink-0" />
                  <span>Official binding quote issued upon hospital medical board evaluation.</span>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono text-[0.68rem] text-muted-foreground">
                  <div className="text-right">
                    <span className="block font-bold text-ink-strong">Desk Officer Approval</span>
                    <span className="text-mint font-sans text-[0.65rem] italic font-bold">✓ Medical Triage Cleared</span>
                  </div>
                  <div className="size-9 rounded-full bg-navy text-white border border-navy/30 flex items-center justify-center font-black text-xs shadow-xs">
                    AK
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
