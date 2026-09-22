import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Search, Loader2, Building2, MapPin, Pencil, Plus, Trash2, ArrowUpDown, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export default function AdminHospitalsPage() {
  const { token } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Sorting & Bulk Edit State
  const [selectedHospitals, setSelectedHospitals] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Edit/Add State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchHospitals = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      const res = await fetch(`/api/admin/hospitals?page=${pageNum}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        const data = json.data?.data || [];
        if (append) {
          setHospitals(prev => [...prev, ...data]);
        } else {
          setHospitals(data);
        }
        setHasMore(data.length === 50);
      }
    } catch (err) {
      console.error('Failed to fetch hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals(1);
  }, []);

  const handleUpdate = async (id, updateData) => {
    try {
      setHospitals(prev => prev.map(h => h._id === id ? { ...h, ...updateData } : h));
      
      await fetch(`/api/admin/hospitals/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });
    } catch (err) {
      console.error('Failed to update hospital:', err);
      fetchHospitals(page);
    }
  };

  const handleSaveForm = async () => {
    if (editingHospital?._id) {
      await handleUpdate(editingHospital._id, formData);
    } else {
      // POST new hospital (mocking it for now if backend doesn't support POST yet, or we assume PATCH/POST)
      // Since backend only has PATCH right now, we will just simulate or require adding POST to backend.
      // We will only do edit for now if POST is not there, but let's implement Edit properly.
      try {
        const res = await fetch(`/api/admin/hospitals`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          fetchHospitals(1);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setEditDialogOpen(false);
  };

  const openEdit = (hospital = null) => {
    setEditingHospital(hospital);
    setFormData(hospital ? { ...hospital } : { 
      name: '', city: '', stateRegion: '', type: 'Multi-Specialty', bedCapacity: '', partnerTier: 'standard', isActive: true 
    });
    setEditDialogOpen(true);
  };

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const res = await fetch('/api/admin/hospitals/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ csvData: text }),
      });
      if (res.ok) {
        alert('CSV Imported Successfully!');
        fetchHospitals(1);
      } else {
        const json = await res.json();
        alert('Failed to import CSV: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading CSV');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };


  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleSelectAll = () => {
    if (selectedHospitals.size === filteredHospitals.length && filteredHospitals.length > 0) {
      setSelectedHospitals(new Set());
    } else {
      setSelectedHospitals(new Set(filteredHospitals.map(h => h._id)));
    }
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedHospitals);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedHospitals(newSelected);
  };

  const handleBulkUpdate = async (updates) => {
    if (selectedHospitals.size === 0) return;
    setBulkActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await Promise.all(
        Array.from(selectedHospitals).map(id =>
          fetch(`/api/admin/hospitals/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          })
        )
      );
      setHospitals(hospitals.map(h => 
        selectedHospitals.has(h._id) ? { ...h, ...updates } : h
      ));
      toast.success(`Updated ${selectedHospitals.size} hospitals successfully.`);
      setSelectedHospitals(new Set());
    } catch (err) {
      console.error(err);
      toast.error('Failed to perform bulk update.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Sort hospitals based on config
  const sortedHospitals = [...hospitals].sort((a, b) => {
    let aVal = a[sortConfig.key] || '';
    let bVal = b[sortConfig.key] || '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredHospitals = sortedHospitals.filter(h => 
    (h.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.city || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-strong">Hospitals</h1>
          <p className="text-muted-foreground mt-1">
            Manage hospital listings, partner tiers, and website visibility.
          </p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button variant="outline" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
            {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Upload CSV
          </Button>
          <Button onClick={() => openEdit(null)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Hospital
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle>Hospital Directory</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or city..."
                className="pl-9 bg-background h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && !hospitals.length ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading hospitals...</p>
            </div>
          ) : (
          <div className="space-y-4">
          {selectedHospitals.size > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 px-5 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                <CheckSquare className="w-4 h-4" />
                {selectedHospitals.size} hospital{selectedHospitals.size > 1 ? 's' : ''} selected
              </div>
              <div className="flex items-center gap-3">
                <Select onValueChange={(val) => handleBulkUpdate({ partnerTier: val })} disabled={bulkActionLoading}>
                  <SelectTrigger className="h-8 w-[140px] bg-white text-xs font-semibold">
                    <SelectValue placeholder="Set Partner Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" className="h-8 bg-white text-green-700 hover:text-green-800 border-green-200 hover:bg-green-50" disabled={bulkActionLoading} onClick={() => handleBulkUpdate({ isActive: true })}>
                  Set Active
                </Button>
                <Button size="sm" variant="outline" className="h-8 bg-white text-amber-700 hover:text-amber-800 border-amber-200 hover:bg-amber-50" disabled={bulkActionLoading} onClick={() => handleBulkUpdate({ isActive: false })}>
                  Set Hidden
                </Button>
              </div>
            </div>
          )}
          
          {filteredHospitals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Building2 className="w-12 h-12 mb-4 opacity-20" />
              <p>No hospitals found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/50 text-muted-foreground uppercase font-bold text-[0.7rem] tracking-wider">
                  <tr>
                    <th className="px-6 py-4 w-12">
                      <Checkbox 
                        checked={filteredHospitals.length > 0 && selectedHospitals.size === filteredHospitals.length} 
                        onCheckedChange={toggleSelectAll} 
                      />
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">Hospital <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort('city')}>
                      <div className="flex items-center gap-1">Location <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort('type')}>
                      <div className="flex items-center gap-1">Type / Beds <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 font-medium cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort('partnerTier')}>
                      <div className="flex items-center gap-1">Partner Tier <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 font-medium text-center">Website</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredHospitals.map((hospital) => (
                    <tr key={hospital._id} className={cn("hover:bg-muted/30 transition-colors", selectedHospitals.has(hospital._id) && "bg-blue-50/50 hover:bg-blue-50/80")}>
                      <td className="px-6 py-4">
                        <Checkbox 
                          checked={selectedHospitals.has(hospital._id)} 
                          onCheckedChange={() => toggleSelect(hospital._id)} 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-ink-strong">{hospital.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 font-medium flex items-center gap-1">
                          ID: {hospital.hospitalId || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          {hospital.city}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 pl-5">
                          {hospital.stateRegion || 'India'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{hospital.type || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {hospital.bedCapacity ? `${hospital.bedCapacity} Beds` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Select 
                          value={hospital.partnerTier || 'standard'} 
                          onValueChange={(val) => handleUpdate(hospital._id, { partnerTier: val })}
                        >
                          <SelectTrigger className="h-8 w-28 text-xs font-semibold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="silver">Silver</SelectItem>
                            <SelectItem value="gold">Gold</SelectItem>
                            <SelectItem value="platinum">Platinum</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center flex-col gap-2">
                          <Switch 
                            checked={hospital.isActive} 
                            onCheckedChange={(checked) => handleUpdate(hospital._id, { isActive: checked })}
                          />
                          <Badge variant="outline" className={cn("text-[0.65rem] uppercase font-bold tracking-wider", hospital.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-muted text-muted-foreground")}>
                            {hospital.isActive ? 'Active' : 'Hidden'}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/admin/hospitals/${hospital._id}`}>Manage</Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild title="View Public Page">
                            <Link to={`/hospitals/${hospital.slug}`} target="_blank">
                              <Search className="w-4 h-4 text-muted-foreground" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hasMore && (
                <div className="p-4 flex justify-center border-t border-border">
                  <Button variant="outline" onClick={() => {
                    const next = page + 1;
                    setPage(next);
                    fetchHospitals(next, true);
                  }}>
                    Load More
                  </Button>
                </div>
              )}
            </div>
          )}
          </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHospital ? 'Edit Hospital' : 'Add Hospital'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={formData.name || ''} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Overview / Description</Label>
              <Textarea 
                id="description" 
                rows={4}
                value={formData.description || ''} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  value={formData.city || ''} 
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stateRegion">State/Region</Label>
                <Input 
                  id="stateRegion" 
                  value={formData.stateRegion || ''} 
                  onChange={(e) => setFormData({ ...formData, stateRegion: e.target.value })} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Input 
                  id="type" 
                  value={formData.type || ''} 
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bedCapacity">Bed Capacity</Label>
                <Input 
                  id="bedCapacity" 
                  type="number"
                  value={formData.bedCapacity || ''} 
                  onChange={(e) => setFormData({ ...formData, bedCapacity: e.target.value })} 
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="facilities">Facilities (Comma Separated)</Label>
              <Input 
                id="facilities" 
                value={Array.isArray(formData.facilities) ? formData.facilities.join(', ') : (formData.facilities || '')} 
                onChange={(e) => setFormData({ ...formData, facilities: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="specialties">Specialties (Comma Separated)</Label>
              <Input 
                id="specialties" 
                value={Array.isArray(formData.specialties) ? formData.specialties.join(', ') : (formData.specialties || '')} 
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
              />
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveForm}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
