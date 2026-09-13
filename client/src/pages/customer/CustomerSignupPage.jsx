import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  User,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Globe2,
  Stethoscope,
  Building2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function CustomerSignupPage() {
  const navigate = useNavigate();
  const { register } = useCustomerAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [treatment, setTreatment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service & Medical Privacy Policy.');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, phone, country, treatment);
      navigate('/my-journey', { replace: true });
    } catch (err) {
      setError('Registration failed. Please try again.');
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
          {/* Left Column - Design Theme Context */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold border border-border">
              <HeartPulse className="size-3.5 text-primary animate-pulse" />
              AKEEZO Healthcare Network
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-ink-strong leading-tight">
              Create Your Patient Account
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Register your treatment inquiry to receive personalized specialist medical opinions, itemized hospital quotes, and 24/7 care coordination.
            </p>

            <div className="space-y-3.5 pt-2 text-xs sm:text-sm font-medium">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-ink-strong">Accredited Hospitals Network</p>
                  <p className="text-muted-foreground text-xs">Direct access to JCI & NABH certified medical centers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-ink-strong">Specialist Medical Evaluation</p>
                  <p className="text-muted-foreground text-xs">Submit diagnostic scans for expert physician review.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-ink-strong">Complete Travel Concierge</p>
                  <p className="text-muted-foreground text-xs">Medical visa invitation letters, hotel stays & airport transfers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Clean Design Theme Signup Card */}
          <div className="lg:col-span-7 flex justify-center">
            <Card className="w-full max-w-lg bg-card text-card-foreground border-border shadow-widget rounded-2xl p-2 sm:p-4">
              <CardHeader className="space-y-1 text-left pb-4">
                <CardTitle className="text-xl font-bold text-ink-strong">Register Account</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Fill in your details below to register your medical inquiry.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignup} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs font-bold">
                        Full Legal Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-9 text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-xs font-bold">
                        Phone / WhatsApp Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+ Country Code & Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-9 text-xs"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-bold">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="country" className="text-xs font-bold">
                        Country of Residence
                      </Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger id="country" className="text-xs">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kenya">Kenya</SelectItem>
                          <SelectItem value="Nigeria">Nigeria</SelectItem>
                          <SelectItem value="Tanzania">Tanzania</SelectItem>
                          <SelectItem value="Uganda">Uganda</SelectItem>
                          <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                          <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                          <SelectItem value="Iraq">Iraq</SelectItem>
                          <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                          <SelectItem value="Other">Other International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="treatment" className="text-xs font-bold">
                        Treatment Specialty
                      </Label>
                      <Select value={treatment} onValueChange={setTreatment}>
                        <SelectTrigger id="treatment" className="text-xs">
                          <SelectValue placeholder="Select Specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology / Heart Surgery</SelectItem>
                          <SelectItem value="oncology">Oncology / Cancer Care</SelectItem>
                          <SelectItem value="orthopedics">Orthopedics / Joint Replace</SelectItem>
                          <SelectItem value="neurology">Neurology & Neurosurgery</SelectItem>
                          <SelectItem value="transplant">Organ Transplant</SelectItem>
                          <SelectItem value="general">General Checkup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-xs font-bold">
                        Create Password *
                      </Label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 pr-9 text-xs"
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

                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword" className="text-xs font-bold">
                        Confirm Password *
                      </Label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-9 pr-9 text-xs"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 text-muted-foreground hover:text-foreground focus:outline-none p-0.5 rounded-md transition-colors"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-4" aria-hidden="true" />
                          ) : (
                            <Eye className="size-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-[0.72rem] text-muted-foreground leading-normal cursor-pointer">
                      I agree to AKEEZO’s Privacy Policy & Terms of Service for international patient coordination.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full cta-gradient text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-2"
                  >
                    {loading ? 'Registering...' : 'Create Patient Account'}
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Already registered?{' '}
                  <Link to="/login" className="text-primary font-bold hover:underline">
                    Sign in here
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
