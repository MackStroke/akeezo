import { useId, useState, useEffect, useRef } from 'react';
import { Loader2, MapPin, PhoneCall, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { submitEmergency } from '@/lib/api';
import { site, formatPhone, telHref } from '@/lib/site';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const EMERGENCY_DRAFT_KEY = 'akeezo_emergency_draft';

const loadSavedEmergencyDraft = () => {
  try {
    const raw = sessionStorage.getItem(EMERGENCY_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const PROBLEMS = [
  'Accident', 'Chest pain', 'Difficulty breathing', 'Unconscious', 'Severe bleeding',
  'Stroke symptoms', 'Seizure', 'Severe allergic reaction', 'Burn', 'Poisoning',
  'Pregnancy-related emergency', 'Fall or injury', 'Fever or illness', 'Other', "I don't know",
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

const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
];

const HELP = [
  { value: 'not_sure', label: "I'm not sure — help me" },
  { value: 'ambulance', label: 'Ambulance' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'emergency_team', label: 'Emergency medical team' },
  { value: 'hospital_coordination', label: 'Hospital coordination' },
  { value: 'medical_transport', label: 'Medical transport' },
];

const RELATIONSHIPS = [
  { value: 'family', label: 'Family member (Spouse, Son, Parent, Sibling)' },
  { value: 'self', label: 'Patient (Self)' },
  { value: 'friend', label: 'Friend or companion' },
  { value: 'colleague', label: 'Colleague or employer' },
  { value: 'hotel_staff', label: 'Hotel staff or concierge' },
  { value: 'airport_staff', label: 'Airport or airline staff' },
  { value: 'tour_guide', label: 'Tour guide or driver' },
  { value: 'passerby', label: 'Bystander or stranger' },
  { value: 'other', label: 'Other relationship' },
];

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+254', country: 'KE', flag: '🇰🇪', name: 'Kenya' },
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

/**
 * The full emergency intake, below the fast path in the search widget.
 *
 * Controlled dropdown fields guarantee that default values ("Somewhere else",
 * "I don't know", "Not sure", etc.) are painted visibly inside the trigger boxes.
 */
export function EmergencyForm() {
  const id = useId().replace(/:/g, '');
  const [status, setStatus] = useState('idle'); // idle | locating | sending | done
  const [coords, setCoords] = useState(null);
  const [locationNote, setLocationNote] = useState('');

  const savedDraft = loadSavedEmergencyDraft();
  
  // Controlled form states with explicit default values and draft restoration
  const [locationLabel, setLocationLabel] = useState(savedDraft?.locationLabel ?? '');
  const [requesterName, setRequesterName] = useState(savedDraft?.requesterName ?? '');
  const [requesterPhone, setRequesterPhone] = useState(savedDraft?.requesterPhone ?? '');
  const [patientName, setPatientName] = useState(savedDraft?.patientName ?? '');

  const [placeType, setPlaceType] = useState(savedDraft?.placeType ?? 'other');
  const [problem, setProblem] = useState(savedDraft?.problem ?? "I don't know");
  const [conscious, setConscious] = useState(savedDraft?.conscious ?? 'not_sure');
  const [breathing, setBreathing] = useState(savedDraft?.breathing ?? 'not_sure');
  const [helpNeeded, setHelpNeeded] = useState(savedDraft?.helpNeeded ?? 'not_sure');
  const [relationship, setRelationship] = useState(savedDraft?.relationship ?? 'family');
  const [countryCode, setCountryCode] = useState(savedDraft?.countryCode ?? '+91');
  
  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);
  const triggerText = selectedCountry ? `${selectedCountry.flag} ${selectedCountry.code}` : countryCode;
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const isSubmittingRef = useRef(false);

  // Synchronize state with sessionStorage draft
  useEffect(() => {
    if (status === 'done') return;
    const draft = {
      locationLabel,
      placeType,
      problem,
      conscious,
      breathing,
      helpNeeded,
      requesterName,
      countryCode,
      requesterPhone,
      patientName,
      relationship,
    };
    try {
      sessionStorage.setItem(EMERGENCY_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Ignore quota error
    }
  }, [
    locationLabel,
    placeType,
    problem,
    conscious,
    breathing,
    helpNeeded,
    requesterName,
    countryCode,
    requesterPhone,
    patientName,
    relationship,
    status,
  ]);

  const critical = conscious === 'no' || breathing === 'no';

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationNote('This browser cannot share your location. Please type the address instead.');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        setCoords({ lat: c.latitude, lng: c.longitude, accuracyMetres: Math.round(c.accuracy) });
        setLocationNote(
          `Location captured (accurate to about ${Math.round(c.accuracy)} m). Add a landmark if you can.`,
        );
        setStatus('idle');
      },
      () => {
        setLocationNote('We could not get your location. Please type the address or a landmark.');
        setStatus('idle');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setStatus('sending');
    setError(null);

    try {
      const data = await submitEmergency({
        location: {
          label: locationLabel || undefined,
          placeType: placeType,
          ...(coords ?? {}),
        },
        problem: problem,
        conscious,
        breathingNormally: breathing,
        helpNeeded: [helpNeeded],
        requesterName,
        requesterPhone: `${countryCode} ${requesterPhone || ''}`.trim(),
        patientName: patientName || undefined,
        relationship: relationship,
      });
      setResult(data);
      setStatus('done');
      try {
        sessionStorage.removeItem(EMERGENCY_DRAFT_KEY);
      } catch {
        // Ignore storage error
      }
    } catch (err) {
      setError(err.message || 'Failed to submit emergency request. Please try again.');
      setStatus('idle');
    } finally {
      isSubmittingRef.current = false;
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-[var(--radius)] bg-card p-6 shadow-widget" role="status">
        <Badge className="bg-emergency font-bold text-white">Case {result.caseId}</Badge>
        <h3 className="mt-3 text-xl font-bold">{result.message}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep this phone line free. Quote case{' '}
          <strong className="font-bold text-foreground">{result.caseId}</strong> if you need to call
          us before we reach you.
        </p>
        <Button asChild className="mt-5 h-14 w-full cta-gradient-danger text-base font-bold text-white">
          <a href={telHref(site.emergencyPhone)}>
            <PhoneCall aria-hidden="true" />
            Call the desk — {formatPhone(site.emergencyPhone)}
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-card p-5 shadow-widget sm:p-6 text-foreground border border-rule">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-ink-strong">Request Emergency Help</h3>
        <span className="rounded-full bg-emergency/10 px-2.5 py-0.5 text-xs font-bold text-emergency">
          Fast Intake
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        We call you back immediately. Only your name and number are required.
      </p>

      {/* Interlock Alert: interrupts if patient is reported unconscious or not breathing */}
      {critical && (
        <div
          role="alert"
          className="mt-4 flex gap-3 rounded-md border border-emergency/40 bg-emergency-surface p-3.5"
        >
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-emergency" aria-hidden="true" />
          <p className="text-sm text-emergency-ink">
            <strong className="font-bold">Do not fill in this form.</strong> If the patient is
            unconscious or not breathing normally, call now:{' '}
            <a href={telHref(site.emergencyPhone)} className="font-bold underline">
              {formatPhone(site.emergencyPhone)}
            </a>
            . Start CPR if you are trained.
          </p>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Where is the patient? */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-place`} className="font-bold text-ink-strong leading-none">
            Where is the patient?
          </Label>
          <div className="flex gap-2">
            <Select value={placeType} onValueChange={setPlaceType}>
              <SelectTrigger id={`${id}-place`} className="h-10 min-w-0 flex-1 font-medium bg-background text-foreground border-input">
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                {PLACE_TYPES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="placeType" value={placeType} />
            <Button
              type="button"
              variant="outline"
              onClick={requestLocation}
              aria-describedby={`${id}-loc-note`}
              className="h-10 shrink-0 font-bold border-input bg-background hover:bg-muted text-xs sm:text-sm px-3"
            >
              <MapPin aria-hidden="true" className="size-4 text-primary shrink-0" />
              <span>{status === 'locating' ? 'Locating…' : 'Use location'}</span>
            </Button>
          </div>
        </div>

        {/* Address or landmark */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-address`} className="font-bold text-ink-strong leading-none">
            Address or landmark
          </Label>
          <Input
            id={`${id}-address`}
            name="locationLabel"
            value={locationLabel}
            onChange={(e) => setLocationLabel(e.target.value)}
            autoComplete="street-address"
            placeholder="e.g., Hotel Taj Palace, Sardar Patel Marg, New Delhi"
            maxLength={300}
            className="h-10 bg-background font-medium text-foreground border-input"
          />
          <span id={`${id}-loc-note`} aria-live="polite" className="text-[0.72rem] text-muted-foreground">
            {locationNote || 'A hotel name, building or nearby landmark is enough.'}
          </span>
        </div>

        {/* What happened? */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-problem`} className="font-bold text-ink-strong leading-none">
            What happened?
          </Label>
          <Select value={problem} onValueChange={setProblem}>
            <SelectTrigger id={`${id}-problem`} className="h-10 w-full font-medium bg-background text-foreground border-input">
              <SelectValue placeholder="Select what happened" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {PROBLEMS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="problem" value={problem} />
        </div>

        {/* Is the patient conscious? */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-conscious`} className="font-bold text-ink-strong leading-none">
            Is the patient conscious?
          </Label>
          <Select value={conscious} onValueChange={setConscious}>
            <SelectTrigger id={`${id}-conscious`} className="h-10 w-full font-medium bg-background text-foreground border-input">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {YES_NO.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="conscious" value={conscious} />
        </div>

        {/* Breathing normally? */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-breathing`} className="font-bold text-ink-strong leading-none">
            Breathing normally?
          </Label>
          <Select value={breathing} onValueChange={setBreathing}>
            <SelectTrigger id={`${id}-breathing`} className="h-10 w-full font-medium bg-background text-foreground border-input">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {YES_NO.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="breathingNormally" value={breathing} />
        </div>

        {/* What help do you need? */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-help`} className="font-bold text-ink-strong leading-none">
            What help do you need?
          </Label>
          <Select value={helpNeeded} onValueChange={setHelpNeeded}>
            <SelectTrigger id={`${id}-help`} className="h-10 w-full font-medium bg-background text-foreground border-input">
              <SelectValue placeholder="Select help required" />
            </SelectTrigger>
            <SelectContent>
              {HELP.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="helpNeeded" value={helpNeeded} />
        </div>

        {/* Your name * */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-name`} className="font-bold text-ink-strong leading-none">
            Your name *
          </Label>
          <Input
            id={`${id}-name`}
            name="requesterName"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            autoComplete="name"
            placeholder="Enter your full name"
            required
            minLength={2}
            maxLength={120}
            className="h-10 bg-background font-medium text-foreground border-input"
          />
        </div>

        {/* Your mobile number * */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-phone`} className="font-bold text-ink-strong leading-none">
            Your mobile number *
          </Label>
          <div className="flex gap-1.5">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="h-10 w-[6.5rem] shrink-0 font-medium bg-background text-foreground border-input px-2.5 text-xs sm:text-sm">
                <SelectValue placeholder="+91">
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
              id={`${id}-phone`}
              name="requesterPhone"
              value={requesterPhone}
              onChange={(e) => setRequesterPhone(e.target.value)}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="tel-national"
              required
              minLength={6}
              maxLength={15}
              placeholder="98765 43210"
              className="h-10 flex-1 bg-background font-medium text-foreground border-input"
            />
          </div>
        </div>

        {/* Patient name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-patient`} className="font-bold text-ink-strong leading-none">
            Patient name
          </Label>
          <Input
            id={`${id}-patient`}
            name="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Patient's name (optional)"
            maxLength={120}
            className="h-10 bg-background font-medium text-foreground border-input"
          />
        </div>

        {/* Relationship */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-rel`} className="font-bold text-ink-strong leading-none">
            You are the patient&apos;s…
          </Label>
          <Select value={relationship} onValueChange={setRelationship}>
            <SelectTrigger id={`${id}-rel`} className="h-10 w-full font-medium bg-background text-foreground border-input">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIPS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="relationship" value={relationship} />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-md border border-emergency/40 bg-emergency-surface p-3 text-sm text-emergency-ink"
        >
          {error} Call{' '}
          <a href={telHref(site.emergencyPhone)} className="font-bold underline">
            {formatPhone(site.emergencyPhone)}
          </a>{' '}
          now.
        </div>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            disabled={status === 'sending' || !requesterName || !requesterPhone}
            className="mt-6 h-14 w-full cta-gradient-danger text-base font-bold tracking-wide text-white uppercase shadow-md hover:shadow-lg transition-all"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              'Connect me to AKEEZO'
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-emergency font-black flex items-center gap-2">
              <TriangleAlert className="size-5" /> Confirm Emergency Dispatch Request
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm space-y-2">
              <p>
                You are requesting immediate emergency intake for{' '}
                <strong className="text-foreground">{patientName || requesterName || 'the patient'}</strong>.
              </p>
              <p className="text-muted-foreground">
                AKEEZO desk staff will immediately call{' '}
                <strong className="text-foreground">{countryCode} {requesterPhone}</strong> to coordinate local medical response.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs font-bold">Edit Details</AlertDialogCancel>
            <AlertDialogAction
              onClick={onSubmit}
              className="bg-emergency hover:bg-emergency-strong text-white font-bold text-xs"
            >
              Confirm Emergency Dispatch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        AKEEZO coordinates emergency response. We are not a substitute for your local emergency
        number — in a life-threatening emergency, call that first.
      </p>
    </form>
  );
}
