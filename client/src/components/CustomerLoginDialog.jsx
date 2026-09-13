import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { HeartPulse, ShieldCheck, PhoneCall, Eye, EyeOff } from 'lucide-react';

export function CustomerLoginDialog({ open, onOpenChange, onSuccess, initialMode = 'login' }) {
  const navigate = useNavigate();
  const { loginWithEmail, register } = useCustomerAuth();

  const [isRegister, setIsRegister] = useState(initialMode === 'signup');
  const [showPassword, setShowPassword] = useState(false);

  // Sync mode when initialMode or open changes
  useEffect(() => {
    setIsRegister(initialMode === 'signup');
  }, [initialMode, open]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      if (isRegister) {
        if (!name || !email || !password) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        await register(name, email, phone);
      } else {
        if (!email || !password) {
          setError('Please enter both email and password.');
          setLoading(false);
          return;
        }
        await loginWithEmail(email, password);
      }
      onOpenChange(false);
      if (onSuccess) onSuccess();
      else navigate('/my-journey');
    } catch (err) {
      setError(isRegister ? 'Registration failed.' : 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-4xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">
          {isRegister ? 'Create Account' : 'Customer Login'}
        </DialogTitle>
        
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0 border-border bg-card text-card-foreground shadow-2xl rounded-2xl">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold border border-border">
                      <HeartPulse className="size-3.5 text-primary" />
                      AKEEZO Healthcare Portal
                    </div>
                    <h1 className="text-2xl font-bold text-ink-strong">
                      {isRegister ? 'Create Patient Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-xs text-balance text-muted-foreground">
                      {isRegister
                        ? 'Register your inquiry to receive specialist quotes'
                        : 'Sign in to access your healthcare treatment plan'}
                    </p>
                  </div>

                  {error && (
                    <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
                      {error}
                    </div>
                  )}

                  {isRegister && (
                    <Field>
                      <FieldLabel htmlFor="dlg-name">Full Name</FieldLabel>
                      <Input
                        id="dlg-name"
                        type="text"
                        placeholder="Your Legal Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-xs"
                        required
                      />
                    </Field>
                  )}

                  <Field>
                    <FieldLabel htmlFor="dlg-email">Email Address</FieldLabel>
                    <Input
                      id="dlg-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </Field>

                  {isRegister && (
                    <Field>
                      <FieldLabel htmlFor="dlg-phone">Phone / WhatsApp Number</FieldLabel>
                      <Input
                        id="dlg-phone"
                        type="tel"
                        placeholder="+ Country Code & Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="text-xs"
                      />
                    </Field>
                  )}

                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="dlg-password">Password</FieldLabel>
                      {!isRegister && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="ml-auto text-xs text-primary underline-offset-2 hover:underline font-bold bg-transparent border-0 p-0 cursor-pointer"
                            >
                              Forgot password?
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Password Reset Sent</AlertDialogTitle>
                              <AlertDialogDescription>
                                We have sent password reset instructions to your registered email address.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogAction className="cta-gradient text-white font-bold">
                                Okay, Got It
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <Input
                        id="dlg-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-xs pr-9"
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
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full cta-gradient text-white font-bold py-2.5 text-xs rounded-lg"
                    >
                      {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In to Portal'}
                    </Button>
                  </Field>

                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>

                  <Field className="grid grid-cols-3 gap-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          type="button"
                          className="text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                              fill="currentColor"
                            />
                          </svg>
                          <span className="sr-only">Apple</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Apple Sign-In</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apple single sign-on is connecting to AKEEZO healthcare portal.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction className="cta-gradient text-white font-bold">Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          type="button"
                          className="text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                              fill="currentColor"
                            />
                          </svg>
                          <span className="sr-only">Google</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Google Sign-In</AlertDialogTitle>
                          <AlertDialogDescription>
                            Google OAuth single sign-on is connecting to AKEEZO healthcare portal.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction className="cta-gradient text-white font-bold">Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          type="button"
                          className="text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <PhoneCall className="size-3.5 text-emerald-600" />
                          <span className="sr-only">WhatsApp</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>WhatsApp Direct Sign-In</AlertDialogTitle>
                          <AlertDialogDescription>
                            Connecting via AKEEZO Official WhatsApp Care Desk.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                            Connect WhatsApp
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </Field>

                  <FieldDescription className="text-center text-xs">
                    {isRegister ? (
                      <>
                        Already registered?{' '}
                        <button
                          type="button"
                          onClick={() => setIsRegister(false)}
                          className="text-primary font-bold hover:underline"
                        >
                          Sign In
                        </button>
                      </>
                    ) : (
                      <>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setIsRegister(true)}
                          className="text-primary font-bold hover:underline"
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </FieldDescription>
                </FieldGroup>
              </form>

              {/* Right Column - Hero Visual Panel */}
              <div className="relative hidden bg-navy md:flex flex-col justify-between p-8 text-white overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80"
                  alt="AKEEZO Healthcare"
                  className="absolute inset-0 h-full w-full object-cover opacity-25"
                />
                <div className="relative z-10 space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-sky-300 border border-white/20">
                    <ShieldCheck className="size-3.5" /> HIPAA Encrypted
                  </span>
                  <h3 className="text-xl font-extrabold leading-tight text-white pt-2">
                    End-to-End International Medical Travel Coordination
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    100+ JCI-accredited hospitals, specialist doctor opinions in 24 hrs, medical visa letters, and 24/7 care desk support.
                  </p>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/15 text-[0.72rem] text-white/70">
                  By clicking continue, you agree to AKEEZO's{' '}
                  <a href="#terms" className="underline text-sky-300">Terms of Service</a> and{' '}
                  <a href="#privacy" className="underline text-sky-300">Privacy Policy</a>.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
