import {
  Activity,
  Ambulance,
  BedDouble,
  Building2,
  Calendar,
  CalendarCheck,
  Clock,
  Compass,
  FileSpreadsheet,
  FolderHeart,
  HeartHandshake,
  HeartPulse,
  Hospital,
  Languages,
  LayoutDashboard,
  Pill,
  Plane,
  Receipt,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
  UserCheck,
  Users,
} from 'lucide-react';

const COLUMNS = [
  {
    title: 'Before care',
    icon: Compass,
    items: [
      { text: 'Medical requirement assessment', icon: Stethoscope },
      { text: 'Second opinions', icon: UserCheck },
      { text: 'Doctor & hospital discovery', icon: Building2 },
      { text: 'Cost estimates', icon: Receipt },
      { text: 'Travel & visa planning', icon: Plane },
    ],
  },
  {
    title: 'During care',
    icon: Hospital,
    items: [
      { text: 'Appointments & diagnostics', icon: Calendar },
      { text: 'Hospitalisation support', icon: BedDouble },
      { text: 'Ambulance & emergency assistance', icon: Ambulance },
      { text: 'On-ground patient coordination', icon: UserCheck },
      { text: 'Translation & insurance liaison', icon: Languages },
    ],
  },
  {
    title: 'After care',
    icon: HeartHandshake,
    items: [
      { text: 'Home nursing & attendants', icon: HeartPulse },
      { text: 'Physiotherapy & rehabilitation', icon: Activity },
      { text: 'Medicines & diagnostics', icon: Pill },
      { text: 'Follow-up appointments', icon: CalendarCheck },
      { text: 'Elder care', icon: Users },
    ],
  },
  {
    title: 'Continuous',
    icon: RefreshCw,
    items: [
      { text: 'Patient health profile', icon: FileSpreadsheet },
      { text: 'Medical records in one place', icon: FolderHeart },
      { text: 'Scheduled follow-ups', icon: Clock },
      { text: 'Family dashboard', icon: LayoutDashboard },
      { text: 'Standing emergency cover', icon: ShieldAlert },
    ],
  },
];

export function Continuum() {
  return (
    <section id="about" aria-labelledby="continuum-heading" className="bg-sunk py-14 sm:py-16">
      <div className="mx-auto max-w-[76rem] px-4">
        <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">
          The AKEEZO model
        </p>
        <h2 id="continuum-heading" className="mt-2 text-2xl sm:text-[1.85rem] font-black text-ink-strong">
          Coordinated Across the Whole Arc of Care
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          A healthcare journey platform that helps patients discover, plan, access and coordinate
          healthcare — from emergency assistance and hospital care through medical tourism to
          recovery at home.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => {
            const HeaderIcon = col.icon;

            return (
              <div
                key={col.title}
                className="group flex flex-col rounded-[var(--radius)] border border-rule/80 bg-card p-4 sm:p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-widget"
              >
                <div className="flex items-center gap-2.5 border-b-2 border-primary/30 pb-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <HeaderIcon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-extrabold tracking-[0.05em] uppercase text-ink-strong group-hover:text-primary transition-colors">
                    {col.title}
                  </h3>
                </div>

                <ul className="mt-4 flex flex-col gap-3">
                  {col.items.map(({ text, icon: ItemIcon }) => (
                    <li key={text} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/85 leading-snug">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/80 text-primary">
                        <ItemIcon className="size-3" aria-hidden="true" />
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
