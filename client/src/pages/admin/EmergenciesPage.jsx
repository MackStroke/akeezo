import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Siren, AlertCircle, ChevronRight, Clock, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function EmergenciesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCases() {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await fetch('/api/admin/emergencies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCases(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch emergencies', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'received') return 'bg-emergency-surface text-emergency-strong border-emergency/30 animate-pulse';
    if (status === 'closed' || status === 'cancelled') return 'bg-muted text-muted-foreground border-rule/50';
    return 'bg-orange-100 text-orange-700 border-orange-200';
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-strong flex items-center gap-3">
            <Siren className="size-8 text-emergency" /> Emergency Control Desk
          </h1>
          <p className="text-muted-foreground mt-2">Manage SOS requests and dispatch workflows in real-time.</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm overflow-hidden border border-rule/50">
        <div className="p-4 border-b flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search case ID or requester..." 
              className="w-full pl-9 pr-4 py-2 rounded-full border border-rule/50 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse">Loading cases...</div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No emergency requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-bold">Case ID</th>
                  <th className="px-6 py-4 font-bold">Time</th>
                  <th className="px-6 py-4 font-bold">Problem</th>
                  <th className="px-6 py-4 font-bold">Requester</th>
                  <th className="px-6 py-4 font-bold">Location</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/30">
                {cases.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-mono font-medium text-xs">{c.caseId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" />
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-ink-strong">{c.problem}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink-strong">{c.requesterName}</div>
                      <div className="text-xs text-muted-foreground">{c.requesterPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 max-w-[200px] truncate">
                        <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{c.location?.label || c.location?.placeType || 'Unknown location'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(c.status)}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/admin/emergencies/${c.caseId}`}
                        className="inline-flex items-center justify-center size-8 rounded-full bg-white border shadow-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                      >
                        <ChevronRight className="size-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
