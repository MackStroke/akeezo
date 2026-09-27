import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Package as PackageIcon, Pencil, Plus, Trash2, ArrowUpDown, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { exportCsv, PACKAGE_EXPORT, preparePackageRows } from '../../lib/exportCsv';
import { parseCsvFile } from '../../lib/importCsv';

export default function AdminPackagesPage() {
  const { token } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages?limit=100', {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      console.log('Fetched admin packages:', json);
      if (json.ok) {
        setPackages(json.data?.data || json.data || []);
      } else {
        toast.error('Failed to load packages');
      }
    } catch (err) {
      toast.error('Error loading packages');
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Package deleted');
        setPackages(prev => prev.filter(p => p._id !== id));
        setSelectedPackages(prev => prev.filter(pId => pId !== id));
      }
    } catch (err) {
      toast.error('Error deleting package');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedPackages.length} packages?`)) return;
    try {
      await Promise.all(selectedPackages.map(id => 
        fetch(`/api/admin/packages/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
      ));
      toast.success(`${selectedPackages.length} packages deleted`);
      setPackages(prev => prev.filter(p => !selectedPackages.includes(p._id)));
      setSelectedPackages([]);
    } catch (err) {
      toast.error('Error deleting packages');
    }
  };

  const handleExport = () => {
    const rows = selectedPackages.length > 0
      ? packages.filter(p => selectedPackages.includes(p._id))
      : packages;
      
    if (rows.length === 0) return toast.error('No packages to export');
    
    exportCsv(
      selectedPackages.length > 0 ? 'packages-selected' : 'packages-all',
      PACKAGE_EXPORT.headers,
      PACKAGE_EXPORT.keys,
      preparePackageRows(rows)
    );
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    try {
      const rows = await parseCsvFile(file);
      if (rows.length === 0) throw new Error('CSV is empty');
      
      let successCount = 0;
      let failCount = 0;
      
      for (const row of rows) {
        // Map CSV headers back to object keys
        const pkgData = {
          planId: row['Plan ID'],
          title: row['Title'],
          tagline: row['Tagline'] || '',
          monthlyPrice: Number(row['Monthly Price']) || 0,
          yearlyPrice: Number(row['Yearly Price']) || 0,
          yearlyDiscount: Number(row['Yearly Discount']) || 0,
          isActive: row['Status'] === 'Active',
          keyFeatures: row['Key Features'] ? row['Key Features'].split(' | ').filter(Boolean) : [],
          popularServices: row['Popular Services'] ? row['Popular Services'].split(' | ').filter(Boolean) : []
        };
        
        if (!pkgData.title || !pkgData.monthlyPrice) {
          failCount++;
          continue;
        }

        const res = await fetch('/api/admin/packages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(pkgData)
        });
        
        if (res.ok) successCount++;
        else failCount++;
      }
      
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} packages`);
        fetchPackages(); // Reload
      }
      if (failCount > 0) {
        toast.error(`Failed to import ${failCount} packages (missing fields or duplicates)`);
      }
      
    } catch (err) {
      toast.error(err.message || 'Error parsing CSV file');
    } finally {
      setIsImporting(false);
      e.target.value = ''; // reset file input
    }
  };

  const toggleSelectAll = () => {
    if (selectedPackages.length === filteredAndSortedPackages.length) {
      setSelectedPackages([]);
    } else {
      setSelectedPackages(filteredAndSortedPackages.map(p => p._id));
    }
  };

  const toggleSelectPackage = (id) => {
    if (selectedPackages.includes(id)) {
      setSelectedPackages(prev => prev.filter(pId => pId !== id));
    } else {
      setSelectedPackages(prev => [...prev, id]);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedPackages = packages
    .filter(pkg => 
      (pkg.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.planId || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Packages</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage health packages and plans.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {selectedPackages.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete} className="gap-2 shadow-sm font-bold">
              <Trash2 className="size-4" />
              Delete ({selectedPackages.length})
            </Button>
          )}
          
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImport}
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="gap-2 shadow-sm font-bold">
            {isImporting ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Import CSV
          </Button>
          
          <Button variant="outline" onClick={handleExport} className="gap-2 shadow-sm font-bold">
            <Download className="size-4" />
            {selectedPackages.length > 0 ? `Export Selected (${selectedPackages.length})` : 'Export All CSV'}
          </Button>

          <Button asChild className="gap-2 shadow-sm">
            <Link to="/admin/packages/new">
              <Plus className="size-4" />
              Add Package
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-xs bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
          <Input 
            placeholder="Search by title or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                    checked={filteredAndSortedPackages.length > 0 && selectedPackages.length === filteredAndSortedPackages.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 font-semibold cursor-pointer hover:text-foreground transition-colors group" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-1">Title <ArrowUpDown className="size-3 opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th className="px-4 py-3 font-semibold cursor-pointer hover:text-foreground transition-colors group" onClick={() => handleSort('planId')}>
                  <div className="flex items-center gap-1">Plan ID <ArrowUpDown className="size-3 opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th className="px-4 py-3 font-semibold cursor-pointer hover:text-foreground transition-colors group" onClick={() => handleSort('monthlyPrice')}>
                  <div className="flex items-center gap-1">Monthly <ArrowUpDown className="size-3 opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th className="px-4 py-3 font-semibold cursor-pointer hover:text-foreground transition-colors group" onClick={() => handleSort('yearlyPrice')}>
                  <div className="flex items-center gap-1">Yearly <ArrowUpDown className="size-3 opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th className="px-4 py-3 font-semibold cursor-pointer hover:text-foreground transition-colors group" onClick={() => handleSort('isActive')}>
                  <div className="flex items-center gap-1">Status <ArrowUpDown className="size-3 opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    <Loader2 className="size-6 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : filteredAndSortedPackages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground bg-muted/20">
                    No packages found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedPackages.map(pkg => {
                  const isSelected = selectedPackages.includes(pkg._id);
                  return (
                    <tr key={pkg._id} className={`hover:bg-muted/30 transition-colors group ${isSelected ? 'bg-primary/5' : ''}`}>
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleSelectPackage(pkg._id)}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <PackageIcon className="size-4 text-primary opacity-70" />
                          {pkg.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{pkg.planId}</td>
                      <td className="px-4 py-3 font-medium">₹{pkg.monthlyPrice}</td>
                      <td className="px-4 py-3 font-medium">₹{pkg.yearlyPrice}</td>
                      <td className="px-4 py-3">
                        {pkg.isActive ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20">Inactive</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2 transition-opacity">
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Link to={`/admin/packages/${pkg._id}`}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deletePackage(pkg._id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
