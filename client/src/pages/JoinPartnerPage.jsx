import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { Building2, Stethoscope, Loader2, CheckCircle2, Globe2, ShieldCheck, Users, HeartPulse, Activity, Handshake, UserPlus } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { submitLead } from '../lib/api';

export default function JoinPartnerPage() {
  const [partnerType, setPartnerType] = useState('hospital');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      country: formData.get('country'),
      treatment: formData.get('specialty'), // Storing specialty in treatment
      message: formData.get('message'),
      intent: 'partner_enrollment',
      partnerType: partnerType,
      consent: true,
    };

    try {
      await submitLead(data);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry. Please try again later.');
      setStatus('idle');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SEO title="Join as a Partner | Akeezo" description="List your hospital or join as a doctor on the Akeezo healthcare network." />

      <SiteHeader />

      <main className="flex-1 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-3xl mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-mint/10 blur-3xl mix-blend-multiply pointer-events-none"></div>

        <div className="mx-auto max-w-[76rem] px-4 py-8 md:py-12 relative z-10 flex flex-col justify-center min-h-[calc(100vh-140px)]">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Column - Hero Text */}
            <div className="lg:col-span-5 lg:pr-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-ink-strong">
                Partner With Akeezo
              </h1>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                Join our global healthcare network. List your accredited hospital or join our panel of expert doctors to reach international patients.
              </p>
              
              <div className="space-y-6 hidden lg:block">
                <div className="flex gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe2 className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-strong text-sm">Global Patient Reach</h3>
                    <p className="text-xs text-muted-foreground mt-1">Connect with patients from over 50+ countries seeking specialized medical care.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="size-10 rounded-full bg-mint/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-5 text-mint" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-strong text-sm">Trusted Network</h3>
                    <p className="text-xs text-muted-foreground mt-1">Join a curated network of JCI and NABH accredited healthcare providers.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="size-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Users className="size-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-strong text-sm">Dedicated Support</h3>
                    <p className="text-xs text-muted-foreground mt-1">Get an assigned account manager to streamline patient handoffs and communications.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-7">
              {status === 'success' ? (
                <div className="bg-card border border-emerald-200 rounded-2xl p-8 text-center shadow-widget">
                  <CheckCircle2 className="size-16 text-emerald-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-emerald-950 mb-2">Enquiry Submitted Successfully!</h2>
                  <p className="text-emerald-800 text-sm">
                    Thank you for your interest in joining the Akeezo network. Our partnership team will review your details and contact you within 24-48 hours.
                  </p>
                  <Button onClick={() => setStatus('idle')} variant="outline" className="mt-6 border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card border border-border shadow-widget rounded-2xl p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-ink-strong mb-1">Partnership Enquiry Form</h2>
                    <p className="text-muted-foreground text-xs">Fill out the details below and our team will get in touch.</p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-bold text-ink-strong mb-2 block">I want to...</Label>
                      <Select value={partnerType} onValueChange={setPartnerType}>
                        <SelectTrigger className="w-full h-11 bg-white border-border text-sm font-medium">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Join as Doctor</SelectItem>
                          <SelectItem value="hospital">List a Hospital</SelectItem>
                          <SelectItem value="attendant">Join as Attendant</SelectItem>
                          <SelectItem value="nurse">Join as Nurse</SelectItem>
                          <SelectItem value="physiotherapist">Join as Physiotherapist</SelectItem>
                          <SelectItem value="other">Other partnerships</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs font-bold text-ink-strong">{partnerType === 'hospital' ? 'Hospital / Clinic Name' : partnerType === 'other' ? 'Organization / Your Name' : 'Full Name & Title'}</Label>
                      <Input id="name" name="name" required placeholder={partnerType === 'hospital' ? 'e.g., Apollo Hospitals' : partnerType === 'doctor' ? 'e.g., Dr. Ananya Sharma' : partnerType === 'other' ? 'e.g., ABC Corp' : 'e.g., Ananya Sharma'} className="h-10 text-sm" />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs font-bold text-ink-strong">Email Address</Label>
                      <Input id="email" name="email" type="email" required placeholder="official@email.com" className="h-10 text-sm" />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs font-bold text-ink-strong">Phone Number</Label>
                      <Input id="phone" name="phone" required placeholder="+91 9999999999" className="h-10 text-sm" />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="country" className="text-xs font-bold text-ink-strong">Country / City</Label>
                      <Input id="country" name="country" required placeholder="e.g., New Delhi, India" className="h-10 text-sm" />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="specialty" className="text-xs font-bold text-ink-strong">{partnerType === 'hospital' ? 'Primary Specialties' : partnerType === 'other' ? 'Type of Partnership' : 'Specialization / Skills'}</Label>
                      <Input id="specialty" name="specialty" placeholder={partnerType === 'hospital' ? 'e.g., Cardiology, Oncology...' : partnerType === 'other' ? 'e.g., Technology Partner' : 'e.g., ICU, Pediatric...'} className="h-10 text-sm" />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="message" className="text-xs font-bold text-ink-strong">Additional Information (Optional)</Label>
                      <Textarea id="message" name="message" placeholder="Provide any accreditations (JCI, NABH) or specific queries..." className="min-h-[60px] text-sm resize-none" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button disabled={status === 'submitting'} type="submit" className="w-full h-12 cta-gradient text-white text-sm font-bold shadow-md hover:shadow-lg transition-all">
                      {status === 'submitting' ? <><Loader2 className="animate-spin mr-2 size-4" /> Submitting...</> : 'Submit Application'}
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center mt-3">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
