import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Search, MoreHorizontal, Filter, Loader2, Trash, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState([]);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/leads', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLeads(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredLeads = leads
    .filter(lead => 
      lead.status !== 'Deleted' &&
      ((lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
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

  const handleBulkAction = async (action) => {
    if (!selectedLeads.length) return;
    const token = localStorage.getItem('adminToken');
    
    // In a real app we'd have a specific bulk API, but here we can loop or do a basic patch
    try {
      setLoading(true);
      await Promise.all(selectedLeads.map(id => {
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
          <p className="text-muted-foreground mt-1">Review and manage inbound medical inquiries.</p>
        </div>
        <div className="flex gap-2">
          {selectedLeads.length > 0 && (
            <>
              <Button 
                variant="outline" 
                className="gap-2 shadow-sm font-bold text-emergency hover:text-emergency hover:bg-emergency-surface"
                onClick={() => handleBulkAction('deleted')}
              >
                <Trash className="size-4" /> Delete ({selectedLeads.length})
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

      <Card>
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Leads</CardTitle>
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
                    Type {sortField === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                          <div className="font-semibold text-ink-strong capitalize">{lead.intent?.replace('_', ' ') || lead.type || 'General'}</div>
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
                        <td className="px-6 py-4 align-middle text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/leads/${id}`}>
                              <MoreHorizontal className="size-4" />
                            </Link>
                          </Button>
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
