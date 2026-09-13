import { Building2, Globe2, Hotel, Plane, Shield, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { site } from '@/lib/site';

const PARTNERS = [
  {
    icon: Globe2,
    t: 'International agents',
    d: 'Indian healthcare infrastructure as a service. Create a patient, request hospital options, share the proposal under your own name.',
  },
  {
    icon: Building2,
    t: 'Hospitals',
    d: 'Qualified international and domestic patients arriving with records, expectations and travel already handled.',
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
    d: 'Case coordination, documentation and hospital liaison — with an auditable trail.',
  },
];

export function Partners() {
  return (
    <section id="partners" aria-labelledby="partners-heading" className="py-14">
      <div className="mx-auto max-w-[76rem] px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">For partners</p>
          <h2 id="partners-heading" className="mt-2 text-2xl sm:text-[1.85rem]">
            Your healthcare partner in India
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Organisations raise cases, track them and get documentation through a single desk.
            Partner portals with login, case tracking and billing arrive in a later phase — talk to
            us now and we onboard you manually in the meantime.
          </p>
        </div>

        <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map(({ icon: Icon, t, d }) => (
            <li key={t}>
              <Card className="h-full gap-2.5 p-5">
                <span className="flex size-11 items-center justify-center rounded-md bg-accent text-primary">
                  <Icon className="size-6" aria-hidden="true" strokeWidth={1.7} />
                </span>
                <h3 className="text-base">{t}</h3>
                <p className="text-sm text-muted-foreground">{d}</p>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <Button asChild variant="outline" size="lg" className="font-bold border-primary text-primary hover:bg-primary hover:text-white">
            <a href={`mailto:${site.partnersEmail}?subject=AKEEZO%20Partnership%20Inquiry`}>
              Talk to the partnerships team ({site.partnersEmail})
            </a>
          </Button>
        </p>
      </div>
    </section>
  );
}
