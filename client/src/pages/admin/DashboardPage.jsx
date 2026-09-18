import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Activity, Siren, BookOpen, TrendingUp, TrendingDown,
  UserCheck, FileText, Eye, Globe, RefreshCw, AlertTriangle,
  CheckCircle2, Clock, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

// ─── Helpers ────────────────────────────────────────────────────────────────
function safeFormat(dateStr) {
  try {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch { return '—'; }
}

function StatCard({ title, value, sub, icon: Icon, trend, trendLabel, accent, link }) {
  const isPositive = trend > 0;
  const card = (
    <Card className={cn(
      'relative overflow-hidden transition-all hover:shadow-md',
      accent === 'gradient' && 'cta-gradient text-white border-none',
      accent === 'navy' && 'bg-navy text-white border-none',
      accent === 'emergency' && 'bg-emergency-surface border-emergency/20',
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className={cn(
          'text-sm font-semibold tracking-wide',
          (accent === 'gradient' || accent === 'navy') ? 'text-white/80' : 'text-muted-foreground',
        )}>
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn(
            'size-4',
            accent === 'gradient' && 'text-white/70',
            accent === 'navy' && 'text-white/70',
            accent === 'emergency' && 'text-emergency',
            !accent && 'text-muted-foreground',
          )} />
        )}
      </CardHeader>
      <CardContent>
        <div className={cn(
          'text-3xl font-black tracking-tight',
          accent === 'emergency' && 'text-emergency',
        )}>
          {value ?? '—'}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          {trend !== undefined && trend !== null && (
            <span className={cn(
              'flex items-center text-xs font-semibold',
              isPositive ? 'text-emerald-500' : 'text-rose-500',
              (accent === 'gradient' || accent === 'navy') && 'text-white/80',
            )}>
              {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(trend)}%
            </span>
          )}
          {sub && (
            <p className={cn(
              'text-xs',
              (accent === 'gradient' || accent === 'navy') ? 'text-white/70' : 'text-muted-foreground',
            )}>
              {trendLabel || sub}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
  return link ? <Link to={link}>{card}</Link> : card;
}

// ─── Mini Bar Chart ──────────────────────────────────────────────────────────
function MiniBarChart({ data }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-16 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-sm bg-primary/20 hover:bg-primary/50 transition-colors relative group"
            style={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover border text-[10px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {d.count}
            </div>
          </div>
          <span className="text-[9px] text-muted-foreground font-medium">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Status Pill ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Qualified: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  Converted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  Lost: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  dispatched: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  escalated: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
};

const INTENT_LABELS = {
  medical_tourism: 'Medical Tourism',
  home_healthcare: 'Home Healthcare',
  emergency: 'Emergency',
  general: 'General Inquiry',
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
        setLastRefresh(new Date());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse pb-12">
        <div className="h-10 w-64 bg-muted rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl" />)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  const s = stats || {};

  // Donut % for conversion
  const convRate = s.conversionRate || 0;
  const circumference = 2 * Math.PI * 36;
  const strokeDash = (convRate / 100) * circumference;

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink-strong">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Live platform analytics — all data from MongoDB.
            {lastRefresh && (
              <span className="ml-2 text-xs text-muted-foreground/70">
                Updated {lastRefresh.toLocaleTimeString('en-IN')}
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStats} className="gap-2 font-semibold self-start sm:self-auto">
          <RefreshCw className="size-3.5" />
          Refresh
        </Button>
      </div>

      {/* Row 1 — Primary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={s.totalLeads ?? 0}
          trend={s.leadGrowth}
          trendLabel="vs last 30 days"
          sub="All enquiries received"
          icon={Users}
          link="/admin/leads"
        />
        <StatCard
          title="Active Leads"
          value={s.activeLeads ?? 0}
          sub="Require follow-up"
          icon={Activity}
          accent="gradient"
          link="/admin/leads"
        />
        <StatCard
          title="Active Emergencies"
          value={s.activeEmergencies ?? 0}
          sub={s.activeEmergencies > 0 ? 'Immediate attention' : 'All clear'}
          icon={Siren}
          accent={s.activeEmergencies > 0 ? 'emergency' : undefined}
          link="/admin/emergencies"
        />
        <StatCard
          title="Registered Users"
          value={s.totalUsers ?? 0}
          sub="Platform accounts"
          icon={UserCheck}
          link="/admin/users"
        />
      </div>

      {/* Row 2 — Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="New Today"
          value={s.newLeadsToday ?? 0}
          sub="Leads since midnight"
          icon={TrendingUp}
        />
        <StatCard
          title="Converted"
          value={s.convertedLeads ?? 0}
          sub="Successfully closed"
          icon={CheckCircle2}
        />
        <StatCard
          title="Emergencies Today"
          value={s.emergenciesToday ?? 0}
          sub="SOS cases today"
          icon={AlertTriangle}
          link="/admin/emergencies"
        />
        <StatCard
          title="Blog Views"
          value={s.totalBlogViews?.toLocaleString('en-IN') ?? 0}
          sub={`${s.publishedBlogPosts ?? 0} published articles`}
          icon={Eye}
          link="/admin/blog"
        />
      </div>

      {/* Row 3 — Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left col (span 2) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Leads last 7 days bar chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Leads This Week</CardTitle>
                  <CardDescription className="text-xs">Daily enquiries — last 7 days</CardDescription>
                </div>
                <Badge variant="outline" className="font-bold text-xs">
                  {s.leadsLast7 ?? 0} total
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <MiniBarChart data={s.leadsPerDay} />
            </CardContent>
          </Card>

          {/* Intent + Status breakdown row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Intent breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <PieChart className="size-4 text-primary" /> Lead Intent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {s.intentBreakdown && Object.keys(s.intentBreakdown).length > 0 ? (
                  Object.entries(s.intentBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .map(([intent, count]) => {
                      const pct = s.totalLeads > 0 ? Math.round((count / s.totalLeads) * 100) : 0;
                      return (
                        <div key={intent}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              {INTENT_LABELS[intent] || intent}
                            </span>
                            <span className="text-xs font-bold">{count} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No leads yet</p>
                )}
              </CardContent>
            </Card>

            {/* Status breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="size-4 text-primary" /> Lead Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {s.statusBreakdown && Object.keys(s.statusBreakdown).length > 0 ? (
                  Object.entries(s.statusBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <Badge className={cn('text-[10px] font-bold px-2 py-0.5', STATUS_COLORS[status] || 'bg-muted text-muted-foreground')}>
                          {status}
                        </Badge>
                        <span className="text-sm font-bold tabular-nums">{count}</span>
                      </div>
                    ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No data yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Countries */}
          {s.topCountries?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Globe className="size-4 text-primary" /> Top Lead Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {s.topCountries.map(({ country, count }, i) => {
                    const pct = s.totalLeads > 0 ? Math.round((count / s.totalLeads) * 100) : 0;
                    return (
                      <div key={country}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold flex items-center gap-1.5">
                            <span className="text-muted-foreground font-normal">#{i + 1}</span>
                            {country}
                          </span>
                          <span className="text-xs font-bold tabular-nums">{count} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/60 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Conversion Rate Donut */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Conversion Rate</CardTitle>
              <CardDescription className="text-xs">Leads converted to patients</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative size-24">
                <svg className="size-24 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="36"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black">{convRate}%</span>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-2 text-center">
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-lg font-black text-emerald-600">{s.convertedLeads ?? 0}</div>
                  <div className="text-[10px] text-muted-foreground font-medium">Converted</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <div className="text-lg font-black text-rose-500">{s.lostLeads ?? 0}</div>
                  <div className="text-[10px] text-muted-foreground font-medium">Lost</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Platform Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Total Emergencies', value: s.totalEmergencies ?? 0, icon: Siren, link: '/admin/emergencies' },
                { label: 'Hub Recommendations', value: s.totalRecommendations ?? 0, icon: MapPin, link: '/admin/recommendations' },
                { label: 'Closed Emergencies', value: s.closedEmergencies ?? 0, icon: CheckCircle2 },
                { label: 'Total Blog Posts', value: s.totalBlogPosts ?? 0, icon: BookOpen, link: '/admin/blog' },
                { label: 'Published Posts', value: s.publishedBlogPosts ?? 0, icon: FileText },
                { label: 'Internal Notes', value: s.totalNotes ?? 0, icon: FileText },
              ].map(({ label, value, icon: Icon, link }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="size-3.5 text-primary/70" />
                    {link ? (
                      <Link to={link} className="hover:text-primary hover:underline font-medium">{label}</Link>
                    ) : (
                      <span className="font-medium">{label}</span>
                    )}
                  </div>
                  <span className="text-sm font-bold tabular-nums">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Latest Emergency Alert */}
          {s.latestEmergencyId && (
            <Link to={`/admin/emergencies/${s.latestEmergencyId}`}>
              <Card className="bg-emergency-surface border-emergency/30 hover:border-emergency/60 transition-colors cursor-pointer">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-emergency/10 flex items-center justify-center shrink-0">
                      <Siren className="size-4 text-emergency animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emergency">Active Emergency</p>
                      <p className="text-[11px] text-emergency-ink font-mono">{s.latestEmergencyId}</p>
                    </div>
                    <ArrowUpRight className="size-4 text-emergency ml-auto" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </div>

      {/* Recent Activity Feed */}
      {s.recentActivity?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
                <CardDescription className="text-xs">Latest leads, emergency cases, and hub recommendations</CardDescription>
              </div>
              <div className="flex gap-2">
                <Link to="/admin/leads">
                  <Button variant="outline" size="sm" className="text-xs font-semibold h-7">Leads</Button>
                </Link>
                <Link to="/admin/recommendations">
                  <Button variant="outline" size="sm" className="text-xs font-semibold h-7">Recommendations</Button>
                </Link>
                <Link to="/admin/emergencies">
                  <Button variant="outline" size="sm" className="text-xs font-semibold h-7">Cases</Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {s.recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
                  {/* Icon */}
                  <div className={cn(
                    'size-8 rounded-full flex items-center justify-center shrink-0',
                    item.type === 'emergency' ? 'bg-emergency/10' : item.type === 'recommendation' ? 'bg-mint/15' : 'bg-primary/10',
                  )}>
                    {item.type === 'emergency'
                      ? <Siren className="size-3.5 text-emergency" />
                      : item.type === 'recommendation'
                        ? <MapPin className="size-3.5 text-mint" />
                        : <Users className="size-3.5 text-primary" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.type === 'emergency'
                        ? `Emergency · ${item.problem || 'SOS'}`
                        : item.type === 'recommendation'
                          ? `Recommend ${item.recType || 'Hub'} · ${item.targetName || ''}`
                          : `${INTENT_LABELS[item.intent] || item.intent} · ${item.journeyId || ''}`
                      }
                    </p>
                  </div>

                  {/* Status */}
                  <Badge className={cn('text-[10px] font-bold shrink-0 capitalize', STATUS_COLORS[item.status] || 'bg-muted text-muted-foreground')}>
                    {item.status}
                  </Badge>

                  {/* Time + Link */}
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-muted-foreground">{safeFormat(item.createdAt)}</p>
                    {item.type === 'emergency' && item.caseId && (
                      <Link
                        to={`/admin/emergencies/${item.caseId}`}
                        className="text-[10px] text-primary font-semibold hover:underline"
                      >
                        View →
                      </Link>
                    )}
                    {item.type === 'recommendation' && (
                      <Link
                        to="/admin/recommendations"
                        className="text-[10px] text-mint font-semibold hover:underline"
                      >
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
