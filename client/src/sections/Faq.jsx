import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/lib/site';
import { HelpCircle, UserCheck } from 'lucide-react';

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-sunk py-14">
      <div className="mx-auto max-w-[76rem] px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left column: Image card & quick info badge */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-[var(--radius)] border border-rule bg-card shadow-card group">
              <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
                <img
                  src="/images/faq_support.webp"
                  alt="AKEEZO healthcare call center coordinator assisting a patient on phone call"
                  className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-md">
                  <UserCheck className="size-3.5" aria-hidden="true" />
                  24/7 Personal Coordinator Support
                </span>
                <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-white drop-shadow">
                  Have questions about your healthcare journey in India?
                </h3>
                <p className="mt-1.5 text-xs font-medium text-white/90 leading-relaxed drop-shadow">
                  Our dedicated care team guides you through every step — from first enquiry to post-care recovery.
                </p>
              </div>
            </div>

            {/* Quick reassurance card */}
            <div className="rounded-[var(--radius)] border border-rule bg-card p-4 shadow-sm flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2 text-primary shrink-0">
                <HelpCircle className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink-strong">Need immediate assistance?</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Call our 24/7 control desk at{' '}
                  <a href="tel:+911140845678" className="font-bold text-primary underline">
                    +91 11 4084 5678
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right column: FAQ heading & accordion */}
          <div className="lg:col-span-7 flex flex-col">
            <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">Questions</p>
            <h2 id="faq-heading" className="mt-2 text-2xl sm:text-[1.85rem]">
              Before you ask
            </h2>

            <Accordion type="single" collapsible defaultValue="faq-0" className="mt-7 flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={`faq-${i}`}
                  className="rounded-xl border border-border bg-card px-5 sm:px-6 transition-all duration-200 data-[state=open]:border-primary/40 data-[state=open]:bg-secondary/30 data-[state=open]:shadow-card"
                >
                  <AccordionTrigger className="py-4.5 text-left text-sm sm:text-base font-extrabold text-ink-strong hover:text-primary hover:no-underline gap-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-5 pt-2 border-t border-border/40 mt-1">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 rounded-[var(--radius)] border border-rule bg-muted p-5">
              <h2 className="text-base font-bold text-ink-strong">Important</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                AKEEZO coordinates healthcare services; it does not practise medicine and does not
                provide medical advice, diagnosis or treatment. All clinical decisions rest with the
                treating doctors and hospitals. Costs shown anywhere on this site are estimates, subject
                to medical evaluation and confirmation by the hospital. In a life-threatening emergency,
                call your local emergency number first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
