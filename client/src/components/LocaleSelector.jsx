import { useState } from 'react';
import { ChevronDown, MapPin, Check, Loader2, Globe } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  useLocale,
  COUNTRIES,
  CURRENCIES,
  LANGUAGES,
} from '@/context/LocaleContext';

export function LocaleSelector() {
  const {
    country,
    currency,
    language,
    isDetecting,
    locationStatus,
    changeCountry,
    changeCurrency,
    changeLanguage,
    detectLocation,
  } = useLocale();

  const [open, setOpen] = useState(false);

  return (
    <li className="list-none">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            data-cy="country-lang-switcher"
            data-testid="country-lang-switcher"
            className="flex items-center gap-1.5 rounded-sm bg-white/15 px-2.5 py-1 text-[0.75rem] font-bold text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white cursor-pointer border-0"
            aria-label={`Selected currency: ${currency.code}, language: ${language}`}
          >
            <span countrycode={country.code} className="inline-flex items-center shrink-0">
              <img
                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
                alt={country.name}
                className="h-3 w-4.5 rounded-[1px] object-cover shadow-xs"
              />
            </span>
            <span className="font-extrabold uppercase tracking-tight">{currency.code}</span>
            <span className="text-white/60">|</span>
            <span className="font-medium text-white/90">{language}</span>
            <ChevronDown className="size-3 text-white/80 transition-transform duration-200 data-[state=open]:rotate-180" aria-hidden="true" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-80 p-4 text-xs shadow-xl rounded-lg border border-rule">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-rule pb-2">
              <span className="font-black text-sm text-ink-strong flex items-center gap-1.5">
                <Globe className="size-4 text-primary" />
                Regional & Currency Settings
              </span>
            </div>

            {/* Geolocation detection block */}
            <div className="rounded-md bg-accent/60 p-2.5 border border-rule/50 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Automatic Location</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={detectLocation}
                  disabled={isDetecting}
                  className="h-7 px-2 text-[0.7rem] font-bold gap-1 bg-card hover:bg-accent"
                >
                  {isDetecting ? (
                    <Loader2 className="size-3 animate-spin text-primary" />
                  ) : (
                    <MapPin className="size-3 text-primary" />
                  )}
                  {isDetecting ? 'Detecting...' : 'Detect My Location'}
                </Button>
              </div>

              {locationStatus === 'granted' && (
                <p className="text-[0.68rem] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="size-3 shrink-0" /> Location set to {country.name} ({currency.code})
                </p>
              )}

              {locationStatus === 'denied' && (
                <p className="text-[0.68rem] text-muted-foreground">
                  Location access was not granted. You can select your location and currency manually below.
                </p>
              )}
            </div>

            {/* Country / Currency Selection */}
            <div className="flex flex-col gap-1">
              <label htmlFor="country-select" className="font-bold text-muted-foreground text-[0.7rem] uppercase tracking-wider">
                Country & Currency
              </label>
              <select
                id="country-select"
                value={country.code}
                onChange={(e) => changeCountry(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-2.5 py-1.5 text-xs text-foreground font-medium focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} — {c.currency} ({CURRENCIES[c.currency]?.symbol || c.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Currency Override */}
            <div className="flex flex-col gap-1">
              <label htmlFor="currency-select" className="font-bold text-muted-foreground text-[0.7rem] uppercase tracking-wider">
                Currency Code
              </label>
              <select
                id="currency-select"
                value={currency.code}
                onChange={(e) => changeCurrency(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-2.5 py-1.5 text-xs text-foreground font-medium focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
              >
                {Object.values(CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol}) — {curr.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selection */}
            <div className="flex flex-col gap-1">
              <label htmlFor="language-select" className="font-bold text-muted-foreground text-[0.7rem] uppercase tracking-wider">
                Language
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-2.5 py-1.5 text-xs text-foreground font-medium focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-[0.65rem] text-muted-foreground pt-1 border-t border-rule">
              All healthcare treatment estimates across AKEEZO will display in your selected currency.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </li>
  );
}
