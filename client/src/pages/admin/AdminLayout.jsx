import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, User, Settings, Palette, LogOut, CheckSquare, ShieldCheck, HelpCircle, Siren, AlertCircle, Search, Bell, BookOpen, UserCheck } from 'lucide-react';
import { Logomark } from '../../components/Logomark';
import { AudioAlert } from '../../components/AudioAlert';
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
} from "../../components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Emergencies', path: '/admin/emergencies', icon: Siren },
  { name: 'Leads', path: '/admin/leads', icon: Users },
  { name: 'Registered Users', path: '/admin/users', icon: UserCheck },
  { name: 'Blog Articles', path: '/admin/blog', icon: BookOpen },
  { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
  { name: 'My Profile', path: '/admin/profile', icon: User },
  { name: 'Compliance', path: '/admin/compliance', icon: ShieldCheck },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
  { name: 'Theme Settings', path: '/admin/theme', icon: Palette },
  { name: 'Consultancy', path: '/admin/consultancy', icon: HelpCircle },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState({ name: 'Loading...', avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D1B2A&color=fff' });
  const [stats, setStats] = useState({ notes: 0, tasks: 0, activeEmergencies: 0, latestEmergencyId: null });
  const [playAudio, setPlayAudio] = useState(false);
  const prevEmergenciesRef = useRef(0);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      
      try {
        const [profRes, statRes] = await Promise.all([
          fetch('/api/admin/profile', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (profRes.ok) {
          const profData = await profRes.json();
          setProfile(profData.data);
        }
        if (statRes.ok) {
          const statData = await statRes.json();
          setStats(statData.data);
          
          // Check if emergencies increased
          if (statData.data.activeEmergencies > prevEmergenciesRef.current) {
            setPlayAudio(true);
            setTimeout(() => setPlayAudio(false), 1000); // reset trigger
          }
          prevEmergenciesRef.current = statData.data.activeEmergencies;
        }
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      }
    }
    
    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-muted/20 font-sans text-foreground">
      <SEO title="AKEEZO Admin Workspace" noindex={true} />
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r bg-card p-6">
        <Link to="/admin/dashboard" className="flex items-center gap-3 px-2 mb-8 group">
          <img src="/images/logo-dark.svg" alt="AKEEZO" className="h-7 w-auto dark:hidden transition-opacity group-hover:opacity-80" />
          <img src="/images/logo-light.svg" alt="AKEEZO" className="h-7 w-auto hidden dark:block transition-opacity group-hover:opacity-80" />
          <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">Admin</span>
        </Link>
        
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Exact match or prefix match for active state
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Area */}
        <div className="mt-auto pt-6 border-t flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-slate-200 overflow-hidden border shadow-sm">
              <img src={profile.avatar} alt={profile.name} className="size-full object-cover" />
            </div>
            <div className="flex flex-col truncate w-32">
              <span className="text-sm font-bold text-ink-strong leading-tight truncate">{profile.name}</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-xs font-medium text-muted-foreground hover:text-emergency text-left transition-colors">
                    Sign out
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out of Akeezo Admin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be securely signed out and returned to the login screen. You must sign back in to access leads and dashboard analytics.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={logout} className="bg-emergency text-white hover:bg-emergency-strong font-bold">
                      Sign out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <AudioAlert trigger={playAudio} />
      <main className="flex-1 flex flex-col relative">
        {/* Active Emergency Banner */}
        {stats.activeEmergencies > 0 && (
          <div className="bg-emergency/10 border-b border-emergency/20 px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-emergency animate-pulse" />
              <p className="text-sm font-bold text-emergency-strong">
                {stats.activeEmergencies} Active Emergency Request{stats.activeEmergencies !== 1 ? 's' : ''}
              </p>
            </div>
            <Link to={`/admin/emergencies`} className="text-xs font-bold bg-emergency text-white px-3 py-1.5 rounded-full hover:bg-emergency-strong transition-colors">
              Go to Control Desk
            </Link>
          </div>
        )}

        {/* Top Header / Breadcrumb */}
        <header className="h-20 flex items-center justify-between px-8 pt-4">
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-muted-foreground flex gap-2">
              <span>Admin</span>
              <span>/</span>
              <span className="text-foreground capitalize">
                {location.pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
            
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-full bg-white dark:bg-card pl-9 border-rule/50 shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-full bg-white dark:bg-card border-rule/50 shadow-sm size-10">
                  <Bell className="size-5" />
                  {stats.activeEmergencies > 0 && (
                    <span className="absolute top-0 right-0 size-2.5 bg-emergency rounded-full ring-2 ring-white dark:ring-card animate-pulse" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {stats.activeEmergencies > 0 ? (
                    <div className="p-4 bg-emergency/10 rounded-xl border border-emergency/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="size-5 text-emergency mt-0.5" />
                        <div>
                          <p className="font-bold text-sm text-emergency-strong">Emergency Alerts</p>
                          <p className="text-xs mt-1 text-emergency-strong/80">
                            You have {stats.activeEmergencies} active emergency cases requiring attention.
                          </p>
                          <Link 
                            to="/admin/emergencies" 
                            className="inline-block mt-3 text-xs font-bold bg-emergency text-white px-3 py-1.5 rounded-md hover:bg-emergency-strong transition-colors"
                          >
                            View Emergencies
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      <Bell className="size-8 mx-auto mb-3 opacity-20" />
                      No new notifications.
                    </div>
                  )}

                  <div className="p-4 bg-muted/30 rounded-xl border border-rule/50">
                    <p className="font-bold text-sm">Notes & Tasks</p>
                    <div className="mt-3 flex gap-2">
                      <span className="text-xs font-medium bg-white border px-2 py-1 rounded-md shadow-sm">Notes: {stats.notes}</span>
                      <span className="text-xs font-medium bg-white border px-2 py-1 rounded-md shadow-sm">Tasks: {stats.tasks}</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full border border-rule/50 shadow-sm text-sm font-medium md:flex">
              Notes <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">{stats.notes}</span>
            </div>
            <div className="hidden items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full border border-rule/50 shadow-sm text-sm font-medium md:flex">
              Tasks <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">{stats.tasks}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8 pt-4">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
