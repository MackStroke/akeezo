import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold tracking-tight text-ink-strong">Global Settings</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink-strong text-background shadow-md font-semibold text-sm">
          <Save className="size-4" /> Save Configuration
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm p-8">
        <h3 className="text-lg font-bold mb-6 border-b pb-4">Platform Preferences</h3>
        
        <form className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink-strong">Platform Name</label>
            <input 
              type="text" 
              defaultValue="Akeezo Admin" 
              className="w-full bg-slate-50 border border-rule/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <p className="text-xs text-muted-foreground mt-1">Displayed in the sidebar and meta tags.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink-strong">Support Email</label>
            <input 
              type="email" 
              defaultValue="support@akeezo.com" 
              className="w-full bg-slate-50 border border-rule/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-ink-strong">Lead Assignment</label>
            <select className="w-full bg-slate-50 border border-rule/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none appearance-none">
              <option>Round Robin (Auto)</option>
              <option>Manual Assignment</option>
              <option>Load Balanced</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
}
