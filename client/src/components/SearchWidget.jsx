import { useId, useState, useRef } from 'react';
import {
  Ambulance,
  CalendarDays,
  HeartPulse,
  HouseHeart,
  Loader2,
  MapPin,
  Phone,
  Stethoscope,
  Wallet,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { treatments, cities, site, formatPhone, telHref } from '@/lib/site';
import { CarePreferenceRow } from '@/components/CarePreferenceRow';
import { Field, FieldSelect } from '@/components/WidgetField';
import { useLocale } from '@/context/LocaleContext';

/**
 * The MakeMyTrip search widget, adapted to healthcare.
 *
 * MMT's homepage is one dominant control: an icon tab strip, then a white card
 * of segmented fields divided by vertical rules, with a gradient pill button
 * straddling the card's bottom edge. The structure maps onto AKEEZO almost
 * directly — treatment replaces destination, city replaces airport, budget
 * replaces fare class — which is exactly the analogy the product brief draws.
 *
 * Three tabs, because the brief insists the three journeys are different
 * experiences, not variations of one form.
 */

const TABS = [
  { value: 'plan', label: 'Plan Treatment', icon: Stethoscope },
  { value: 'emergency', label: 'Emergency Help', icon: Ambulance, urgent: true },
  { value: 'home', label: 'Home Healthcare', icon: HouseHeart },
];

const URGENCY = [
  { value: 'within_48h', label: 'Within 24–48 hours' },
  { value: 'within_1_week', label: 'Within a week' },
  { value: 'within_1_month', label: 'Within a month' },
  { value: 'later', label: 'Planning for later' },
  { value: 'not_sure', label: 'Not sure yet' },
];

const BUDGETS = [
  { value: 'under_1l', label: 'Under ₹1 lakh' },
  { value: '1_3l', label: '₹1–3 lakh' },
  { value: '3_5l', label: '₹3–5 lakh' },
  { value: '5_10l', label: '₹5–10 lakh' },
  { value: '10_20l', label: '₹10–20 lakh' },
  { value: '20_50l', label: '₹20–50 lakh' },
  { value: '50l_plus', label: '₹50 lakh+' },
  { value: 'not_sure', label: 'Not sure' },
];

const HOME_SERVICES = [
  'Nurse',
  'Caregiver / attendant',
  'Physiotherapist',
  'Doctor home visit',
  'Post-operative care',
  'Elder care',
  'Palliative care',
  'Home diagnostics',
];

const PLACE_TYPES = [
  { value: 'home', label: 'Home' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'airport', label: 'Airport' },
  { value: 'railway_station', label: 'Railway station' },
  { value: 'office', label: 'Office' },
  { value: 'road', label: 'Road / in transit' },
  { value: 'other', label: 'Somewhere else' },
];

const PROBLEMS = [
  'Accident',
  'Chest pain',
  'Difficulty breathing',
  'Unconscious',
  'Severe bleeding',
  'Stroke symptoms',
  'Seizure',
  'Severe allergic reaction',
  'Burn',
  'Poisoning',
  'Pregnancy-related emergency',
  'Fall or injury',
  'Fever or illness',
  'Other',
  "I don't know",
];

export function SearchWidget({ onPlan, onEmergency, onHome }) {
  const id = useId().replace(/:/g, '');
  const [tab, setTab] = useState('plan');
  const [journeyType, setJourneyType] = useState('treatment');
  const [isEmergencySubmitting, setIsEmergencySubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const { currency, formatAmount } = useLocale();

  const dynamicBudgets = currency.code === 'INR'
    ? BUDGETS
    : [
        { value: 'under_1l', label: `Under ${formatAmount(100000)}` },
        { value: '1_3l', label: `${formatAmount(100000)} – ${formatAmount(300000)}` },
        { value: '3_5l', label: `${formatAmount(300000)} – ${formatAmount(500000)}` },
        { value: '5_10l', label: `${formatAmount(500000)} – ${formatAmount(1000000)}` },
        { value: '10_20l', label: `${formatAmount(1000000)} – ${formatAmount(2000000)}` },
        { value: '20_50l', label: `${formatAmount(2000000)} – ${formatAmount(5000000)}` },
        { value: '50l_plus', label: `${formatAmount(5000000)}+` },
        { value: 'not_sure', label: 'Not sure' },
      ];

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    try {
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      onPlan?.(formData, journeyType);
    } finally {
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 300);
    }
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsEmergencySubmitting(true);
    try {
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      await onEmergency?.(formData);
    } finally {
      setIsEmergencySubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleHomeSubmit = (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    try {
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      onHome?.(formData);
    } finally {
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 300);
    }
  };

  return (
    <div className="relative">
      {/* Icon tab strip — MMT floats this above the card, half-overlapping it. */}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="rounded-[var(--radius)] bg-card shadow-widget border border-rule">
          {/* The `strip` variant lives in components/ui/tabs.jsx — the icon
              rail, tall triggers and active underline are all part of it, so
              the call site only says which colour each tab carries. */}
          <TabsList variant="strip" className="rounded-t-[var(--radius)]">
            {TABS.map(({ value, label, icon: Icon, urgent }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  urgent
                    ? 'hover:text-emergency-ink data-[state=active]:text-emergency-ink'
                    : value === 'plan'
                      ? 'hover:text-mint data-[state=active]:text-mint'
                      : 'hover:text-primary data-[state=active]:text-primary',
                )}
              >
                <Icon aria-hidden="true" strokeWidth={1.6} />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* --- Plan treatment ------------------------------------------- */}
          <TabsContent value="plan" className="mt-0 p-4 sm:p-5">
            <RadioGroup
              value={journeyType}
              onValueChange={setJourneyType}
              className="fswTabs mb-4 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm font-sans"
            >
              {[
                { v: 'treatment', l: 'Treatment or surgery' },
                { v: 'second_opinion', l: 'Second opinion' },
                { v: 'consultation', l: 'Specialist consultation' },
                { v: 'diagnosis', l: 'Diagnosis / health check' },
              ].map(({ v, l }) => {
                const isSelected = journeyType === v;
                return (
                  <div
                    key={v}
                    onClick={() => setJourneyType(v)}
                    className={cn(
                      'group flex items-center gap-2 cursor-pointer py-1 text-sm transition-all duration-150 select-none',
                      isSelected
                        ? 'font-black text-ink-strong'
                        : 'font-semibold text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <RadioGroupItem
                      value={v}
                      id={`${id}-jt-${v}`}
                      className={cn(
                        'size-4 border-2 transition-all',
                        isSelected
                          ? 'border-mint bg-mint text-white shadow-xs'
                          : 'border-muted-foreground/40 bg-transparent group-hover:border-mint/60'
                      )}
                    />
                    <Label
                      htmlFor={`${id}-jt-${v}`}
                      className="cursor-pointer text-sm font-inherit text-inherit"
                    >
                      {l}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            <form onSubmit={handlePlanSubmit}>
              {/* The segmented row: MMT divides fields with hairline rules and
                  lets each one act as a large click target. */}
              <div className="grid grid-cols-1 divide-y divide-rule overflow-hidden rounded-[var(--radius)] border border-rule md:grid-cols-12 md:divide-x md:divide-y-0">
                <FieldSelect
                  className="md:col-span-4"
                  id={`${id}-treatment`}
                  name="treatment"
                  label="What do you need?"
                  icon={HeartPulse}
                  placeholder="Choose a treatment"
                  hint="Not sure? Pick the last option."
                  variant="mint"
                  options={[
                    ...treatments.map((t) => ({ value: t.label, label: t.label })),
                    { value: 'Not sure — help me decide', label: "I'm not sure — help me decide" },
                  ]}
                />

                <FieldSelect
                  className="md:col-span-3"
                  id={`${id}-city`}
                  name="preferredCity"
                  label="Where in India?"
                  icon={MapPin}
                  defaultValue="recommend"
                  hint="We can recommend one"
                  variant="mint"
                  options={[
                    { value: 'recommend', label: 'Recommend a city for me' },
                    ...cities.map((c) => ({ value: c, label: c })),
                  ]}
                />

                <FieldSelect
                  className="md:col-span-2"
                  id={`${id}-when`}
                  name="urgency"
                  label="How soon?"
                  icon={CalendarDays}
                  defaultValue="not_sure"
                  variant="mint"
                  options={URGENCY}
                />

                <FieldSelect
                  className="md:col-span-3"
                  id={`${id}-budget`}
                  name="budget"
                  label={`Approximate budget (${currency.symbol})`}
                  icon={Wallet}
                  defaultValue="not_sure"
                  hint={`In ${currency.code} · Estimates only`}
                  variant="mint"
                  options={dynamicBudgets}
                />
              </div>

              <CarePreferenceRow name="preference" variant="mint" />

              <WidgetSubmit label="Get My AKEEZO Plan" variant="mint" />
            </form>
          </TabsContent>

          {/* --- Emergency ------------------------------------------------ */}
          <TabsContent value="emergency" className="mt-0 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-emergency/30 bg-emergency-surface px-4 py-3">
              <Phone className="size-5 shrink-0 text-emergency-ink" aria-hidden="true" />
              <p className="text-sm font-bold text-emergency-ink">
                Faster on the phone —{' '}
                <a href={telHref(site.emergencyPhone)} className="underline">
                  {formatPhone(site.emergencyPhone)}
                </a>
                <span className="ml-1 font-normal text-muted-foreground">
                  · If the patient is unconscious or not breathing, call now instead of filling this
                  in.
                </span>
              </p>
            </div>

            <form onSubmit={handleEmergencySubmit}>
              <div className="grid grid-cols-1 divide-y divide-rule overflow-hidden rounded-[var(--radius)] border border-rule md:grid-cols-12 md:divide-x md:divide-y-0">
                <FieldSelect
                  className="md:col-span-3"
                  id={`${id}-place`}
                  name="placeType"
                  label="Where is the patient?"
                  icon={MapPin}
                  defaultValue="other"
                  options={PLACE_TYPES}
                />

                <Field
                  className="md:col-span-3"
                  id={`${id}-address`}
                  label="Address or landmark"
                  hint="A hotel name or landmark is enough"
                >
                  <Input
                    id={`${id}-address`}
                    name="locationLabel"
                    autoComplete="street-address"
                    placeholder="e.g., Hotel Taj Palace, Aerocity, New Delhi"
                    maxLength={300}
                    className="h-auto border-0 bg-transparent p-0 text-lg font-bold shadow-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:ring-0 md:text-lg"
                  />
                </Field>

                <FieldSelect
                  className="md:col-span-2"
                  id={`${id}-problem`}
                  name="problem"
                  label="What happened?"
                  icon={Ambulance}
                  defaultValue="I don't know"
                  options={PROBLEMS.map((p) => ({ value: p, label: p }))}
                />

                <Field
                  className="md:col-span-2"
                  id={`${id}-caller`}
                  label="Your name"
                  hint="So we know who we're calling"
                >
                  <Input
                    id={`${id}-caller`}
                    name="requesterName"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={120}
                    placeholder="Enter your full name"
                    className="h-auto border-0 bg-transparent p-0 text-lg font-bold shadow-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:ring-0 md:text-lg"
                  />
                </Field>

                <Field
                  className="md:col-span-2"
                  id={`${id}-phone`}
                  label="Your mobile"
                  hint="We call you back"
                >
                  <Input
                    id={`${id}-phone`}
                    name="requesterPhone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    minLength={6}
                    maxLength={32}
                    placeholder="+91 98765 43210"
                    className="h-auto border-0 bg-transparent p-0 text-lg font-bold shadow-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:ring-0 md:text-lg"
                  />
                </Field>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Only your name and mobile number are required — we work the rest out on the phone.
                AKEEZO coordinates emergency response and is not a substitute for your local
                emergency number.
              </p>

              <WidgetSubmit label="Connect Me To AKEEZO" danger loading={isEmergencySubmitting} disabled={isEmergencySubmitting} />
            </form>
          </TabsContent>

          {/* --- Home healthcare ------------------------------------------ */}
          <TabsContent value="home" className="mt-0 p-4 sm:p-5">
            <form onSubmit={handleHomeSubmit}>
              <div className="grid grid-cols-1 divide-y divide-rule overflow-hidden rounded-[var(--radius)] border border-rule md:grid-cols-12 md:divide-x md:divide-y-0">
                <FieldSelect
                  className="md:col-span-4"
                  id={`${id}-service`}
                  name="service"
                  label="Who do you need?"
                  icon={HouseHeart}
                  defaultValue="Nurse"
                  options={HOME_SERVICES.map((s) => ({ value: s, label: s }))}
                />

                <Field
                  className="md:col-span-4"
                  id={`${id}-where`}
                  label="Where is the patient?"
                  hint="Area or PIN code"
                >
                  <Input
                    id={`${id}-where`}
                    name="locationLabel"
                    autoComplete="address-level2"
                    placeholder="Gurugram, Sector 54"
                    maxLength={200}
                    className="h-auto border-0 bg-transparent p-0 text-lg font-bold shadow-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:ring-0 md:text-lg"
                  />
                </Field>

                <FieldSelect
                  className="md:col-span-2"
                  id={`${id}-duration`}
                  name="duration"
                  label="For how long?"
                  icon={CalendarDays}
                  defaultValue="not_sure"
                  options={[
                    { value: 'one_visit', label: 'A single visit' },
                    { value: 'few_days', label: 'A few days' },
                    { value: '1_2_weeks', label: '1–2 weeks' },
                    { value: '1_month_plus', label: 'A month or more' },
                    { value: 'ongoing', label: 'Ongoing / long term' },
                    { value: 'not_sure', label: 'Not sure' },
                  ]}
                />

                <Field
                  className="md:col-span-2"
                  id={`${id}-home-phone`}
                  label="Your mobile"
                  hint="We call you back"
                >
                  <Input
                    id={`${id}-home-phone`}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    minLength={6}
                    maxLength={32}
                    placeholder="+91 98xxx xxxxx"
                    className="h-auto border-0 bg-transparent p-0 text-lg font-bold shadow-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:ring-0 md:text-lg"
                  />
                </Field>
              </div>

              <WidgetSubmit label="Find Care At Home" />
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

/** The gradient pill that straddles the card's bottom edge, MMT-style. */
function WidgetSubmit({ label, danger = false, variant = 'primary', loading = false, disabled = false }) {
  return (
    <div className="-mb-9 flex justify-center pt-5">
      <button
        type="submit"
        disabled={disabled || loading}
        className={cn(
          'inline-flex h-[3.25rem] min-w-[14rem] max-w-full items-center justify-center gap-2 rounded-full px-6 sm:px-10',
          'text-base sm:text-lg font-bold tracking-wide text-white uppercase',
          'shadow-[0_4px_14px_rgb(0_0_0/0.18)] transition-[filter,translate,opacity] duration-150',
          'hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2',
          danger
            ? 'cta-gradient-danger focus-visible:outline-emergency'
            : variant === 'mint'
              ? 'cta-gradient-mint focus-visible:outline-mint'
              : 'cta-gradient focus-visible:outline-primary',
          (disabled || loading) && 'opacity-80 cursor-not-allowed hover:translate-y-0',
        )}
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin text-white" aria-hidden="true" />
            <span>Connecting…</span>
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}

