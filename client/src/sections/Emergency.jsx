import {
  Activity,
  Ambulance,
  Clock,
  HeartPulse,
  Phone,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Siren,
  UserCheck,
} from 'lucide-react';
import { EmergencyForm } from '@/components/EmergencyForm';
import { site, formatPhone, telHref } from '@/lib/site';

const FLOW = [
  { step: '1', title: 'Locate', desc: 'Identify patient location' },
  { step: '2', title: 'Understand', desc: '4-question rapid triage' },
  { step: '3', title: 'Connect', desc: 'Instant desk callback' },
  { step: '4', title: 'Respond', desc: 'Despatch ambulance/team' },
  { step: '5', title: 'Transport', desc: 'En-route monitoring' },
  { step: '6', title: 'Hospital', desc: 'ER bed pre-arranged' },
];

const EMERGENCY_FEATURES = [
  {
    icon: Siren,
    title: 'Rapid Ambulance Dispatch',
    desc: 'Priority network with live GPS coordination and paramedic support.',
  },
  {
    icon: Clock,
    title: '60-Second Callback',
    desc: 'Dedicated emergency team calls back within one minute.',
  },
  {
    icon: HeartPulse,
    title: 'Hospital ER Bed Booking',
    desc: 'Direct hospital desk alert to prepare trauma care on arrival.',
  },
  {
    icon: Activity,
    title: 'Real-Time Family Tracking',
    desc: 'Transparent progress updates sent to family members.',
  },
];

const REQUESTERS = [
  { t: 'Families in urgent crisis', d: 'Looking for fast hospital admission and ambulance dispatch.' },
  { t: 'International tourists & patients', d: 'In a foreign city needing trusted emergency coordination.' },
  { t: 'Travellers, students and expats', d: 'In India and unsure which hospital to go to, or who to call.' },
  { t: 'Corporates and embassies', d: 'An employee or national needs coordinated assistance.' },
];

export function Emergency() {
  return (
    <section
      id="emergency"
      aria-labelledby="emergency-heading"
      className="relative overflow-hidden bg-[#121212] text-white py-16 sm:py-20 select-none"
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
        <div className="[&_h2]:text-white [&_h3]:text-white flex flex-col gap-6">
          <div>
            {/* Live Emergency Desk Indicator Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emergency/40 bg-emergency/15 px-3 py-1 text-xs font-bold text-white mb-3">
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emergency opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emergency" />
              </span>
              <span className="tracking-wide uppercase">24/7 Control Desk Active</span>
              <span className="text-white/60">·</span>
              <span className="font-normal text-white/90">Instant Support Under a Minute</span>
            </div>

            <h2 id="emergency-heading" className="text-2xl sm:text-[2rem] font-black tracking-tight leading-tight">
              Act Now, Health Matters More Than Anything
            </h2>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              An emergency is not the time for a long form. We ask where the patient is, what
              happened, what help you think is needed and a number to reach you on. Everything else we
              work out on the phone.
            </p>
          </div>

          {/* Emergency Flow Stepper Grid */}
          <div>
            <p className="text-[0.7rem] font-extrabold tracking-wider text-white/60 uppercase mb-2">
              Emergency Response Pipeline
            </p>
            <ol className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FLOW.map(({ step, title, desc }) => (
                <li
                  key={title}
                  className="flex flex-col gap-0.5 rounded-lg border border-white/15 bg-white/5 p-2.5 text-xs text-white transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emergency text-[0.6rem] font-black text-white">
                      {step}
                    </span>
                    <span className="text-white font-extrabold">{title}</span>
                  </div>
                  <span className="text-[0.68rem] text-white/60 leading-tight">{desc}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Emergency Features 2x2 Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {EMERGENCY_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-2.5 rounded-lg border border-white/15 bg-white/5 p-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emergency/20 text-white">
                  <Icon className="size-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{title}</h4>
                  <p className="mt-0.5 text-[0.7rem] text-white/70 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Requesters Block */}
          <div className="rounded-[var(--radius)] border border-white/15 bg-white/5 p-4.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="size-4 text-emergency" />
              Who Raises Emergency Cases With AKEEZO
            </h3>
            <dl className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
              {REQUESTERS.map((r) => (
                <div key={r.t} className="rounded border border-white/10 bg-white/5 p-2">
                  <dt className="text-xs font-bold text-white">{r.t}</dt>
                  <dd className="text-[0.7rem] text-white/70 mt-0.5 leading-snug">{r.d}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Direct Phone Call Affordance Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] bg-emergency p-4 text-white shadow-widget">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                <PhoneCall className="size-5 animate-pulse" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/90">Faster on the phone</p>
                <a
                  href={telHref(site.emergencyPhone)}
                  className="text-lg font-black text-white hover:underline decoration-2"
                >
                  {formatPhone(site.emergencyPhone)}
                </a>
              </div>
            </div>
            <a
              href={telHref(site.emergencyPhone)}
              className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-emergency hover:bg-white/90 transition-colors shrink-0"
            >
              Call Desk Now
            </a>
          </div>
        </div>

        <EmergencyForm />
      </div>
    </section>
  );
}
