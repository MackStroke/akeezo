import { useState, useEffect } from 'react';
import { Activity, ArrowUpRight, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AnalyticsWidget() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/analytics/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSummary(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics widget data', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (isLoading) {
    return <div className="p-6 border rounded-2xl bg-white text-center text-sm text-slate-500">Loading Analytics...</div>;
  }

  if (!summary) return null;

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-emerald-600" />
          <h3 className="font-semibold text-slate-900">Live Visitor Analytics</h3>
        </div>
        <Link to="/admin/analytics" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View Full Report <ArrowUpRight className="size-3" />
        </Link>
      </div>
      
      <div className="p-5 grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Active Today</p>
          <div className="flex items-end gap-2 mt-2">
            <p className="text-3xl font-bold text-slate-900">{summary.todayVisitors}</p>
            <Users className="size-5 text-blue-400 mb-1" />
          </div>
        </div>
        
        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Top Page</p>
          <div className="flex flex-col mt-2">
            <p className="text-lg font-bold text-slate-900 truncate" title={summary.topPages?.[0]?.path || '/'}>
              {summary.topPages?.[0]?.path || '/'}
            </p>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
              <Eye className="size-3" /> {summary.topPages?.[0]?.views || 0} views
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-5 pb-5">
        <p className="text-xs font-medium text-slate-500 mb-3">Recent Activity Stream</p>
        <div className="space-y-3">
          {summary.recentActivity?.slice(0, 3).map((v, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="size-2 rounded-full bg-slate-300 shrink-0" />
              <p className="text-slate-600 truncate">
                Visitor <span className="font-mono text-xs">{v.visitorId.substring(0,6)}</span> viewed <span className="font-medium text-slate-900">{v.lastPage}</span>
              </p>
            </div>
          ))}
          {(!summary.recentActivity || summary.recentActivity.length === 0) && (
            <p className="text-sm text-slate-400 italic">No activity recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
