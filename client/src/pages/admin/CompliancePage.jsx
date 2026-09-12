import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold tracking-tight text-ink-strong">Compliance & Risk</h1>
        <div className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center gap-2">
          <ShieldCheck className="size-4" /> System Compliant
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[1.5rem] shadow-sm p-6 col-span-2">
          <h3 className="text-lg font-bold mb-4">Regulatory Requirements</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border flex items-start gap-4">
              <div className="mt-1"><ShieldCheck className="size-5 text-green-600" /></div>
              <div>
                <h4 className="font-bold text-ink-strong">HIPAA Compliance</h4>
                <p className="text-sm text-muted-foreground mt-1">Patient data encryption and access controls are fully compliant.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border flex items-start gap-4">
              <div className="mt-1"><ShieldCheck className="size-5 text-green-600" /></div>
              <div>
                <h4 className="font-bold text-ink-strong">GDPR Data Processing</h4>
                <p className="text-sm text-muted-foreground mt-1">Consent logs and right-to-be-forgotten processes are passing checks.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emergency-surface border border-emergency/20 flex items-start gap-4">
              <div className="mt-1"><ShieldAlert className="size-5 text-emergency" /></div>
              <div>
                <h4 className="font-bold text-emergency-strong">Partner Accreditation Review</h4>
                <p className="text-sm text-emergency-ink mt-1">3 hospitals require updated JCI accreditation certificates.</p>
                <button className="mt-3 px-3 py-1.5 rounded-full bg-emergency text-white text-xs font-bold shadow-sm">
                  Review Partners
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-ink-strong text-background rounded-[1.5rem] shadow-md p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">Overall Risk Score</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="size-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                <circle cx="64" cy="64" r="56" fill="none" stroke="var(--primary)" strokeWidth="12" strokeDasharray="351" strokeDashoffset="70" />
              </svg>
              <div className="absolute text-3xl font-black text-white">82%</div>
            </div>
            <p className="text-white/70 text-sm mt-6 text-center">Low to Moderate Risk</p>
          </div>
        </div>
      </div>
    </div>
  );
}
