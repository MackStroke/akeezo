import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { Shield, Clock, HeartPulse, Building2, Phone, ArrowRight, CheckCircle2, UserPlus, MapPin, Loader2, Hospital, Activity, DollarSign, Handshake, Star, Car } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { submitLead } from '../lib/api';

export default function InsuranceAgentPage() {
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
      country: formData.get('city'), // mapping city to country for API
      message: formData.get('message'),
      intent: 'insurance_agent_partner',
      partnerType: 'insurance_agent',
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

  const scrollToForm = () => {
    document.getElementById('partner-form').scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SEO title="Partner as Insurance Agent | Akeezo" description="Turn your insurance policy into a complete care experience. Partner with Akeezo to provide end-to-end IPD assistance." />

      <SiteHeader />

      <main className="flex-1 relative overflow-hidden">
        {/* --- HERO SECTION --- */}
        <section 
          className="relative pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden bg-cover bg-center bg-no-repeat min-h-[calc(100vh-80px)] flex flex-col justify-center"
          style={{ backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 100%), url('/images/happy_hospital_patient_bg.jpg')" }}
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-3xl mix-blend-multiply pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-mint/10 blur-3xl mix-blend-multiply pointer-events-none"></div>
          
          <div className="mx-auto max-w-[76rem] px-4 relative z-10 text-center">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
              For Insurance Agents & Advisors
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-ink-strong leading-[1.1]">
              When Your Customer Gets Hospitalised, <br className="hidden md:block" />
              <span className="text-orange-500">We've Got Them Covered.</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-ink mb-8 max-w-3xl mx-auto">
              Your Policyholder. <span className="text-orange-500">Our Care.</span> Your Relationship.
            </p>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Turn your insurance policy into a complete care experience. Akeezo Health helps you provide end-to-end IPD (In-Patient Department) assistance to your policyholders.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={scrollToForm} className="h-14 px-8 text-lg cta-gradient text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Partner With Us Today
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button onClick={scrollToFeatures} variant="outline" className="h-14 px-8 text-lg border-2 border-primary/20 text-primary font-bold rounded-xl hover:bg-primary/5 transition-all">
                Read More
              </Button>
            </div>
          </div>
        </section>

        {/* --- WHAT AKEEZO PROVIDES --- */}
        <section id="features" className="py-20 bg-white relative">
          <div className="mx-auto max-w-[76rem] px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-ink-strong mb-4">What Akeezo Provides</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We handle the on-ground complexities so you can focus on what matters most—your relationship with the client.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-slate-50 border border-border hover:border-primary/30 transition-colors group">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Hospital className="size-7 text-primary" />
                </div>
                <h3 className="font-bold text-ink-strong text-xl mb-3">IPD Assistance</h3>
                <p className="text-muted-foreground leading-relaxed">Support your policyholder throughout their hospitalisation journey with dedicated assistance from admission to discharge.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-border hover:border-mint/30 transition-colors group">
                <div className="size-14 rounded-2xl bg-mint/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="size-7 text-mint" />
                </div>
                <h3 className="font-bold text-ink-strong text-xl mb-3">Claims Support</h3>
                <p className="text-muted-foreground leading-relaxed">We assist the patient with the IPD claim process and help coordinate required steps and documentation, making it stress-free.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-border hover:border-orange-500/30 transition-colors group">
                <div className="size-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Car className="size-7 text-orange-500" />
                </div>
                <h3 className="font-bold text-ink-strong text-xl mb-3">Hospital Cab Support</h3>
                <p className="text-muted-foreground leading-relaxed">Complimentary cab assistance for the day of hospitalisation, helping your customer reach the hospital comfortably and on time.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-border hover:border-blue-500/30 transition-colors group lg:col-span-1 md:col-span-2">
                <div className="size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="size-7 text-blue-500" />
                </div>
                <h3 className="font-bold text-ink-strong text-xl mb-3">200+ Hospital Network</h3>
                <p className="text-muted-foreground leading-relaxed">Access to a growing network of top-tier hospitals across India, including leading corporate hospital chains.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-border hover:border-rose-500/30 transition-colors group lg:col-span-2 md:col-span-2">
                <div className="size-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <HeartPulse className="size-7 text-rose-500" />
                </div>
                <h3 className="font-bold text-ink-strong text-xl mb-3">Dedicated Patient Support</h3>
                <p className="text-muted-foreground leading-relaxed">Your customer gets a single, dedicated support system to coordinate all their hospitalisation-related needs seamlessly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- WHY PARTNER --- */}
        <section className="py-20 bg-white relative overflow-hidden">
          {/* subtle background pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="mx-auto max-w-[76rem] px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ink-strong">Why Partner With Akeezo?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A partnership designed to create a win-win scenario for both you and the policyholders you serve.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
              {/* For Customers */}
              <div className="bg-slate-50 border border-border shadow-md rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-mint-200 transition-colors">
                <div className="absolute -top-10 -right-10 size-40 bg-mint/5 blur-3xl rounded-full group-hover:bg-mint/10 transition-colors"></div>
                
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-mint/10 text-mint-700 font-bold mb-8 relative z-10">
                  <UserPlus className="size-5" />
                  For Your Customers
                </div>
                
                <ul className="space-y-5 relative z-10">
                  {['Easier hospitalisation experience', 'Continuous assistance during the IPD journey', 'End-to-end claims support', 'Seamless hospital coordination', 'Comfortable cab support on admission day', 'Access to our vast hospital network'].map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="size-6 rounded-full bg-mint/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="size-4 text-mint-600" />
                      </div>
                      <span className="text-ink leading-tight font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Agents */}
              <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 shadow-md rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-orange-300 transition-colors">
                <div className="absolute -top-10 -right-10 size-40 bg-orange-400/10 blur-3xl rounded-full group-hover:bg-orange-400/20 transition-colors"></div>
                
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold mb-8 relative z-10">
                  <Handshake className="size-5" />
                  For You, The Insurance Agent
                </div>
                
                <ul className="space-y-5 relative z-10">
                  {['Deliver a significantly better customer experience', 'Build stronger relationships & encourage renewals', 'Increase word-of-mouth & customer referrals', 'Earn additional commission through Akeezo', 'Add immense value beyond just selling a policy'].map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="size-6 flex items-center justify-center shrink-0 mt-0.5">
                        <Star className="size-5 text-orange-500 fill-orange-500" />
                      </div>
                      <span className="text-ink font-medium leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- LEAD CAPTURE FORM --- */}
        <section id="partner-form" className="py-20 bg-slate-50 relative border-t border-border">
          <div className="mx-auto max-w-[76rem] px-4 relative z-10">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              
              {/* Left Side - Form */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden">
                  <div className="p-6 border-b border-border bg-slate-50/50">
                    <h2 className="text-2xl font-bold text-ink-strong mb-1">Partnership Request</h2>
                    <p className="text-muted-foreground text-sm">Fill out the details below and our team will connect with you.</p>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    {status === 'success' ? (
                      <div className="text-center py-8">
                        <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="size-8 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-950 mb-2">Request Sent!</h3>
                        <p className="text-emerald-800 text-sm mb-6 max-w-sm mx-auto">
                          Thank you for your interest. Our partnership team will reach out to you shortly.
                        </p>
                        <Button onClick={() => setStatus('idle')} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-10 px-6 rounded-lg">
                          Submit Another Request
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        {error && (
                          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-3">
                            <Shield className="size-5 shrink-0" />
                            {error}
                          </div>
                        )}

                        <div className="space-y-5">
                          <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <Label htmlFor="name" className="text-sm font-bold text-ink-strong">Full Name</Label>
                              <Input id="name" name="name" required placeholder="e.g., Rahul Sharma" className="h-11 bg-slate-50" />
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="phone" className="text-sm font-bold text-ink-strong">Phone Number</Label>
                              <Input id="phone" name="phone" required placeholder="+91 9999999999" className="h-11 bg-slate-50" />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <Label htmlFor="email" className="text-sm font-bold text-ink-strong">Email (Optional)</Label>
                              <Input id="email" name="email" type="email" placeholder="official@email.com" className="h-11 bg-slate-50" />
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="city" className="text-sm font-bold text-ink-strong">City / Location</Label>
                              <Input id="city" name="city" required placeholder="e.g., Mumbai" className="h-11 bg-slate-50" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="message" className="text-sm font-bold text-ink-strong">Tell us about your business</Label>
                            <Textarea id="message" name="message" placeholder="How many clients do you currently handle? Any specific hospital networks you prefer?" className="min-h-[100px] bg-slate-50 resize-y" />
                          </div>

                          <Button disabled={status === 'submitting'} type="submit" className="w-full h-12 cta-gradient text-white text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all mt-2">
                            {status === 'submitting' ? (
                              <><Loader2 className="animate-spin mr-3 size-5" /> Processing...</>
                            ) : (
                              'Become a Partner Today'
                            )}
                          </Button>
                          <p className="text-[11px] text-center text-muted-foreground mt-3">
                            By submitting this form, you agree to our Terms of Service and Privacy Policy.
                          </p>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Content & Image */}
              <div className="lg:col-span-6 order-1 lg:order-2">
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-orange-100 text-orange-700 font-bold text-xs tracking-wider uppercase">
                  Agent Partnership
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-ink-strong leading-tight">
                  Refer Your Policyholders to Akeezo.
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-lg">
                  When hospitalisation happens, be the agent who provides a complete care experience. Join forces with Akeezo to elevate your service and earn more.
                </p>
                
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg border border-border">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200" 
                    alt="Insurance Agent Partnership" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 inline-flex items-center gap-3 shadow-lg">
                      <div className="size-10 rounded-full bg-mint flex items-center justify-center shrink-0">
                        <CheckCircle2 className="size-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-ink-strong text-sm leading-tight">Fast Onboarding</p>
                        <p className="text-xs text-muted-foreground">Start referring within 48 hours.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
