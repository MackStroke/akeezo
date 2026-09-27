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
      className="relative py-12 sm:py-16 bg-background border-t border-rule/50 select-none"
    >
      <div className="relative mx-auto grid max-w-[76rem] items-center gap-6 lg:gap-10 px-4 lg:grid-cols-2">
        {/* Left Column: Context, details & fast call option */}
        <div className="flex flex-col justify-center gap-5 sm:gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emergency/30 bg-emergency/10 px-3 py-1 text-xs font-bold text-emergency">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emergency opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emergency" />
              </span>
              <span className="tracking-wide uppercase">24/7 Control Desk Active</span>
            </div>

            <h2 id="emergency-heading" className="text-2xl sm:text-3xl lg:text-[2rem] font-black tracking-tight text-ink-strong leading-tight">
              Akeezo reaches in no time.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-normal max-w-lg">
              Someone needs urgent medical help at home, hotel, airport, or during transit. Share the concern and coordinates for instant coordination.
            </p>
          </div>

          <div className="grid gap-2.5">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-rule/70 bg-card/50 hover:bg-card transition-colors">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emergency/10 text-emergency">
                <HeartPulse className="size-4.5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-ink-strong leading-snug">
                Emergency response & first aid guidance from medical experts
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-rule/70 bg-card/50 hover:bg-card transition-colors">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emergency/10 text-emergency">
                <UserCheck className="size-4.5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-ink-strong leading-snug">
                On-demand attendants & critical-care nurses from renowned hospitals
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-rule/70 bg-card/50 hover:bg-card transition-colors">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emergency/10 text-emergency">
                <Activity className="size-4.5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-ink-strong leading-snug">
                Real-time updates to keep family informed on every parameter
              </p>
            </div>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-3">
            <a
              href={telHref(site.emergencyPhone)}
              className="group inline-flex h-11 items-center justify-center gap-2.5 rounded-xl bg-emergency px-5 text-sm font-bold text-white shadow-sm hover:bg-emergency-strong active:scale-98 transition-all"
            >
              <Siren className="size-4 animate-pulse" />
              <span>Call Emergency Desk: {site.emergencyPhone}</span>
            </a>
            <span className="text-xs text-muted-foreground font-medium">Free immediate call back</span>
          </div>
        </div>

        {/* Right Column: Intake Form */}
        <EmergencyForm />
      </div>
    </section>
  );
}
