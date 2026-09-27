import { useId, useState, useRef, useEffect } from 'react';
import {
  Ambulance,
  CalendarDays,
  HeartPulse,
  HouseHeart,
  Loader2,
  MapPin,
  Phone,
  Pill,
  Stethoscope,
  Wallet,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { treatments, site, formatPhone, telHref } from '@/lib/site';
import { CarePreferenceRow } from '@/components/CarePreferenceRow';
import { Field, FieldSelect } from '@/components/WidgetField';
import { useLocale } from '@/context/LocaleContext';
import { useConfig } from '@/context/ConfigContext';

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
  { value: 'home', label: 'Home Healthcare', icon: HouseHeart },
  { value: 'emergency', label: 'Emergency Help', icon: Ambulance, urgent: true },
  { value: 'medicines', label: 'Medicines and Supplements', icon: Pill },
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

const COUNTRIES = [
  { value: 'India', label: 'India' },
  { value: 'UAE', label: 'UAE' },
  { value: 'USA', label: 'USA' },
];

const STATES = {
  'India': ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'],
  'UAE': ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
  'USA': ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'],
};

export function SearchWidget({ onPlan, onEmergency, onHome, onMedicines, onTabChange }) {
  const id = useId().replace(/:/g, '');
  const [tab, setTab] = useState('plan');
  const handleTabChange = (val) => { setTab(val); onTabChange?.(val); };
  const [journeyType, setJourneyType] = useState('treatment');
  const [isEmergencySubmitting, setIsEmergencySubmitting] = useState(false);
  const [isMedicinesSubmitting, setIsMedicinesSubmitting] = useState(false);
  const [medicinesCountry, setMedicinesCountry] = useState('India');
  const isSubmittingRef = useRef(false);
  const { currency, formatAmount } = useLocale();
  const { config } = useConfig();
  const { cities } = config;

  useEffect(() => {
    const handleSwitchTab = (e) => {
      if (e.detail) {
        setTab(e.detail);
      }
    };
    window.addEventListener('akeezo:switch-tab', handleSwitchTab);
    return () => window.removeEventListener('akeezo:switch-tab', handleSwitchTab);
  }, []);

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

  const handleMedicinesSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current || isMedicinesSubmitting) return;
    isSubmittingRef.current = true;
    setIsMedicinesSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      
      const file = formData.get('prescriptionFile');
      if (file && file.size > 0) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        });
        data.prescriptionBase64 = await base64Promise;
        data.prescriptionFileName = file.name;
      }
      
      await onMedicines?.(data);
    } finally {
      setIsMedicinesSubmitting(false);
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 300);
    }
  };

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
      <Tabs value={tab} onValueChange={handleTabChange}>
        <div className="rounded-[var(--radius)] bg-card shadow-widget border border-rule">
          {/* The `strip` variant lives in components/ui/tabs.jsx — the icon
              rail, tall triggers and active underline are all part of it, so
              the call site only says which colour each tab carries. */}
          <TabsList variant="strip" className="rounded-t-[var(--radius)]">
            {TABS.map(({ value, label, icon: Icon, urgent }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-tab={value}
                className={cn(
                  'group/tab-item',
                  urgent
                    ? 'hover:text-emergency-ink data-[state=active]:text-emergency-ink'
                    : value === 'plan'
                      ? 'hover:text-mint data-[state=active]:text-mint'
                      : 'hover:text-primary data-[state=active]:text-primary',
                )}
              >
                <span className="headerIconWrapper flex items-center justify-center transition-transform duration-200 group-hover/tab-item:scale-110">
                  <Icon aria-hidden="true" strokeWidth={1.8} className="size-5 sm:size-6" />
                </span>
                <span className="headerIconTextAlignment text-[0.72rem] sm:text-[0.85rem] font-extrabold tracking-tight">
                  {label}
                </span>
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
                    ...(config.planTreatments || []).map((t) => ({ value: t.label, label: t.label })),
                    { value: 'Not sure — help me decide', label: "I'm not sure — help me decide" },
                  ]}
                />

                <FieldSelect
                  className="md:col-span-3"
                  id={`${id}-city`}
                  name="preferredCity"
                  label="Preferred Location"
                  icon={MapPin}
                  defaultValue="recommend"
                  hint="We can recommend one"
                  variant="mint"
                  options={[
                    { value: 'recommend', label: 'Recommend a location for me' },
                    ...(config.countries?.map((c) => ({ value: c, label: `Country: ${c}` })) || []),
                    ...(config.cities?.map((c) => ({ value: c, label: c })) || []),
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
                  options={(config.planTimelines || []).map(t => ({ value: t, label: t }))}
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
                  options={(config.emergencyPlaceTypes || []).map(p => ({ value: p, label: p }))}
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
                  options={(config.emergencyProblems || []).map((p) => ({ value: p, label: p }))}
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

              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Only your name and mobile number are required — we work the rest out on the phone.
                Akeezo acts solely as a healthcare facilitator; services are delivered by independent healthcare professionals and service providers. Healthcare services are delivered by qualified professionals and trusted service providers.
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
                  options={(config.homeServices || []).map((s) => ({ value: s, label: s }))}
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
                  options={(config.homeDurations || []).map((d) => ({ value: d, label: d }))}
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

          <TabsContent value="medicines" className="mt-0 p-4 sm:p-5">
            <form onSubmit={handleMedicinesSubmit} className="space-y-6">
              <input type="hidden" name="intent" value="medicines" />
              <div className="grid grid-cols-1 divide-y divide-rule/60 md:grid-cols-5 md:divide-x md:divide-y-0">
                <Field
                  className="md:col-span-1"
                  id={`${id}-medicines-name`}
                  label="Full Name"
                  hint="Who is ordering?"
                >
                  <Input
                    id={`${id}-medicines-name`}
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="Enter Name"
                    className="h-auto border-0 bg-transparent p-0 text-lg font-bold shadow-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:ring-0 md:text-lg"
                  />
                </Field>

                <Field
                  className="md:col-span-1"
                  id={`${id}-medicines-phone`}
                  label="Mobile No."
                  hint="We will contact you"
                >
                  <Input
                    id={`${id}-medicines-phone`}
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

                <FieldSelect
                  className="md:col-span-1"
                  id={`${id}-medicines-country`}
                  name="country"
                  label="Country"
                  hint="Select country"
                  value={medicinesCountry}
                  onValueChange={setMedicinesCountry}
                  options={COUNTRIES}
                />

                <FieldSelect
                  className="md:col-span-1"
                  id={`${id}-medicines-state`}
                  name="state"
                  label="State / UT"
                  hint="Select state"
                  options={(STATES[medicinesCountry] || []).map(s => ({ value: s, label: s }))}
                />

                <FieldSelect
                  className="md:col-span-1"
                  id={`${id}-medicines-need`}
                  name="needType"
                  label="What you Need?"
                  hint="Medicine or Supplements"
                  options={(config.medicinesNeedTypes || []).map((n) => ({ value: n, label: n }))}
                />
              </div>

              <div className="flex items-start gap-2.5 px-2">
                <Checkbox
                  id="med-consent"
                  name="consent"
                  required
                  className="mt-0.5"
                />
                <Label
                  htmlFor="med-consent"
                  className="text-xs leading-relaxed font-normal text-muted-foreground"
                >
                  I declare that the information provided is accurate, and I consent to AKEEZO contacting me regarding this order. *
                </Label>
              </div>

              <WidgetSubmit label="Order Medicines" loading={isMedicinesSubmitting} />
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

