import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, User, Settings, Palette, LogOut, CheckSquare, ShieldCheck, HelpCircle } from 'lucide-react';
import { Logomark } from '../../components/Logomark';
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

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Leads', path: '/admin/leads', icon: Users },
  { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
  { name: 'Compliance', path: '/admin/compliance', icon: ShieldCheck },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
  { name: 'Theme Settings', path: '/admin/theme', icon: Palette },
  { name: 'Consultancy', path: '/admin/consultancy', icon: HelpCircle },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-muted/20 font-sans text-foreground">
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
              <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="size-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-ink-strong leading-tight">Mark Bennet</span>
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
      <main className="flex-1 flex flex-col">
        {/* Top Header / Breadcrumb */}
        <header className="h-20 flex items-center justify-between px-8 pt-4">
          <div className="text-sm font-medium text-muted-foreground flex gap-2">
            <span>Admin</span>
            <span>/</span>
            <span className="text-foreground capitalize">
              {location.pathname.split('/').pop() || 'Dashboard'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full border border-rule/50 shadow-sm text-sm font-medium">
              Notes <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">7</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full border border-rule/50 shadow-sm text-sm font-medium">
              Tasks <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">5</span>
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
