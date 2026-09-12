import { Palette, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

export default function ThemeSettingsPage() {
  const { direction, setDirection } = useLocale();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold tracking-tight text-ink-strong">Theme & Appearance</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink-strong text-background shadow-md font-semibold text-sm">
          Apply Theme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[1.5rem] shadow-sm p-8">
          <h3 className="text-lg font-bold mb-6 border-b pb-4 flex items-center gap-2">
            <Palette className="size-5 text-primary" /> Color Scheme
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-primary rounded-xl p-4 cursor-pointer bg-slate-50 relative">
              <div className="absolute top-3 right-3 text-primary"><CheckCircle2 className="size-5" /></div>
              <div className="flex items-center gap-2 mb-3">
                <Sun className="size-5 text-amber-500" />
                <span className="font-bold">Light Mode</span>
              </div>
              <div className="h-12 w-full rounded-md bg-white border shadow-sm"></div>
            </div>

            <div className="border border-rule/50 rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="size-5 text-indigo-400" />
                <span className="font-bold">Dark Mode</span>
              </div>
              <div className="h-12 w-full rounded-md bg-slate-900 shadow-sm border border-slate-700"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm p-8">
          <h3 className="text-lg font-bold mb-6 border-b pb-4">Localization</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-ink-strong">Interface Direction</label>
              <div className="flex bg-slate-100 p-1 rounded-full w-fit">
                <button 
                  onClick={() => setDirection('ltr')}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${direction === 'ltr' ? 'bg-white shadow-sm text-ink-strong' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  LTR (Left to Right)
                </button>
                <button 
                  onClick={() => setDirection('rtl')}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${direction === 'rtl' ? 'bg-white shadow-sm text-ink-strong' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  RTL (Right to Left)
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-ink-strong">Language</label>
              <select className="w-full bg-slate-50 border border-rule/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none appearance-none">
                <option>English (US)</option>
                <option>Arabic</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
