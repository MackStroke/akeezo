import { Pill, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function MedicinesResultDialog({ open, onOpenChange, result, error }) {
  const failed = Boolean(error);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="med-desc">
        <div className="animate-in fade-in zoom-in-95 duration-500 fill-mode-forwards flex flex-col pt-4 pb-2 items-center text-center">
          <div className={`size-20 rounded-full flex items-center justify-center mb-6 shadow-sm ${failed ? 'bg-emergency-surface' : 'bg-green-100'}`}>
            {failed ? (
              <Pill className="size-10 text-emergency animate-in zoom-in spin-in-12 duration-500 delay-150" />
            ) : (
              <CheckCircle className="size-10 text-green-600 animate-in zoom-in spin-in-12 duration-500 delay-150" />
            )}
          </div>
          <DialogHeader className="items-center sm:text-center space-y-4">
            <DialogTitle className="text-2xl">
              {failed ? 'Order could not be placed' : 'Order Received!'}
            </DialogTitle>
            <DialogDescription id="med-desc" className="text-base mt-2">
              {failed
                ? 'Please try again or contact support if the problem persists.'
                : 'Our executive will reach out to you for more details and guidance.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Button
          onClick={() => onOpenChange(false)}
          className="h-14 w-full bg-primary hover:bg-primary/90 text-base font-bold text-white rounded-full mt-4"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
