import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Activity,
  Star,
  Quote,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, loginWithOtp } = useCustomerAuth();

  const from = location.state?.from?.pathname || '/my-journey';

  // State
  const [activeTab, setActiveTab] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form fields (clean default inputs)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    try {
      setLoading(true);
      await loginWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    if (!phone) {
      setError('Please enter a valid phone number.');
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp) {
      setError('Please enter the verification code.');
      return;
    }
    try {
      setLoading(true);
      await loginWithOtp(phone, otp);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Site Header adhering to site design theme */}
      <SiteHeader />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column - Design Theme Hero & Social Proof */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold border border-border">
              <Activity className="size-3.5 text-primary animate-pulse" />
              Patient Care Portal
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-ink-strong leading-tight">
              Access Your Healthcare Journey & Treatment Plan
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Sign in to view your personalized specialist medical opinions, itemized hospital quotes, medical visa documentation, and dedicated care lead assistance.
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Real-time status updates on doctor opinions & visa processing</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Secure medical report uploader and diagnostic vault</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Direct WhatsApp and phone assistance with international patient leads</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border shadow-card space-y-2">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                "AKEEZO coordinated our complete cardiac care journey in India — from doctor consultations to hospital admission and post-op follow-up."
              </p>
            </div>
          </div>

          {/* Right Column - Clean Design Theme Login Card */}
          <div className="lg:col-span-6 flex justify-center">
            <Card className="w-full max-w-md bg-card text-card-foreground border-border shadow-widget rounded-2xl p-2 sm:p-4">
              <CardHeader className="space-y-1 text-left pb-4">
                <CardTitle className="text-xl font-bold text-ink-strong">Sign In</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Enter your credentials or mobile phone number below.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                    {error}
                  </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 bg-muted text-muted-foreground rounded-lg p-1 mb-4">
                    <TabsTrigger
                      value="email"
                      className="text-xs font-bold py-2 data-[state=active]:bg-card data-[state=active]:text-foreground shadow-sm rounded-md"
                    >
                      Email & Password
                    </TabsTrigger>
                    <TabsTrigger
                      value="otp"
                      className="text-xs font-bold py-2 data-[state=active]:bg-card data-[state=active]:text-foreground shadow-sm rounded-md"
                    >
                      Mobile Verification Code
                    </TabsTrigger>
                  </TabsList>

                  {/* TAB 1: EMAIL */}
                  <TabsContent value="email" className="space-y-4">
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-9 text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-xs font-bold">
                            Password
                          </Label>
                          <a
                            href="#forgot"
                            onClick={(e) => {
                              e.preventDefault();
                              alert('Instructions sent to your email.');
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot Password?
                          </a>
                        </div>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-9 pr-9 text-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 text-muted-foreground hover:text-foreground focus:outline-none p-0.5 rounded-md transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" aria-hidden="true" />
                            ) : (
                              <Eye className="size-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full cta-gradient text-white font-bold py-2.5 rounded-lg text-sm"
                      >
                        {loading ? 'Signing In...' : 'Sign In to Portal'}
                        <ArrowRight className="size-4 ml-2" />
                      </Button>
                    </form>
                  </TabsContent>

                  {/* TAB 2: OTP */}
                  <TabsContent value="otp" className="space-y-4">
                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-xs font-bold">
                            Mobile / WhatsApp Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+91 98765 43210 or +254 700 000 000"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="pl-9 text-sm"
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full cta-gradient text-white font-bold py-2.5 rounded-lg text-sm"
                        >
                          Send Verification Code
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="otp" className="text-xs font-bold">
                              Enter Code Sent to {phone}
                            </Label>
                            <button
                              type="button"
                              onClick={() => setOtpSent(false)}
                              className="text-xs text-primary hover:underline"
                            >
                              Change Number
                            </button>
                          </div>
                          <Input
                            id="otp"
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="text-center font-mono tracking-widest text-lg"
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full cta-gradient text-white font-bold py-2.5 rounded-lg text-sm"
                        >
                          {loading ? 'Verifying...' : 'Verify Code & Enter Portal'}
                        </Button>
                      </form>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Don't have a patient account?{' '}
                  <Link to="/signup" className="text-primary font-bold hover:underline">
                    Create Account
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Site Footer adhering to site theme */}
      <SiteFooter />
    </div>
  );
}
