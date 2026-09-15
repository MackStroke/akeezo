import {
  Activity,
  BedDouble,
  ClipboardList,
  HeartHandshake,
  HeartPulse,
  Stethoscope,
  TestTube,
  UserRound,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SERVICES = [
  { icon: UserRound, t: 'Nurses', d: 'Shift, full time nursing, wound care, injections and monitoring.' },
  { icon: HeartHandshake, t: 'Caregivers & Attendants', d: 'Day-to-day support for mobility, hygiene, feeding and company.' },
  { icon: Activity, t: 'Physiotherapy', d: 'Post-surgical, neurological and orthopaedic rehab at home.' },
  { icon: Stethoscope, t: 'Doctor Home Visits', d: 'A physician at the bedside when a clinic trip is not realistic.' },
  { icon: ClipboardList, t: 'Post-Operative Care', d: 'Discharge-to-home plans, dressings and medication management.' },
  { icon: HeartPulse, t: 'Elder & Palliative Care', d: 'Long-term care at home, with dignity and family involvement.' },
  { icon: TestTube, t: 'Home Diagnostics', d: 'Sample collection and reports without leaving the house.' },
  { icon: BedDouble, t: 'Medical Equipment', d: 'Beds, oxygen, concentrators and monitors, delivered and set up.' },
];

export function HomeCare() {
  return (
    <section id="home-care" aria-labelledby="home-care-heading" className="py-14">
      <div className="mx-auto max-w-[76rem] px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">
            Home healthcare
          </p>
          <h2 id="home-care-heading" className="mt-2 text-2xl sm:text-[1.85rem]">
            Care That Continues After the Hospital
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Recovery happens at home, not in a discharge summary. The same coordinator who planned
            the treatment remains with you until recovery— whether the patient flew in for surgery or
            still under our supervision.
          </p>
        </div>

        <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, t, d }) => (
            <li key={t}>
              <Card className="group h-full gap-2.5 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-widget-orange cursor-pointer">
                <span className="flex size-11 items-center justify-center rounded-md bg-accent text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" aria-hidden="true" strokeWidth={1.7} />
                </span>
                <h3 className="text-base font-bold text-ink-strong group-hover:text-primary transition-colors">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <Button asChild size="lg" className="font-bold">
            <a href="#top">Find care at home</a>
          </Button>
        </p>
      </div>
    </section>
  );
}
