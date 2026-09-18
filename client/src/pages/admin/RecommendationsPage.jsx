import { useState, useEffect } from 'react';
import {
  Building2,
  Globe2,
  Sparkles,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import SEO from '@/components/SEO';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'city' | 'country'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'new' | 'reviewed' | 'planned' | 'archived'

  const [selectedRec, setSelectedRec] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/recommendations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setRecommendations(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdating(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/recommendations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        setRecommendations((prev) =>
          prev.map((item) => ((item._id || item.id) === id ? json.data : item)),
        );
        if (selectedRec && (selectedRec._id || selectedRec.id) === id) {
          setSelectedRec(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recommendation?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/recommendations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRecommendations((prev) => prev.filter((item) => (item._id || item.id) !== id));
        if (selectedRec && (selectedRec._id || selectedRec.id) === id) {
          setDetailOpen(false);
        }
      }
    } catch (err) {
      console.error('Failed to delete recommendation:', err);
    }
  };

  // Filtered List
  const filtered = recommendations.filter((r) => {
    const matchesSearch =
      search === '' ||
      r.targetName?.toLowerCase().includes(search.toLowerCase()) ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.recommendationId?.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesStatus = filterStatus === 'all' || (r.status || 'new') === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Metrics
  const totalCount = recommendations.length;
  const cityCount = recommendations.filter((r) => r.type === 'city').length;
  const countryCount = recommendations.filter((r) => r.type === 'country').length;
  const newCount = recommendations.filter((r) => !r.status || r.status === 'new').length;

  return (
    <div className="space-y-6 font-sans pb-12">
      <SEO title="Hub Recommendations | AKEEZO Admin" noindex={true} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-ink-strong tracking-tight">Hub Recommendations</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            User-submitted suggestions for expanding Akeezo city & country healthcare networks.
          </p>
        </div>
        <Button onClick={fetchRecommendations} variant="outline" size="sm" className="gap-2 font-bold self-start">
          <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 bg-card border-rule/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total Suggestions</span>
            <MapPin className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-ink-strong mt-2">{totalCount}</p>
        </Card>

        <Card className="p-4 bg-card border-rule/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">City Requests</span>
            <Building2 className="size-4 text-mint" />
          </div>
          <p className="text-2xl font-black text-mint mt-2">{cityCount}</p>
        </Card>

        <Card className="p-4 bg-card border-rule/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Country Requests</span>
            <Globe2 className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2">{countryCount}</p>
        </Card>

        <Card className="p-4 bg-card border-rule/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Pending Review</span>
            <Clock className="size-4 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-orange-600 mt-2">{newCount}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 bg-card border-rule/60">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by location, user name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Filter className="size-3.5" /> Type:
            </span>
            <div className="flex gap-1 bg-muted p-1 rounded-md text-xs font-bold">
              {['all', 'city', 'country'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                    filterType === t ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-muted-foreground ml-2">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-bold bg-muted border-none rounded-md px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="planned">Planned</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-rule/60 bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-bold text-xs uppercase">ID & Date</TableHead>
              <TableHead className="font-bold text-xs uppercase">Type</TableHead>
              <TableHead className="font-bold text-xs uppercase">Suggested Location</TableHead>
              <TableHead className="font-bold text-xs uppercase">Submitted By</TableHead>
              <TableHead className="font-bold text-xs uppercase">Status</TableHead>
              <TableHead className="text-right font-bold text-xs uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                  Loading recommendations...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                  No recommendations found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => {
                const recId = r._id || r.id;
                const status = r.status || 'new';

                return (
                  <TableRow key={recId} className="hover:bg-muted/20">
                    <TableCell className="font-medium text-xs">
                      <div className="font-mono font-bold text-primary">{r.recommendationId || 'REC-SYS'}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </div>
                    </TableCell>

                    <TableCell>
                      {r.type === 'country' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 border border-blue-500/20">
                          <Globe2 className="size-3" /> Country
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-bold text-mint border border-mint/30">
                          <Building2 className="size-3" /> City
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="font-black text-sm text-ink-strong">{r.targetName}</div>
                      {r.region && <div className="text-xs text-muted-foreground">{r.region}</div>}
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="font-bold text-foreground">{r.name}</div>
                      <div className="text-muted-foreground font-mono">{r.phone}</div>
                      {r.email && <div className="text-muted-foreground truncate max-w-[140px]">{r.email}</div>}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold capitalize ${
                          status === 'new'
                            ? 'bg-orange-500/15 text-orange-600 border border-orange-500/30'
                            : status === 'reviewed'
                              ? 'bg-blue-500/15 text-blue-600 border border-blue-500/30'
                              : status === 'planned'
                                ? 'bg-mint/15 text-mint border border-mint/30'
                                : 'bg-muted text-muted-foreground border'
                        }`}
                      >
                        {status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            setSelectedRec(r);
                            setDetailOpen(true);
                          }}
                          className="font-bold text-xs"
                        >
                          View Details
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(recId)}
                          className="size-8 text-muted-foreground hover:text-emergency"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Details & Action Modal */}
      {selectedRec && (
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="sm:max-w-md font-sans">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {selectedRec.type === 'country' ? (
                  <span className="rounded-full bg-blue-500/15 p-2 text-blue-600">
                    <Globe2 className="size-5" />
                  </span>
                ) : (
                  <span className="rounded-full bg-mint/15 p-2 text-mint">
                    <Building2 className="size-5" />
                  </span>
                )}
                <div>
                  <DialogTitle className="text-lg font-black text-ink-strong">
                    {selectedRec.targetName}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    {selectedRec.recommendationId} • Suggested on{' '}
                    {selectedRec.createdAt ? new Date(selectedRec.createdAt).toLocaleString('en-IN') : 'N/A'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 text-xs mt-2">
              <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-muted-foreground uppercase">Type</span>
                  <span className="font-bold text-foreground capitalize">{selectedRec.type} Recommendation</span>
                </div>
                {selectedRec.region && (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-muted-foreground uppercase">Region / Focus</span>
                    <span className="font-bold text-foreground">{selectedRec.region}</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-muted/40 rounded-lg border space-y-2">
                <span className="font-bold text-muted-foreground uppercase block mb-1">Submitted By</span>
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <User className="size-3.5 text-muted-foreground" /> {selectedRec.name}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-mono">
                  <Phone className="size-3.5 text-muted-foreground" /> {selectedRec.phone}
                </div>
                {selectedRec.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-3.5 text-muted-foreground" /> {selectedRec.email}
                  </div>
                )}
              </div>

              {selectedRec.reason && (
                <div className="p-3 bg-muted/40 rounded-lg border">
                  <span className="font-bold text-muted-foreground uppercase block mb-1">Reason / User Notes</span>
                  <p className="text-foreground leading-relaxed italic">{selectedRec.reason}</p>
                </div>
              )}

              {/* Status Update Action */}
              <div className="pt-2 border-t">
                <label className="font-bold text-ink-strong block mb-1.5">Update Recommendation Status</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['new', 'reviewed', 'planned', 'archived'].map((st) => (
                    <button
                      key={st}
                      disabled={updating}
                      onClick={() => handleUpdateStatus(selectedRec._id || selectedRec.id, st)}
                      className={`py-1.5 px-2 rounded-md font-bold capitalize text-xs transition-all border ${
                        (selectedRec.status || 'new') === st
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-muted text-muted-foreground border-rule hover:bg-muted/80'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
