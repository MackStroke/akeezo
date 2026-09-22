import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem('akeezo_cookie_consent');
    if (!consent) {
      // Small delay to allow the page to load before sliding in the banner
      const timer = setTimeout(() => {
        setIsVisible(true);
        setMounted(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type) => {
    localStorage.setItem('akeezo_cookie_consent', type); // 'all' or 'essential'
    localStorage.setItem('akeezo_consent_date', new Date().toISOString());
    setIsVisible(false);
    
    // In a real app, you would also trigger your analytics/marketing scripts here if type === 'all'
    if (type === 'all') {
      window.dispatchEvent(new Event('cookie_consent_all'));
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[26rem] z-[100] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      )}
    >
      <div className="relative overflow-hidden rounded-2xl border border-rule/60 bg-card/85 p-5 shadow-2xl backdrop-blur-xl">
        {/* Subtle decorative background glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 blur-[40px]" />
        
        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Cookie className="size-5" />
            </div>
            <button
              onClick={() => handleConsent('essential')}
              className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Close and accept only essential"
            >
              <X className="size-4" />
            </button>
          </div>
          
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-foreground">
              We value your privacy
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies as detailed in our{' '}
              <Link to="/privacy" className="font-semibold text-primary hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={() => handleConsent('essential')}
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-bold h-9"
            >
              Essential Only
            </Button>
            <Button
              onClick={() => handleConsent('all')}
              size="sm"
              className="flex-1 bg-primary text-xs font-bold text-white hover:bg-primary/90 shadow-widget-orange h-9"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
