import { useState, useEffect } from 'react';
import { LineChart, BarChart, Activity, Users, MousePointerClick, Globe, ArrowUpRight } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export default function AnalyticsReportsPage() {
  const [visitors, setVisitors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('adminToken');
        const [sumRes, visRes] = await Promise.all([
          fetch('/api/admin/analytics/summary', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/analytics/visitors?limit=20', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (sumRes.ok) {
          const sumData = await sumRes.json();
          setSummary(sumData.data);
        }
        if (visRes.ok) {
          const visData = await visRes.json();
          setVisitors(visData.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading Analytics...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visitor Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Detailed tracking of user activity, page views, and interactions.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Unique Visitors</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{summary?.totalVisitors || 0}</p>
          </div>
          <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="size-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Today</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{summary?.todayVisitors || 0}</p>
          </div>
          <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity className="size-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Top Visited Page</p>
            <p className="text-xl font-bold text-slate-900 mt-1 truncate max-w-[150px]">
              {summary?.topPages?.[0]?.path || '/'}
            </p>
          </div>
          <div className="size-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <BarChart className="size-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Engagement</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {summary?.recentActivity?.length > 0 
                ? Math.round(summary.recentActivity.reduce((acc, v) => acc + v.eventCount, 0) / summary.recentActivity.length) 
                : 0} events/user
            </p>
          </div>
          <div className="size-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <MousePointerClick className="size-5" />
          </div>
        </div>
      </div>

      {/* Visitor Feed */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-slate-50/50">
          <h3 className="font-semibold text-slate-900">Recent Visitor Profiles</h3>
        </div>
        <div className="divide-y">
          {visitors.length === 0 && (
            <div className="p-8 text-center text-slate-500">No visitors tracked yet.</div>
          )}
          {visitors.map((visitor) => (
            <div key={visitor._id} className="p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 font-mono text-xs">
                    {visitor.visitorId.substring(0,4)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      Visitor {visitor.visitorId.substring(0, 8)}
                      {visitor.country && visitor.country !== 'Unknown' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600 font-medium">
                          <Globe className="size-3" />
                          {visitor.country}
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                      {visitor.events.length} interactions • Sessions: {visitor.sessionCount}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Last Active: {formatDistanceToNow(new Date(visitor.lastActive), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex-1 max-w-md bg-slate-50 rounded-lg border p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent Journey</p>
                  <div className="space-y-2">
                    {visitor.events.slice(-4).reverse().map((event, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="size-1.5 rounded-full bg-slate-300" />
                        <span className="text-slate-500 tabular-nums text-xs min-w-[50px]">
                          {format(new Date(event.timestamp), 'HH:mm')}
                        </span>
                        {event.type === 'page_view' ? (
                          <span className="text-slate-900 font-medium truncate flex items-center gap-1.5">
                            Visited <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">{event.path}</span>
                          </span>
                        ) : (
                          <span className="text-slate-900 font-medium truncate flex items-center gap-1.5">
                            Interacted with <span className="font-medium text-amber-600 bg-amber-50 px-1 rounded">{event.type}</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
