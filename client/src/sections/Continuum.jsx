const COLUMNS = [
  {
    title: 'Before care',
    items: [
      'Medical requirement assessment',
      'Second opinions',
      'Doctor & hospital discovery',
      'Cost estimates',
      'Travel & visa planning',
    ],
  },
  {
    title: 'During care',
    items: [
      'Appointments & diagnostics',
      'Hospitalisation support',
      'Ambulance & emergency assistance',
      'On-ground patient coordination',
      'Translation & insurance liaison',
    ],
  },
  {
    title: 'After care',
    items: [
      'Home nursing & attendants',
      'Physiotherapy & rehabilitation',
      'Medicines & diagnostics',
      'Follow-up appointments',
      'Elder care',
    ],
  },
  {
    title: 'Continuous',
    items: [
      'Patient health profile',
      'Medical records in one place',
      'Scheduled follow-ups',
      'Family dashboard',
      'Standing emergency cover',
    ],
  },
];

export function Continuum() {
  return (
    <section id="about" aria-labelledby="continuum-heading" className="bg-sunk py-14">
      <div className="mx-auto max-w-[76rem] px-4">
        <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">
          The AKEEZO model
        </p>
        <h2 id="continuum-heading" className="mt-2 text-2xl sm:text-[1.85rem]">
          Coordinated across the whole arc of care
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          A healthcare journey platform that helps patients discover, plan, access and coordinate
          healthcare — from emergency assistance and hospital care through medical tourism to
          recovery at home.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="border-b-2 border-primary/40 pb-2 text-sm tracking-[0.06em] uppercase">
                {col.title}
              </h3>
              <ul className="mt-3.5 flex flex-col gap-2">
                {col.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
