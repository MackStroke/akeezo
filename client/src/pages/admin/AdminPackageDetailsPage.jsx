import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import { useAuth } from '../../context/AuthContext';

export default function AdminPackageDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [pkg, setPkg] = useState({
    title: '',
    tagline: '',
    description: '',
    monthlyPrice: '',
    yearlyPrice: '',
    yearlyDiscount: '',
    color: '#4A90E2',
    lightColor: '#E8F4FD',
    isActive: true,
    isRecommended: false,
    sortOrder: 0,
    keyFeatures: [''],
    popularServices: [''],
    allServices: []
  });

  useEffect(() => {
    if (!isNew) {
      fetchPackage();
    }
  }, [id]);

  const fetchPackage = async () => {
    try {
      const res = await fetch(`/api/admin/packages?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok) {
        const found = data.data.data.find(p => p._id === id);
        if (found) {
          setPkg({
            ...found,
            keyFeatures: found.keyFeatures?.length ? found.keyFeatures : [''],
            popularServices: found.popularServices?.length ? found.popularServices : [''],
            allServices: found.allServices || []
          });
        } else {
          toast.error('Package not found');
          navigate('/admin/packages');
        }
      }
    } catch (err) {
      toast.error('Failed to load package');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const payload = {
        ...pkg,
        keyFeatures: pkg.keyFeatures.filter(f => f.trim()),
        popularServices: pkg.popularServices.filter(s => s.trim()),
      };

      const url = isNew ? '/api/admin/packages' : `/api/admin/packages/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.ok) {
        toast.success(isNew ? 'Package created successfully' : 'Package updated successfully');
        if (isNew) {
          navigate('/admin/packages');
        }
      } else {
        toast.error(data.error || 'Failed to save package');
      }
    } catch (err) {
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const updateArrayItem = (field, index, value) => {
    const newArr = [...pkg[field]];
    newArr[index] = value;
    setPkg({ ...pkg, [field]: newArr });
  };
  
  const addArrayItem = (field) => {
    setPkg({ ...pkg, [field]: [...pkg[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const newArr = [...pkg[field]];
    newArr.splice(index, 1);
    setPkg({ ...pkg, [field]: newArr });
  };

  const addService = () => {
    setPkg({
      ...pkg,
      allServices: [...pkg.allServices, { serviceName: '', description: '', included: true, additionalCharges: '' }]
    });
  };

  const updateService = (index, field, value) => {
    const newServices = [...pkg.allServices];
    newServices[index] = { ...newServices[index], [field]: value };
    setPkg({ ...pkg, allServices: newServices });
  };

  const removeService = (index) => {
    const newServices = [...pkg.allServices];
    newServices.splice(index, 1);
    setPkg({ ...pkg, allServices: newServices });
  };

  if (loading) {
    return <div className="p-12 text-center"><Loader2 className="size-8 animate-spin mx-auto text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto p-4 sm:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link to="/admin/packages">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{isNew ? 'Create New Package' : 'Edit Package'}</h1>
          <p className="text-sm text-muted-foreground">{pkg.planId || 'Draft'}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Package Title</Label>
                <Input value={pkg.title} onChange={e => setPkg({...pkg, title: e.target.value})} placeholder="e.g. Sparsh" />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input value={pkg.tagline} onChange={e => setPkg({...pkg, tagline: e.target.value})} placeholder="e.g. Basic Plan" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={pkg.description} onChange={e => setPkg({...pkg, description: e.target.value})} placeholder="Essential healthcare services..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Presentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Price (₹)</Label>
                  <Input type="number" value={pkg.monthlyPrice} onChange={e => setPkg({...pkg, monthlyPrice: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Yearly Price (₹)</Label>
                  <Input type="number" value={pkg.yearlyPrice} onChange={e => setPkg({...pkg, yearlyPrice: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Yearly Discount Amount (₹)</Label>
                  <Input type="number" value={pkg.yearlyDiscount} onChange={e => setPkg({...pkg, yearlyDiscount: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input type="number" value={pkg.sortOrder} onChange={e => setPkg({...pkg, sortOrder: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 p-1 h-9" value={pkg.color} onChange={e => setPkg({...pkg, color: e.target.value})} />
                    <Input value={pkg.color} onChange={e => setPkg({...pkg, color: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Light/Background Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 p-1 h-9" value={pkg.lightColor} onChange={e => setPkg({...pkg, lightColor: e.target.value})} />
                    <Input value={pkg.lightColor} onChange={e => setPkg({...pkg, lightColor: e.target.value})} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Services Detailed</CardTitle>
                  <CardDescription>Detailed service matrix for comparison.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addService}><Plus className="size-4 mr-2" />Add Service</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pkg.allServices.map((service, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 border border-border rounded-lg bg-muted/20 relative group">
                  <Button variant="ghost" size="icon" onClick={() => removeService(index)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive h-7 w-7">
                    <Trash2 className="size-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label className="text-xs">Service Name</Label>
                      <Input value={service.serviceName} onChange={e => updateService(index, 'serviceName', e.target.value)} placeholder="e.g. Doctor Home Visit" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Description (Limit/Freq)</Label>
                      <Input value={service.description} onChange={e => updateService(index, 'description', e.target.value)} placeholder="e.g. 1 complimentary visit/month" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Additional Charges</Label>
                      <Input value={service.additionalCharges} onChange={e => updateService(index, 'additionalCharges', e.target.value)} placeholder="e.g. Charges on Actual" />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <Checkbox id={`inc-${index}`} checked={service.included} onCheckedChange={c => updateService(index, 'included', c)} />
                      <Label htmlFor={`inc-${index}`}>Included in package</Label>
                    </div>
                  </div>
                </div>
              ))}
              {pkg.allServices.length === 0 && (
                <div className="text-center p-6 border border-dashed rounded-lg text-muted-foreground text-sm">
                  No detailed services added yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active Package</Label>
                  <p className="text-xs text-muted-foreground">Show this package on the website.</p>
                </div>
                <Switch checked={pkg.isActive} onCheckedChange={c => setPkg({...pkg, isActive: c})} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recommended Label</Label>
                  <p className="text-xs text-muted-foreground">Highlight as popular/recommended.</p>
                </div>
                <Switch checked={pkg.isRecommended} onCheckedChange={c => setPkg({...pkg, isRecommended: c})} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>Top highlights shown on the card.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pkg.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={feat} onChange={e => updateArrayItem('keyFeatures', i, e.target.value)} className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => removeArrayItem('keyFeatures', i)} className="text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addArrayItem('keyFeatures')} className="w-full mt-2">
                <Plus className="size-4 mr-2" /> Add Feature
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
              <CardDescription>Secondary list of services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pkg.popularServices.map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={feat} onChange={e => updateArrayItem('popularServices', i, e.target.value)} className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => removeArrayItem('popularServices', i)} className="text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addArrayItem('popularServices')} className="w-full mt-2">
                <Plus className="size-4 mr-2" /> Add Service
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
