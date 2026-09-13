import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { ShieldCheck, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <SEO title="Admin Login" noindex={true} />
      
      {/* Left Panel: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-navy relative flex-col justify-between p-12 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 size-96 rounded-full bg-primary/20 blur-3xl mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 size-96 rounded-full bg-primary/20 blur-3xl mix-blend-screen pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" title="Return to AKEEZO Home" className="inline-block hover:opacity-90 transition-opacity cursor-pointer">
            <img src="/images/logo-light.svg" alt="AKEEZO" className="h-10 w-auto" />
          </Link>
        </div>
        
        <div className="relative z-10 max-w-md">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-6 uppercase tracking-widest text-[10px] font-bold px-3 py-1 border-none shadow-none">
            Platform Access
          </Badge>
          <h1 className="text-4xl font-black text-white leading-tight mb-6">
            Secure coordination & patient management.
          </h1>
          <p className="text-white/70 text-lg">
            Access the Akeezo operations center to review inbound inquiries, manage active journeys, and deploy emergency responses.
          </p>
        </div>
        
        <div className="relative z-10 text-white/50 text-sm font-medium">
          &copy; {new Date().getFullYear()} AKEEZO. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden">
          <Link to="/" title="Return to AKEEZO Home" className="inline-block hover:opacity-90 transition-opacity cursor-pointer">
            <img src="/images/logo-dark.svg" alt="AKEEZO" className="h-8 w-auto dark:hidden" />
            <img src="/images/logo-light.svg" alt="AKEEZO" className="h-8 w-auto hidden dark:block" />
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-10">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <ShieldCheck className="size-6 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-ink-strong tracking-tight mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your admin account to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-emergency-surface border border-emergency/20 text-sm font-bold text-emergency">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</Label>
              <Input 
                id="username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 bg-slate-50 border-rule/50"
                placeholder="admin"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
              </div>
              <div className="relative flex items-center">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-slate-50 border-rule/50 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none p-1 rounded-md transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" aria-hidden="true" />
                  ) : (
                    <Eye className="size-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 cta-gradient text-white font-bold text-base mt-4 gap-2" disabled={loading}>
              {loading ? <Loader2 className="size-5 animate-spin" /> : (
                <>Sign in to Admin <ArrowRight className="size-4" /></>
              )}
            </Button>
          </form>
        </div>
      </div>

    </div>
  );
}
