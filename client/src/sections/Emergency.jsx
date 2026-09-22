import {
  Activity,
  Ambulance,
  HeartPulse,
  ShieldCheck,
  Siren,
  UserCheck,
} from 'lucide-react';
import { EmergencyForm } from '@/components/EmergencyForm';
import { site, telHref } from '@/lib/site';


export function Emergency() {
  return (
    <section
      id="emergency"
      aria-labelledby="emergency-heading"
      className="relative overflow-hidden bg-gradient-to-br from-primary via-[#ff8c33] to-[#cc5500] text-white py-16 sm:py-20 select-none"
    >
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-1deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.05); }
        }
      `}</style>

      {/* Background Graphic 1: Geometric Technical Grid Matrix */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"
      />

      {/* Background Graphic 2: Dual Ambient Radial Glow Halos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 82% 20%, color-mix(in oklab, var(--emergency) 28%, transparent), transparent 50%), radial-gradient(circle at 15% 82%, rgba(0, 191, 165, 0.16), transparent 48%)',
        }}
      />

      {/* Background Graphic 3: Soft Floating Ambient Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 right-1/4 size-72 rounded-full bg-emergency/15 blur-[110px]"
        style={{ animation: 'pulseGlow 6s ease-in-out infinite' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 left-12 size-80 rounded-full bg-primary/15 blur-[130px]"
        style={{ animation: 'pulseGlow 7s ease-in-out infinite 2s' }}
      />

      <div className="relative mx-auto grid max-w-[76rem] items-start gap-10 px-4 lg:grid-cols-2">
        {/* Floating Decorative Badge 1 - Top Right Floating Element */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 right-16 hidden lg:flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md shadow-2xl z-20 text-xs font-bold text-white/90"
          style={{ animation: 'floatSlow 5s ease-in-out infinite' }}
        >
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          <Ambulance className="size-4 text-emergency" />
          <span>Priority Emergency Network</span>
        </div>

        {/* Floating Decorative Badge 2 - Bottom Left Floating Element */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-6 -left-4 hidden lg:flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-md shadow-2xl z-20 text-xs font-bold text-white/90"
          style={{ animation: 'floatReverse 6s ease-in-out infinite 1s' }}
        >
          <ShieldCheck className="size-4 text-primary" />
          <span>100% Encrypted & Confidential Triage</span>
        </div>

        {/* Left Column: scoped headings so child cards stay readable */}
        <div className="[&_h2]:text-white [&_h3]:text-white flex flex-col justify-center gap-10 lg:sticky lg:top-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emergency/40 bg-emergency/15 px-3 py-1 text-xs font-bold text-white">
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emergency opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emergency" />
              </span>
              <span className="tracking-wide uppercase">24/7 Control Desk Active</span>
            </div>

            <h2 id="emergency-heading" className="text-3xl sm:text-[2.5rem] font-black tracking-tight leading-tight">
              Akeezo reaches in no time.
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium max-w-lg">
              Someone needs urgent medical help at home, in a hotel, at an airport, while travelling etc. Share the concern and coordinates.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:border-white/20">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-emergency group-hover:scale-110 transition-all duration-500">
                <HeartPulse className="size-5" />
              </div>
              <p className="text-sm font-semibold text-white/90 leading-snug">
                Emergency response require first aid from medical experts
              </p>
            </div>
            
            <div className="group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:border-white/20">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-emergency group-hover:scale-110 transition-all duration-500">
                <UserCheck className="size-5" />
              </div>
              <p className="text-sm font-semibold text-white/90 leading-snug">
                General attendant/nurses on hourly/weekly/monthly basis from renowned hospital
              </p>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:border-white/20">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-emergency group-hover:scale-110 transition-all duration-500">
                <Activity className="size-5" />
              </div>
              <p className="text-sm font-semibold text-white/90 leading-snug">
                Family kept informed on each and every parameter
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a href={telHref(site.emergencyPhone)} className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-emergency px-8 font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
              <span className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
              <Siren className="size-5 relative z-10 animate-pulse" />
              <span className="relative z-10 text-sm uppercase tracking-widest">Get Emergency Help</span>
            </a>
          </div>
        </div>

        <EmergencyForm />
      </div>
    </section>
  );
}
