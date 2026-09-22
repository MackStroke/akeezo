import { useState, useEffect } from 'react';
import { Wrench, ShieldAlert, Globe, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';

// Define the core pages of the site that can be toggled
const AVAILABLE_PAGES = [
  { path: '/', label: 'Home Page' },
  { path: '/hospitals', label: 'Hospitals Directory' },
  { path: '/doctors', label: 'Doctors' },
  { path: '/blog', label: 'Blog & Articles' },
  { path: '/privacy', label: 'Privacy Policy' },
  { path: '/terms', label: 'Terms of Service' },
  { path: '/my-journey', label: 'Customer Portal (My Journey)' },
  { path: '/profile', label: 'Customer Profile' },
];

export default function MaintenanceAdminPage() {
  const [maintenancePages, setMaintenancePages] = useState([]);
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
      if (data.ok && data.data?.maintenancePages) {
        setMaintenancePages(data.data.maintenancePages);
      }
    } catch (err) {
      toast.error('Failed to load maintenance configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (path) => {
    setMaintenancePages(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ maintenancePages })
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Maintenance settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading Configuration...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Maintenance Mode</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enable or disable maintenance mode for specific public pages.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 rounded-full px-6">
          <Save className="size-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50 flex items-start gap-4">
          <div className="size-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">How this works</h3>
            <p className="text-sm text-slate-600 mt-1">
              When a page is toggled <strong>ON</strong> (Under Maintenance), visitors trying to access it will see a "We'll be back shortly" screen instead of the actual content. Admin panel routes cannot be placed in maintenance mode.
            </p>
          </div>
        </div>

        <div className="divide-y">
          {AVAILABLE_PAGES.map((page) => {
            const isUnderMaintenance = maintenancePages.includes(page.path);
            return (
              <div key={page.path} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isUnderMaintenance ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                    {isUnderMaintenance ? <Wrench className="size-5" /> : <Globe className="size-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{page.label}</h4>
                    <p className="text-sm text-slate-500 font-mono mt-0.5">{page.path}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${isUnderMaintenance ? 'text-amber-600' : 'text-slate-400'}`}>
                    {isUnderMaintenance ? 'Maintenance Active' : 'Live'}
                  </span>
                  <Switch 
                    checked={isUnderMaintenance}
                    onCheckedChange={() => handleToggle(page.path)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
