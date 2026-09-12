import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', language: 'English' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', language: 'English' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', language: 'English' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', language: 'Arabic' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', language: 'English' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', language: 'Swahili' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', language: 'English' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', currency: 'BDT', language: 'English' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', currency: 'OMR', language: 'Arabic' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', currency: 'KWD', language: 'Arabic' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', currency: 'RUB', language: 'Russian' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', currency: 'UZS', language: 'Russian' },
];

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1.0, locale: 'en-IN', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', rate: 0.0118, locale: 'en-US', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.0108, locale: 'de-DE', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0091, locale: 'en-GB', name: 'British Pound' },
  AED: { code: 'AED', symbol: 'AED', rate: 0.0432, locale: 'ar-AE', name: 'UAE Dirham' },
  SAR: { code: 'SAR', symbol: 'SAR', rate: 0.0442, locale: 'ar-SA', name: 'Saudi Riyal' },
  KES: { code: 'KES', symbol: 'KSh', rate: 1.52, locale: 'sw-KE', name: 'Kenyan Shilling' },
  NGN: { code: 'NGN', symbol: '₦', rate: 18.8, locale: 'en-NG', name: 'Nigerian Naira' },
  BDT: { code: 'BDT', symbol: '৳', rate: 1.43, locale: 'bn-BD', name: 'Bangladeshi Taka' },
  OMR: { code: 'OMR', symbol: 'OMR', rate: 0.0045, locale: 'ar-OM', name: 'Omani Rial' },
  KWD: { code: 'KWD', symbol: 'KWD', rate: 0.0036, locale: 'ar-KW', name: 'Kuwaiti Dinar' },
  RUB: { code: 'RUB', symbol: '₽', rate: 1.12, locale: 'ru-RU', name: 'Russian Ruble' },
  UZS: { code: 'UZS', symbol: 'soʻm', rate: 148.5, locale: 'uz-UZ', name: 'Uzbekistan Som' },
};

export const LANGUAGES = [
  'English',
  'Hindi',
  'Arabic',
  'French',
  'Swahili',
  'Russian',
];

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default India
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES.INR);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'detecting' | 'granted' | 'denied' | 'error'

  const changeCountry = useCallback((countryCode) => {
    const matched = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
    setSelectedCountry(matched);
    if (CURRENCIES[matched.currency]) {
      setSelectedCurrency(CURRENCIES[matched.currency]);
    }
  }, []);

  const changeCurrency = useCallback((currencyCode) => {
    if (CURRENCIES[currencyCode]) {
      setSelectedCurrency(CURRENCIES[currencyCode]);
    }
  }, []);

  const changeLanguage = useCallback((lang) => {
    setSelectedLanguage(lang);
  }, []);

  // Format an amount (given in INR base) into the selected currency
  const formatAmount = useCallback(
    (amountInINR) => {
      const converted = amountInINR * selectedCurrency.rate;
      try {
        return new Intl.NumberFormat(selectedCurrency.locale, {
          style: 'currency',
          currency: selectedCurrency.code,
          maximumFractionDigits: selectedCurrency.rate > 10 ? 0 : 0,
        }).format(converted);
      } catch {
        // Fallback formatting if locale is missing
        return `${selectedCurrency.symbol} ${Math.round(converted).toLocaleString()}`;
      }
    },
    [selectedCurrency]
  );

  // Auto-detect user's location via Geolocation or IP/Timezone fallback
  const detectLocation = useCallback(async () => {
    setIsDetecting(true);
    setLocationStatus('detecting');

    const handleSuccess = (countryCode) => {
      const matched = COUNTRIES.find((c) => c.code === countryCode);
      if (matched) {
        setSelectedCountry(matched);
        setSelectedCurrency(CURRENCIES[matched.currency] || CURRENCIES.USD);
      }
      setIsDetecting(false);
      setLocationStatus('granted');
    };

    const handleFallback = () => {
      // Try timezone matching fallback
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        if (tz.includes('Kolkata') || tz.includes('Asia/Calcutta')) {
          handleSuccess('IN');
          return;
        } else if (tz.includes('Dubai')) {
          handleSuccess('AE');
          return;
        } else if (tz.includes('Riyadh')) {
          handleSuccess('SA');
          return;
        } else if (tz.includes('London')) {
          handleSuccess('GB');
          return;
        } else if (tz.includes('Nairobi')) {
          handleSuccess('KE');
          return;
        } else if (tz.includes('Lagos')) {
          handleSuccess('NG');
          return;
        } else if (tz.includes('Dhaka')) {
          handleSuccess('BD');
          return;
        } else if (tz.includes('Moscow')) {
          handleSuccess('RU');
          return;
        } else if (tz.includes('America')) {
          handleSuccess('US');
          return;
        }
      } catch {}

      // Default fallback
      setIsDetecting(false);
      setLocationStatus('denied');
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.countryCode) {
                handleSuccess(data.countryCode);
                return;
              }
            }
          } catch {}
          handleFallback();
        },
        () => {
          handleFallback();
        },
        { timeout: 8000 }
      );
    } else {
      handleFallback();
    }
  }, []);

  return (
    <LocaleContext.Provider
      value={{
        country: selectedCountry,
        currency: selectedCurrency,
        language: selectedLanguage,
        isDetecting,
        locationStatus,
        changeCountry,
        changeCurrency,
        changeLanguage,
        detectLocation,
        formatAmount,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}
