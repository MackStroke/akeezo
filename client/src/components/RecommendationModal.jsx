import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Globe2, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitRecommendation } from '@/lib/api';

export function RecommendationModal({ open, onOpenChange, initialType = 'city' }) {
  const [type, setType] = useState(initialType);
  const [targetName, setTargetName] = useState('');
  const [region, setRegion] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (open) {
      setType(initialType);
      setError('');
      setSuccessData(null);
    }
  }, [open, initialType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!targetName.trim()) {
      setError(`Please enter the ${type === 'city' ? 'city' : 'country'} name.`);
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter a contact phone number.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const data = await submitRecommendation({
        type,
        targetName: targetName.trim(),
        region: region.trim() || undefined,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        reason: reason.trim() || undefined,
      });

      setSuccessData(data);
    } catch (err) {
      if (err.fields) {
        const firstFieldMsg = Object.values(err.fields)[0];
        setError(firstFieldMsg || err.message || 'Validation failed. Please check your inputs.');
      } else {
        setError(err.message || 'An error occurred while submitting your recommendation.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTargetName('');
    setRegion('');
    setName('');
    setPhone('');
    setEmail('');
    setReason('');
    setSuccessData(null);
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg font-sans">
        <DialogHeader>
          <div className="flex items-center gap-2 text-mint font-bold text-xs uppercase tracking-wider">
            <Sparkles className="size-4 animate-pulse" /> Smart Hub Expansion
          </div>
          <DialogTitle className="text-xl font-black text-ink-strong">
            {type === 'city' ? 'Recommend a Medical Hub City' : 'Recommend a Healthcare Destination Country'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Tell us where Akeezo should launch next. We use your inputs to prioritize our hospital partner network.
          </DialogDescription>
        </DialogHeader>

        {successData ? (
          <div className="py-6 text-center space-y-4">
            <div className="size-14 rounded-full bg-mint/15 text-mint flex items-center justify-center mx-auto border border-mint/30">
              <CheckCircle2 className="size-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink-strong">Recommendation Submitted!</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {successData.message}
              </p>
              <div className="mt-3 inline-block bg-muted px-3 py-1 rounded-md text-xs font-mono font-bold text-primary border">
                ID: {successData.recommendationId}
              </div>
            </div>
            <Button onClick={handleReset} className="w-full font-bold bg-mint text-white hover:bg-mint/90 mt-2">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Type selector toggle */}
            <div className="grid grid-cols-2 gap-2 bg-muted/60 p-1 rounded-lg border border-rule/50">
              <button
                type="button"
                onClick={() => setType('city')}
                className={cn(
                  'flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-bold transition-all',
                  type === 'city'
                    ? 'bg-card text-mint shadow-xs border border-mint/30'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Building2 className="size-4" /> Recommend City
              </button>
              <button
                type="button"
                onClick={() => setType('country')}
                className={cn(
                  'flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-bold transition-all',
                  type === 'country'
                    ? 'bg-card text-mint shadow-xs border border-mint/30'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Globe2 className="size-4" /> Recommend Country
              </button>
            </div>

            {error && (
              <div className="p-3 bg-emergency/10 border border-emergency/30 rounded-md text-xs text-emergency-strong flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-ink-strong block mb-1">
                  {type === 'city' ? 'City Name' : 'Country Name'} <span className="text-emergency">*</span>
                </label>
                <Input
                  placeholder={type === 'city' ? 'e.g. Ahmedabad, Chandigarh, Pune...' : 'e.g. UAE, Kenya, Bangladesh, Thailand...'}
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink-strong block mb-1">
                  State / Region / Province <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <Input
                  placeholder="e.g. Gujarat / Cardiology & Transplants"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-ink-strong block mb-1">
                    Your Name <span className="text-emergency">*</span>
                  </label>
                  <Input
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-ink-strong block mb-1">
                    Phone Number <span className="text-emergency">*</span>
                  </label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink-strong block mb-1">
                  Email Address <span className="text-emergency">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink-strong block mb-1">
                  Why do you recommend this location? <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <Textarea
                  placeholder="Share details about doctors, hospitals, treatment demand or travel needs..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-sm font-medium min-h-[80px]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-mint text-white hover:bg-mint/90 font-bold">
                {loading && <Loader2 className="size-4 animate-spin mr-2" />}
                Submit Recommendation
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
