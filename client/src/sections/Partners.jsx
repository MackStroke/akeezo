import { Building2, Globe2, Hotel, Plane, Shield, Briefcase, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { site } from '@/lib/site';

const PARTNERS = [
  {
    icon: Globe2,
    t: 'International agents',
    d: "Create your unique AKEEZO ID, share the patient's details, request hospital options, get the estimate within 2 hours.",
  },
  {
    icon: Building2,
    t: 'Hospitals',
    d: 'Hospitals having infrastructure to serve international and domestic patients.',
  },
  {
    icon: Hotel,
    t: 'Hotels',
    d: 'Protect your guests with 24/7 emergency assistance and a coordinator who answers on the first call.',
  },
  {
    icon: Briefcase,
    t: 'Corporates',
    d: 'Emergency healthcare cover and home care for employees and their families, across cities.',
  },
  {
    icon: Plane,
    t: 'Travel agencies & airlines',
    d: 'Medical assistance for travellers and passengers, coordinated end to end.',
  },
  {
    icon: Shield,
    t: 'Insurance & TPAs',
    d: 'Case coordination, documentation and hospital liaison- with an auditable trail.',
  },
];

export function Partners() {
  return (
    <section id="partners" aria-labelledby="partners-heading" className="py-14">
      <div className="mx-auto max-w-[76rem] px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">For partners</p>
          <h2 id="partners-heading" className="mt-2 text-2xl sm:text-[1.85rem]">
            Be a Healthcare Partner with us
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            share your interest and portfolio to get onboarded in no time.
          </p>
        </div>

        <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map(({ icon: Icon, t, d }) => (
            <li key={t}>
              <Card className="group h-full gap-2.5 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-widget cursor-pointer">
                <span className="flex size-11 items-center justify-center rounded-md bg-accent text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" aria-hidden="true" strokeWidth={1.7} />
                </span>
                <h3 className="text-base font-bold text-ink-strong group-hover:text-primary transition-colors">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-8 flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-auto w-full sm:w-auto max-w-md py-3 px-4 sm:px-6 font-bold border-primary text-primary hover:bg-primary hover:text-white whitespace-normal text-center shadow-xs rounded-xl"
          >
            <a
              href={`mailto:${site.partnersEmail}?subject=AKEEZO%20Partnership%20Inquiry`}
              className="inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center"
            >
              <span className="inline-flex items-center gap-1.5 text-sm sm:text-base leading-snug">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                Talk to the partnerships team
              </span>
              <span className="text-xs sm:text-sm font-normal opacity-85 sm:font-bold sm:opacity-100">
                ({site.partnersEmail})
              </span>
            </a>
          </Button>
        </p>
      </div>
    </section>
  );
}
