import { PhoneCall, TriangleAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { site, formatPhone, telHref } from '@/lib/site';

/**
 * Shown the instant an emergency request lands. Two jobs only: confirm the
 * case id so the caller can quote it, and put the phone number under their
 * thumb. No next steps, no upsell — they are busy.
 *
 * On failure it does not ask them to retry; it tells them to call.
 */
export function EmergencyResultDialog({ open, onOpenChange, result, error }) {
  const failed = Boolean(error);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="emg-desc">
        <div className="animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards flex flex-col pt-4 pb-2 items-center text-center">
          <div className={`size-20 rounded-full flex items-center justify-center mb-6 shadow-sm ${failed ? 'bg-emergency-surface' : 'bg-green-100'}`}>
            {failed ? (
              <TriangleAlert className="size-10 text-emergency animate-in zoom-in spin-in-12 duration-500 delay-150" />
            ) : (
              <PhoneCall className="size-10 text-green-600 animate-in zoom-in spin-in-12 duration-500 delay-150" />
            )}
          </div>
          <DialogHeader className="items-center sm:text-center space-y-4">
            {!failed && (
              <Badge className="bg-emergency font-bold text-white text-sm px-4 py-1">Case {result?.caseId}</Badge>
            )}
            <DialogTitle className="text-2xl">
              {failed ? 'We could not accept that request' : result?.message}
            </DialogTitle>
            <DialogDescription id="emg-desc" className="text-base mt-2">
              {failed
                ? 'Do not wait for us to call. Phone the emergency desk now.'
                : 'Keep this line free — a coordinator is dialling you. Quote your case number if you need to call us first.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Button
          asChild
          className="h-14 w-full cta-gradient-danger text-base font-bold text-white"
        >
          <a href={telHref(site.emergencyPhone)}>
            <PhoneCall aria-hidden="true" />
            Call {formatPhone(site.emergencyPhone)}
          </a>
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          If the patient is unconscious or not breathing normally, call now and start CPR if you are
          trained.
        </p>
      </DialogContent>
    </Dialog>
  );
}
