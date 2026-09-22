import { useLocation } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';
import { Logomark } from './Logomark';
import { useConfig } from '../context/ConfigContext';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export default function MaintenanceGuard({ children }) {
  const { config, isLoading } = useConfig();
  const maintenancePages = config.maintenancePages || [];
  const location = useLocation();

  // Admin routes are never blocked by maintenance
  if (location.pathname.startsWith('/admin')) {
    return children;
  }

  // Exact match or prefix match (except root)
  const isMaintenance = maintenancePages.some(page => 
    page === location.pathname || (page !== '/' && location.pathname.startsWith(page))
  );

  if (isMaintenance && !isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        
        <style>{`
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
          
          <div className="w-full relative group">
            {/* Ambient glow behind card */}
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-primary/20 to-sky-500/20 blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000" />
            
            <div className="relative bg-white/90 backdrop-blur-2xl border border-slate-200/60 p-10 sm:p-14 rounded-[2rem] shadow-xl flex flex-col items-center text-center overflow-hidden">
              
              {/* Animated Icon Container */}
              <div 
                className="relative flex size-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.05)] mb-8"
                style={{ animation: 'floatSlow 6s ease-in-out infinite' }}
              >
                <Settings className="size-10 text-primary opacity-90" style={{ animation: 'spinSlow 12s linear infinite' }} />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5 pointer-events-none" />
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary mb-6">
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                <span className="uppercase tracking-widest">System Upgrading</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
                We're refining the experience.
              </h1>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-sm mx-auto mb-10 font-medium">
                This sector of the platform is currently undergoing an elite technical upgrade. We appreciate your patience while we elevate our standards.
              </p>
              
              <a 
                href="/" 
                className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-slate-900 px-8 font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 shadow-lg w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <ArrowLeft className="size-5 relative z-10 transition-colors duration-500 group-hover:text-white" />
                <span className="relative z-10 text-sm uppercase tracking-widest transition-colors duration-500 group-hover:text-white">
                  Return to Hub
                </span>
              </a>
            </div>
          </div>
        </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return children;
}
