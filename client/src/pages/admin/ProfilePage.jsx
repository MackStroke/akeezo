import { useState, useEffect } from 'react';
import { Camera, Mail, MapPin, Building, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return <div>Failed to load profile.</div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold tracking-tight text-ink-strong">User's Profile</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink-strong text-background shadow-md font-semibold text-sm">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Card Profile Avatar & Info */}
        <div className="bg-white rounded-[1.5rem] shadow-sm p-8 flex flex-col items-center text-center">
          <div className="relative group cursor-pointer mb-4">
            <div className="size-32 rounded-full overflow-hidden border-4 border-background shadow-md">
              <img src={profile.avatar} alt="Profile" className="size-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="text-white size-8" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-ink-strong">{profile.name}</h2>
          <p className="text-primary font-bold text-sm tracking-wide uppercase mt-1">{profile.role}</p>

          <div className="w-full mt-8 space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-slate-50 p-3 rounded-xl border">
              <Mail className="size-4" /> <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-slate-50 p-3 rounded-xl border">
              <Building className="size-4" /> <span>{profile.department}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-slate-50 p-3 rounded-xl border">
              <MapPin className="size-4" /> <span>{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Forms & Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[1.5rem] shadow-sm p-8">
            <h3 className="text-lg font-bold mb-6 border-b pb-4">Personal Details</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={profile.name} 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={profile.email} 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Department</label>
                <input 
                  type="text" 
                  defaultValue={profile.department} 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Location</label>
                <input 
                  type="text" 
                  defaultValue={profile.location} 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </form>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-sm p-8">
            <h3 className="text-lg font-bold mb-6 border-b pb-4">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <KeyRound className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-ink-strong text-sm">Password</h4>
                    <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-full border text-xs font-bold hover:bg-muted transition-colors">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className={`size-10 rounded-full flex items-center justify-center ${profile.twoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-ink-strong text-sm">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground">
                      {profile.twoFactorEnabled ? 'Currently enabled' : 'Not enabled'}
                    </p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${profile.twoFactorEnabled ? 'border hover:bg-muted' : 'bg-ink-strong text-background'}`}>
                  {profile.twoFactorEnabled ? 'Manage' : 'Enable 2FA'}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
