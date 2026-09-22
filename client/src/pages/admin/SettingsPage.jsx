import { useState, useEffect } from 'react';
import { Save, Activity, Globe, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    gtmId: '',
    googleSiteVerification: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok && data.data) {
        setFormData({
          gtmId: data.data.gtmId || '',
          googleSiteVerification: data.data.googleSiteVerification || ''
        });
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold tracking-tight text-ink-strong">Global Settings</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink-strong text-background shadow-md font-semibold text-sm disabled:opacity-50"
        >
          <Save className="size-4" /> {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <Activity className="size-5 text-primary" />
          <h3 className="text-lg font-bold">SEO & Tracking Integration</h3>
        </div>
        
        <form className="space-y-6 max-w-2xl" onSubmit={handleSave}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink-strong flex items-center gap-2">
              <Globe className="size-4 text-slate-400" />
              Google Tag Manager ID
            </label>
            <input 
              type="text" 
              placeholder="GTM-XXXXXXX"
              value={formData.gtmId}
              onChange={(e) => setFormData({...formData, gtmId: e.target.value})}
              className="w-full bg-slate-50 border border-rule/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-slate-400"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter your GTM ID to enable Google Analytics (GA4) and other tracking scripts.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-ink-strong flex items-center gap-2">
              <Globe className="size-4 text-slate-400" />
              Google Search Console Verification
            </label>
            <input 
              type="text" 
              placeholder="e.g. xxxxxxxx-xxxxxxxxxxxxxxxx"
              value={formData.googleSiteVerification}
              onChange={(e) => setFormData({...formData, googleSiteVerification: e.target.value})}
              className="w-full bg-slate-50 border border-rule/50 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-slate-400"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the HTML tag verification code to rank and view data in Google Search Console.
            </p>
          </div>
        </form>

        <div className="mt-8 bg-blue-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-start gap-3">
            <HelpCircle className="size-5 text-blue-600 mt-0.5" />
            <div className="space-y-3">
              <h4 className="font-bold text-blue-900 text-sm">How to get these codes?</h4>
              
              <div className="space-y-1">
                <p className="text-xs font-semibold text-blue-800">For Google Tag Manager (GTM):</p>
                <ol className="list-decimal list-inside text-xs text-blue-700 space-y-1 ml-1">
                  <li>Go to <a href="https://tagmanager.google.com/" target="_blank" rel="noreferrer" className="underline font-medium hover:text-blue-900">tagmanager.google.com</a> and sign in.</li>
                  <li>Select your container.</li>
                  <li>Look for your Container ID formatted as <strong>GTM-XXXXXX</strong> near the top of the workspace.</li>
                  <li>Copy that ID and paste it in the field above.</li>
                </ol>
              </div>

              <div className="space-y-1 mt-3">
                <p className="text-xs font-semibold text-blue-800">For Google Search Console:</p>
                <ol className="list-decimal list-inside text-xs text-blue-700 space-y-1 ml-1">
                  <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="underline font-medium hover:text-blue-900">Google Search Console</a> and add a new "URL prefix" property.</li>
                  <li>In the verification methods, select <strong>HTML tag</strong>.</li>
                  <li>Google will give you a meta tag that looks like: <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-900">{'<meta name="google-site-verification" content="YOUR_CODE_HERE" />'}</code></li>
                  <li>Copy <strong>only</strong> the code part (inside the content quotes) and paste it above.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legacy placeholder sections can be added below if needed later */}
    </div>
  );
}
