const STEPS = [
  { t: 'Tell us the requirement', d: 'The diagnosis if you have one, the symptoms if you do not, and how urgent it is.' },
  { t: 'Share your records', d: 'Reports, scans, prescriptions and previous opinions — so specialists assess the real case.' },
  { t: 'Get options, not a pitch', d: 'Suitable hospitals and doctors side by side, with accreditation, experience and cost.' },
  { t: 'See the full estimate', d: 'Treatment, doctor, diagnostics, medicines, stay, transport and attendant — itemised.' },
  { t: 'We arrange the journey', d: 'Appointments, visa documentation, flights, airport pickup and medical-friendly stay.' },
  { t: 'Treatment and recovery', d: 'A coordinator on the ground, an attendant if you need one, family kept informed.' },
  { t: 'Home, and after', d: 'Fit-to-travel sign-off, the return journey, then nursing or physiotherapy at home.' },
];

export function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-heading" className="py-14">
      <div className="mx-auto max-w-[76rem] px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.1em] text-primary uppercase">
            How AKEEZO works
          </p>
          <h2 id="journey-heading" className="mt-2 text-2xl sm:text-[1.85rem]">
            One coordinator for the whole journey
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            A booking site would stop at the hospital. The journey does not — which is why AKEEZO
            plans it as one path, from the first question to the follow-up call after you get home.
          </p>
        </div>

        {/* An ordered list, because the order is the information. */}
        <ol className="mt-10 grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.t} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                {/* Decorative connector; it simply vanishes in forced colours
                    and the list semantics carry the sequence regardless. */}
                <span
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-border sm:block"
                />
              </div>
              <h3 className="mt-3 text-base">{step.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
