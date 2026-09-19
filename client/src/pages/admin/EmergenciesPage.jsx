import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Siren, ChevronRight, Clock, MapPin, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../../components/ui/button';
import { exportCsv, EMERGENCY_EXPORT, prepareEmergencyRows } from '../../lib/exportCsv';

export default function EmergenciesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function fetchCases() {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await fetch(`/api/admin/emergencies?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store',
            Pragma: 'no-cache',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setCases(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch emergencies', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
    const handleFocus = () => fetchCases();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(fetchCases, 10000);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const filtered = cases.filter(c =>
    !search ||
    c.caseId?.toLowerCase().includes(search.toLowerCase()) ||
    c.requesterName?.toLowerCase().includes(search.toLowerCase()) ||
    c.problem?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(c => c._id || c.id));
  const toggleOne = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleExport = () => {
    const rows = selected.length > 0
      ? filtered.filter(c => selected.includes(c._id || c.id))
      : filtered;
    exportCsv(
      selected.length > 0 ? 'emergencies-selected' : 'emergencies-all',
      EMERGENCY_EXPORT.headers,
      EMERGENCY_EXPORT.keys,
      prepareEmergencyRows(rows),
    );
  };

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
        <Button variant="outline" className="gap-2 font-bold" onClick={handleExport}>
          <Download className="size-4" />
          {selected.length > 0 ? `Export Selected (${selected.length})` : 'Export All CSV'}
        </Button>
      </div>

      <div className="bg-white dark:bg-card rounded-[1.5rem] shadow-sm overflow-hidden border border-rule/50">
        <div className="p-4 border-b flex items-center gap-4 bg-slate-50/50 dark:bg-muted/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search case ID, requester or problem..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-rule/50 text-sm bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {selected.length > 0 && (
            <span className="text-xs font-semibold text-muted-foreground">
              {selected.length} selected
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse">Loading cases...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No emergency requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-6 py-4 font-bold">Case ID</th>
                  <th className="px-6 py-4 font-bold">Time</th>
                  <th className="px-6 py-4 font-bold">Problem</th>
                  <th className="px-6 py-4 font-bold">Requester</th>
                  <th className="px-6 py-4 font-bold">Location</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/30">
                {filtered.map((c) => {
                  const id = c._id || c.id;
                  const isSelected = selected.includes(id);
                  return (
                    <tr key={id} className={`transition-colors group ${isSelected ? 'bg-primary/5' : 'hover:bg-slate-50 dark:hover:bg-muted/30'}`}>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={isSelected}
                          onChange={() => toggleOne(id)}
                        />
                      </td>
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
                          className="inline-flex items-center justify-center size-8 rounded-full bg-white dark:bg-background border shadow-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
