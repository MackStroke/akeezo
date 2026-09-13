import { useState, useEffect } from 'react';
import { Users, Activity, Printer, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.data || { totalLeads: 0, activeLeads: 0 });
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Title and Actions */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink-strong">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Platform analytics and metrics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="shadow-sm">
            <Printer className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="shadow-sm">
            <Download className="size-4" />
          </Button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.activeLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.1% from last month</p>
          </CardContent>
        </Card>

        {/* Gradient Card matching Akeezo button CTA */}
        <Card className="cta-gradient text-white border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Estimated Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,231</div>
            <p className="text-xs text-white/80 mt-1">Projected revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Activity</CardTitle>
              <CardDescription>
                The coordination team is actively monitoring incoming medical tourism and home healthcare requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center bg-muted/50 p-4 rounded-xl border">
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Coordinators</span>
                  <div className="flex -space-x-2">
                    <div className="size-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-xs font-bold text-primary">JD</div>
                    <div className="size-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-bold text-green-700">AM</div>
                    <div className="size-8 rounded-full bg-navy border-2 border-white flex items-center justify-center text-xs font-bold text-white">+2</div>
                  </div>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Doctors</span>
                  <div className="flex -space-x-2">
                    <div className="size-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-700">DR</div>
                    <div className="size-8 rounded-full bg-navy border-2 border-white flex items-center justify-center text-xs font-bold text-white">+1</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-navy text-white border-none shadow-md">
              <CardContent className="pt-6">
                <span className="block text-sm font-medium text-white/70 mb-1">Top Source</span>
                <h4 className="text-xl font-bold text-white">Organic Search</h4>
                <div className="mt-4">
                  <span className="block text-sm font-medium text-white/70 mb-1">Trend</span>
                  <div className="font-bold text-primary">+14% this week</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emergency-surface border-emergency/20">
              <CardContent className="pt-6">
                <span className="block text-sm font-medium text-emergency-ink/70 mb-1">Drop-off Rate</span>
                <h4 className="text-xl font-bold text-emergency">18%</h4>
                <div className="mt-4">
                  <span className="block text-sm font-medium text-emergency-ink/70 mb-1">Action Required</span>
                  <div className="font-bold text-emergency-ink">Review funnel</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inquiries Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full relative flex items-end">
                {/* Abstract SVG line */}
                <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <path 
                    d="M 0,150 C 100,150 150,180 250,160 C 350,140 400,100 500,130 C 600,160 650,180 750,100 C 850,20 950,50 1000,40" 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <circle cx="1000" cy="40" r="8" fill="var(--background)" stroke="var(--primary)" strokeWidth="4" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
