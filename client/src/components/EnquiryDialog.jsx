import { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { submitLead } from '@/lib/api';
import { site } from '@/lib/site';

const ENQUIRY_DRAFT_KEY = 'akeezo_enquiry_draft';

const COUNTRY_CODES = [
  { code: '+254', country: 'KE', flag: '🇰🇪', name: 'Kenya' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+255', country: 'TZ', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+256', country: 'UG', flag: '🇺🇬', name: 'Uganda' },
  { code: '+234', country: 'NG', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'UK' },
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'US/Canada' },
  { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
  { code: '+880', country: 'BD', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+977', country: 'NP', flag: '🇳🇵', name: 'Nepal' },
  { code: '+968', country: 'OM', flag: '🇴🇲', name: 'Oman' },
  { code: '+965', country: 'KW', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+974', country: 'QA', flag: '🇶🇦', name: 'Qatar' },
  { code: '+973', country: 'BH', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+20', country: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: '+251', country: 'ET', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '+994', country: 'AZ', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: '+998', country: 'UZ', flag: '🇺🇿', name: 'Uzbekistan' },
];

const loadSavedEnquiryDraft = () => {
  try {
    const raw = sessionStorage.getItem(ENQUIRY_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Step two of the search widget.
 *
 * The widget captures what the patient needs; this collects who they are and —
 * critically — their explicit consent before any of it is sent. The enquiry
 * describes a medical condition, so consent cannot be implied by pressing a
 * search button. MMT does the same thing structurally: search, then a booking
 * form that takes traveller details.
 */
export function EnquiryDialog({ open, onOpenChange, payload }) {
  const [state, setState] = useState('form'); // form | sending | done
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState(null);
  const [result, setResult] = useState(null);

  const isSubmittingRef = useRef(false);
  const savedDraft = loadSavedEnquiryDraft();

  const [name, setName] = useState(savedDraft?.name ?? '');
  const [countryCode, setCountryCode] = useState(savedDraft?.countryCode ?? '+254');
  const [phone, setPhone] = useState(savedDraft?.phone ?? payload?.phone ?? '');
  const [email, setEmail] = useState(savedDraft?.email ?? '');
  const [country, setCountry] = useState(savedDraft?.country ?? '');
  const [message, setMessage] = useState(savedDraft?.message ?? '');
  const [consent, setConsent] = useState(savedDraft?.consent ?? false);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);
  const triggerText = selectedCountry ? `${selectedCountry.flag} ${selectedCountry.code}` : countryCode;

  // Synchronize with draft or payload whenever the dialog is opened.
  useEffect(() => {
    if (open) {
      setState('form');
      setError(null);
      setFieldErrors(null);
      setResult(null);

      const draft = loadSavedEnquiryDraft();
      if (draft) {
        setName(draft.name ?? '');
        setCountryCode(draft.countryCode ?? '+254');
        setPhone(draft.phone ?? payload?.phone ?? '');
        setEmail(draft.email ?? '');
        setCountry(draft.country ?? '');
        setMessage(draft.message ?? '');
        setConsent(draft.consent ?? false);
      } else if (payload?.phone) {
        setPhone(payload.phone);
      }
    }
  }, [open, payload]);

  // Persist form inputs to sessionStorage
  useEffect(() => {
    if (state === 'done') return;
    const draft = { name, countryCode, phone, email, country, message, consent };
    try {
      sessionStorage.setItem(ENQUIRY_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Ignore quota errors
    }
  }, [name, countryCode, phone, email, country, message, consent, state]);

  const summary = payload?.summary ?? [];

  const onSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setState('sending');
    setError(null);
    setFieldErrors(null);

    const formattedPhone = phone ? `${countryCode} ${phone}`.trim() : '';

    try {
      const data = await submitLead({
        intent: payload?.intent,
        treatment: payload?.treatment || undefined,
        name,
        phone: formattedPhone,
        email: email || undefined,
        country: country || undefined,
        preferredCity: payload?.preferredCity || undefined,
        urgency: payload?.urgency || 'not_sure',
        message: [payload?.context, message].filter(Boolean).join('\n\n') || undefined,
        consent: consent === true,
      });
      setResult(data);
      setState('done');
      try {
        sessionStorage.removeItem(ENQUIRY_DRAFT_KEY);
      } catch {
        // Ignore storage errors
      }
    } catch (err) {
      setError(err.message || 'Failed to send enquiry. Please check your details and try again.');
      setFieldErrors(err.fields ?? null);
      setState('form');
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-lg">
        {state === 'done' ? (
          <div className="animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards flex flex-col pt-4 pb-2 text-center items-center">
            <div className="size-20 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-sm">
              <CheckCircle2 className="size-10 text-green-600 animate-in zoom-in-50 spin-in-180 duration-700 delay-150" />
            </div>
            <DialogHeader className="items-center sm:text-center space-y-4">
              <Badge variant="secondary" className="font-bold text-sm px-4 py-1">
                Reference {result.journeyId}
              </Badge>
              <DialogTitle className="text-2xl">{result.message}</DialogTitle>
              <DialogDescription className="text-base mt-2">
                A coordinator will call you. Quote{' '}
                <strong className="font-bold text-foreground">{result.journeyId}</strong> whenever
                you contact us — it will be the handle on your journey in the AKEEZO dashboard.
              </DialogDescription>
            </DialogHeader>

            <p className="mt-6 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl w-full text-left">
              Have medical reports ready? Email them to{' '}
              <a
                className="font-bold text-primary hover:underline"
                href={`mailto:${site.medicalEmail}?subject=${encodeURIComponent(result.journeyId)}`}
              >
                {site.medicalEmail}
              </a>{' '}
              with your reference in the subject line.
            </p>

            <DialogFooter className="mt-8 w-full sm:justify-center">
              <Button onClick={() => onOpenChange(false)} className="w-full font-bold h-12 text-base rounded-full">
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Almost there — how do we reach you?</DialogTitle>
              <DialogDescription>
                The assessment is free and there is no obligation.
              </DialogDescription>
            </DialogHeader>

            {summary.length > 0 && (
              <ul className="my-4 flex flex-wrap gap-1.5">
                {summary.map((item) => (
                  <li key={item}>
                    <Badge variant="secondary" className="font-medium">
                      {item}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="eq-name" className="font-bold">
                  Your name *
                </Label>
                <Input
                  id="eq-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="eq-phone" className="font-bold">
                  Phone / WhatsApp *
                </Label>
                <span id="eq-phone-hint" className="text-xs text-muted-foreground">
                  Include your country code.
                </span>
                <div className="flex gap-1.5">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="h-9 w-[6.5rem] shrink-0 font-medium bg-background text-foreground border-input px-2 text-xs sm:text-sm">
                      <SelectValue placeholder="+254">
                        {triggerText}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {COUNTRY_CODES.map((c) => (
                        <SelectItem key={`${c.country}-${c.code}`} value={c.code}>
                          {c.flag} {c.code} ({c.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="eq-phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="tel-national"
                    aria-describedby="eq-phone-hint"
                    required
                    minLength={6}
                    maxLength={15}
                    placeholder="7xx xxx xxx"
                    className="h-9 flex-1 bg-background font-medium text-foreground border-input"
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="eq-email" className="font-bold">
                  Email *
                </Label>
                <Input
                  id="eq-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={160}
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="eq-country" className="font-bold">
                  Country
                </Label>
                <Input
                  id="eq-country"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  autoComplete="country-name"
                  maxLength={80}
                  placeholder="Kenya"
                />
              </div>

              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="eq-message" className="font-bold">
                  Tell us briefly what is happening
                </Label>
                <span id="eq-message-hint" className="text-xs text-muted-foreground">
                  Diagnosis, symptoms, what doctors have said so far — whatever you have.
                </span>
                <Textarea
                  id="eq-message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={4000}
                  aria-describedby="eq-message-hint"
                  placeholder="My father has been diagnosed with a heart blockage and we are looking at options in India."
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="eq-consent"
                    name="consent"
                    required
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="eq-consent"
                    className="text-xs leading-relaxed font-normal text-muted-foreground"
                  >
                    I agree that AKEEZO may contact me about this enquiry and share the details with
                    hospitals and doctors in order to get options on my behalf. *
                  </Label>
                </div>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-md border border-emergency/40 bg-emergency-surface p-3 text-sm text-emergency-ink"
              >
                <strong className="font-bold">{error}</strong>
                {fieldErrors && (
                  <ul className="mt-1 list-disc pl-5">
                    {Object.entries(fieldErrors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <DialogFooter className="mt-5">
              <Button
                type="submit"
                disabled={state === 'sending'}
                className="w-full font-bold sm:w-auto"
              >
                {state === 'sending' ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  'Get my AKEEZO plan'
                )}
              </Button>
            </DialogFooter>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              We never sell your details. Costs we share are estimates, never quotations.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

