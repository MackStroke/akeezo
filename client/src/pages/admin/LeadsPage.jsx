import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Search,
  MoreHorizontal,
  Loader2,
  Trash2,
  CheckCircle,
  Stethoscope,
  Ambulance,
  HouseHeart,
  Layers,
  Eye,
  Pencil,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const INITIAL_MOCK_LEADS = [
  {
    id: 'lead_101',
    name: 'Amina Mohamed',
    email: 'amina.m@example.com',
    phone: '+254 712 345678',
    intent: 'medical_tourism',
    type: 'Plan Treatment',
    treatment: 'Cardiology / CABG Surgery',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'lead_102',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.m@example.com',
    phone: '+971 50 9876543',
    intent: 'emergency',
    type: 'Emergency Help',
    urgency: 'emergency',
    treatment: 'Acute Respiratory Distress',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'lead_103',
    name: 'Rajesh Sharma',
    email: 'rajesh.s@example.com',
    phone: '+91 98765 43210',
    intent: 'home_healthcare',
    type: 'Home Healthcare',
    treatment: 'Post-Operative Nurse & Physiotherapy',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'lead_104',
    name: 'Grace Musyoka',
    email: 'grace.m@example.com',
    phone: '+254 722 112233',
    intent: 'medical_tourism',
    type: 'Plan Treatment',
    treatment: 'Orthopedic Knee Replacement',
    status: 'Qualified',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'lead_105',
    name: 'Farooq Siddiqui',
    email: 'farooq.s@example.com',
    phone: '+966 55 4433221',
    intent: 'home_healthcare',
    type: 'Home Healthcare',
    treatment: 'Elderly Caregiver Support',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

const isMatchingCategory = (lead, category) => {
  if (!category || category === 'all') return true;

  const intent = (lead.intent || lead.type || '').toLowerCase();
  const urgency = (lead.urgency || '').toLowerCase();

  if (category === 'plan') {
    return (
      intent.includes('plan') ||
      intent.includes('medical_tourism') ||
      intent.includes('treatment') ||
      intent.includes('second_opinion') ||
      intent.includes('consultation') ||
      intent.includes('diagnosis') ||
      (!intent.includes('emergency') && !intent.includes('home'))
    );
  }

  if (category === 'emergency') {
    return (
      intent.includes('emergency') ||
      urgency === 'emergency'
    );
  }

  if (category === 'home') {
    return (
      intent.includes('home') ||
      intent.includes('caregiver') ||
      intent.includes('nurse')
    );
  }

  return true;
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState([]);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`/api/admin/leads?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store',
            Pragma: 'no-cache',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setLeads(data.data || []);
        } else {
          setLeads([]);
        }
      } catch (err) {
        console.error(err);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();

    // Auto-refresh when tab gains focus or on 10s poll
    const handleFocus = () => fetchLeads();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(fetchLeads, 10000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const categoryCounts = {
    all: leads.filter(l => l.status !== 'Deleted').length,
    plan: leads.filter(l => l.status !== 'Deleted' && isMatchingCategory(l, 'plan')).length,
    emergency: leads.filter(l => l.status !== 'Deleted' && isMatchingCategory(l, 'emergency')).length,
    home: leads.filter(l => l.status !== 'Deleted' && isMatchingCategory(l, 'home')).length,
  };

  const filteredLeads = leads
    .filter(lead => 
      lead.status !== 'Deleted' &&
      isMatchingCategory(lead, categoryFilter) &&
      ((lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || lead.status === statusFilter || (!lead.status && statusFilter === 'New'))
    )
    .sort((a, b) => {
      const getVal = (lead) => {
        if (sortField === 'date') return new Date(lead.createdAt || lead.date).getTime();
        if (sortField === 'type') return (lead.intent || lead.type || '').toLowerCase();
        return (lead[sortField] || '').toLowerCase();
      };
      
      const aVal = getVal(a);
      const bVal = getVal(b);
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l._id || l.id));
    }
  };

  const toggleSelectLead = (id) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(lId => lId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  const handleBulkAction = async (action, ids) => {
    const targets = ids || selectedLeads;
    if (!targets.length) return;
    const token = localStorage.getItem('adminToken');
    
    try {
      setLoading(true);
      await Promise.all(targets.map(id => {
        if (action === 'deleted') {
          return fetch(`/api/admin/leads/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          return fetch(`/api/admin/leads/${id}`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ status: 'contacted' })
          });
        }
      }));
      
      setSelectedLeads([]);
      const res = await fetch('/api/admin/leads', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setLeads(data.data || []);
      setSelectedLeads([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink-strong">Leads Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage inbound medical inquiries from the hero intake widget.</p>
        </div>
        <div className="flex gap-2">
          {selectedLeads.length > 0 && (
            <>
              <Button 
                variant="outline" 
                className="gap-2 shadow-sm font-bold text-emergency hover:text-emergency hover:bg-emergency-surface"
                onClick={() => handleBulkAction('deleted')}
              >
                <Trash2 className="size-4" /> Delete ({selectedLeads.length})
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 shadow-sm font-bold"
                onClick={() => handleBulkAction('contacted')}
              >
                <CheckCircle className="size-4" /> Mark Contacted
              </Button>
            </>
          )}
          <Button variant="outline" className="gap-2 shadow-sm font-bold">
            <Download className="size-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Category Intent Filter / Chip Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            id: 'all',
            label: 'All Leads',
            desc: 'Total Inbound Requests',
            icon: Layers,
            count: categoryCounts.all,
            color: 'text-primary bg-primary/10',
          },
          {
            id: 'plan',
            label: 'Plan Treatment',
            desc: 'Medical Tourism & Surgery',
            icon: Stethoscope,
            count: categoryCounts.plan,
            color: 'text-sky-600 bg-sky-100 dark:text-sky-400 dark:bg-sky-950/60',
          },
          {
            id: 'emergency',
            label: 'Emergency Help',
            desc: 'Critical Intake & Urgent Desk',
            icon: Ambulance,
            count: categoryCounts.emergency,
            color: 'text-emergency bg-emergency-surface dark:bg-emergency-surface/80',
          },
          {
            id: 'home',
            label: 'Home Healthcare',
            desc: 'Nurse, Doctor & Caregiver',
            icon: HouseHeart,
            count: categoryCounts.home,
            color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/60',
          },
        ].map((chip) => {
          const Icon = chip.icon;
          const isActive = categoryFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setCategoryFilter(chip.id)}
              className={cn(
                'flex flex-col justify-between p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'border-primary bg-card shadow-widget ring-2 ring-primary/30'
                  : 'border-border bg-card hover:border-primary/40 hover:shadow-card hover:-translate-y-0.5',
              )}
            >
              <div className="flex items-center justify-between gap-2 w-full mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={cn('p-2 rounded-xl shrink-0', chip.color)}>
                    <Icon className="size-5" />
                  </div>
                  <span className="font-extrabold text-sm text-ink-strong">{chip.label}</span>
                </div>
                <Badge
                  variant={isActive ? 'default' : 'secondary'}
                  className={cn(
                    'font-mono font-bold text-xs px-2.5 py-0.5 rounded-full',
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {chip.count}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium">{chip.desc}</p>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-ink-strong flex items-center gap-2">
                <span>Leads Directory</span>
                {categoryFilter !== 'all' && (
                  <Badge variant="outline" className="capitalize text-xs border-primary text-primary font-bold">
                    Filter: {categoryFilter.replace('_', ' ')}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>View, filter, and track leads in the system.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 w-full bg-background"
                />
              </div>
              <select 
                className="h-9 px-3 py-1 text-sm bg-background border rounded-md font-medium text-foreground outline-none focus:ring-2 focus:ring-primary appearance-none pr-8"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 font-bold text-muted-foreground">
                <tr className="border-b">
                  <th className="h-11 px-6 w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-input text-primary focus:ring-primary"
                      checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="h-11 px-2 cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('name')}>
                    Name / Contact {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="h-11 px-6 cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('type')}>
                    Journey Category {sortField === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="h-11 px-6 cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('status')}>
                    Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="h-11 px-6 cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('date')}>
                    Date Received {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="h-11 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="h-32 text-center">
                      <Loader2 className="size-6 animate-spin text-primary mx-auto" />
                    </td>
                  </tr>
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {
                    const id = lead._id || lead.id;
                    const isSelected = selectedLeads.includes(id);
                    return (
                      <tr key={id} className={`border-b transition-colors hover:bg-muted/30 ${isSelected ? 'bg-primary/5' : ''}`}>
                        <td className="px-6 py-4 align-middle">
                          <input 
                            type="checkbox" 
                            className="rounded border-input text-primary focus:ring-primary"
                            checked={isSelected}
                            onChange={() => toggleSelectLead(id)}
                          />
                        </td>
                        <td className="px-2 py-4 align-middle">
                          <Link to={`/admin/leads/${id}`} className="font-bold text-primary hover:underline">{lead.name || 'Anonymous User'}</Link>
                          <div className="text-muted-foreground mt-0.5 text-xs">{lead.email || lead.phone || '-'}</div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="font-semibold text-ink-strong capitalize">{lead.type || lead.intent?.replace('_', ' ') || 'General'}</div>
                          {lead.treatment && <div className="text-muted-foreground mt-0.5 text-xs line-clamp-1 max-w-[200px]">{lead.treatment}</div>}
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <Badge variant="secondary" className={`font-bold ${
                            lead.status === 'New' || !lead.status ? 'bg-primary/10 text-primary hover:bg-primary/20' :
                            lead.status === 'Contacted' ? 'bg-navy/10 text-navy hover:bg-navy/20' :
                            ''
                          }`}>
                            {lead.status || 'New'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 align-middle font-medium text-muted-foreground">
                          {new Date(lead.createdAt || lead.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center justify-end gap-1">
                          {/* View */}
                          <Button variant="ghost" size="icon" asChild className="size-8 text-muted-foreground hover:text-primary">
                            <Link to={`/admin/leads/${id}`} title="View lead">
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                          {/* Edit */}
                          <Button variant="ghost" size="icon" asChild className="size-8 text-muted-foreground hover:text-primary">
                            <Link to={`/admin/leads/${id}`} title="Edit lead">
                              <Pencil className="size-3.5" />
                            </Link>
                          </Button>
                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            title="Delete lead"
                            onClick={() => handleBulkAction('deleted', [id])}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="h-32 text-center text-muted-foreground">
                      No leads found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
