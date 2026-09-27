import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Trash2, Plus, Loader2, Save, Eye, CheckCircle2, AlertCircle, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function AdminMedicinesPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Page Configuration State
  const [config, setConfig] = useState({
    heroTitle: 'Medicines & Supplements',
    heroSubtitle: '',
    banners: [],
    offers: []
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const [leadsRes, configRes] = await Promise.all([
        fetch('/api/admin/leads', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/config', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        // Filter out only the medicine leads
        setLeads((data.data || []).filter(lead => lead.intent === 'medicines'));
      }
      if (configRes.ok) {
        const data = await configRes.json();
        if (data.data?.medicinesContent) {
          setConfig(data.data.medicinesContent);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    setSaveMessage(null);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ medicinesContent: config })
      });
      if (res.ok) {
        setSaveMessage({ type: 'success', text: 'Page configuration saved successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', text: 'Failed to save configuration.' });
      }
    } catch (err) {
      setSaveMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const addOffer = () => {
    setConfig(prev => ({
      ...prev,
      offers: [...prev.offers, { id: Date.now().toString(), title: '', description: '', code: '', active: true }]
    }));
  };

  const updateOffer = (id, field, value) => {
    setConfig(prev => ({
      ...prev,
      offers: prev.offers.map(o => o.id === id ? { ...o, [field]: value } : o)
    }));
  };

  const removeOffer = (id) => {
    setConfig(prev => ({ ...prev, offers: prev.offers.filter(o => o.id !== id) }));
  };

  const addBanner = () => {
    setConfig(prev => ({
      ...prev,
      banners: [...prev.banners, { id: Date.now().toString(), imageUrl: '', title: '', link: '', active: true }]
    }));
  };

  const updateBanner = (id, field, value) => {
    setConfig(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const removeBanner = (id) => {
    setConfig(prev => ({ ...prev, banners: prev.banners.filter(b => b.id !== id) }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEndBanner = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setConfig((prev) => {
        const oldIndex = prev.banners.findIndex((b) => b.id === active.id);
        const newIndex = prev.banners.findIndex((b) => b.id === over.id);
        return { ...prev, banners: arrayMove(prev.banners, oldIndex, newIndex) };
      });
    }
  };

  const handleDragEndOffer = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setConfig((prev) => {
        const oldIndex = prev.offers.findIndex((o) => o.id === active.id);
        const newIndex = prev.offers.findIndex((o) => o.id === over.id);
        return { ...prev, offers: arrayMove(prev.offers, oldIndex, newIndex) };
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Pill className="size-6" />
          </div>
          Medicine & Supplements
        </h1>
        <p className="text-muted-foreground mt-1">Manage medicine orders, prescriptions, and page content.</p>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="leads">Orders & Leads ({leads.length})</TabsTrigger>
          <TabsTrigger value="content">Page Content (Offers/Banners)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Customers requesting medicines or supplements.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 font-bold text-muted-foreground border-y">
                    <tr>
                      <th className="h-11 px-6">Customer</th>
                      <th className="h-11 px-6">Requirement</th>
                      <th className="h-11 px-6">Status</th>
                      <th className="h-11 px-6">Date</th>
                      <th className="h-11 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="h-32 text-center">
                          <Loader2 className="size-6 animate-spin text-primary mx-auto" />
                        </td>
                      </tr>
                    ) : leads.length > 0 ? (
                      leads.map((lead) => (
                        <tr key={lead._id || lead.id} className="border-b transition-colors hover:bg-muted/30">
                          <td className="px-6 py-4 align-middle">
                            <Link to={`/admin/leads/${lead._id || lead.id}`} className="font-bold text-primary hover:underline">
                              {lead.name || 'Anonymous User'}
                            </Link>
                            <div className="text-muted-foreground mt-0.5 text-xs">
                              {lead.phone || lead.email || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className="font-semibold text-ink-strong">{lead.treatment || 'Medicine'}</span>
                            {lead.prescriptionBase64 && (
                              <Badge variant="outline" className="ml-2 bg-primary/5 text-primary text-[10px]">
                                Prescription Attached
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <Badge variant="secondary" className="font-bold">
                              {lead.status || 'New'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 align-middle font-medium text-muted-foreground">
                            {new Date(lead.createdAt || lead.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 align-middle text-right">
                            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary">
                              <Link to={`/admin/leads/${lead._id || lead.id}`}>
                                <Eye className="size-4" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="h-32 text-center text-muted-foreground">
                          No medicine orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <div className="grid gap-6">
            
            {/* Header Content */}
            <Card>
              <CardHeader>
                <CardTitle>Page Hero Content</CardTitle>
                <CardDescription>Edit the main title and subtitle of the Medicines page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input 
                    value={config.heroTitle} 
                    onChange={e => setConfig({...config, heroTitle: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subtitle</Label>
                  <Input 
                    value={config.heroSubtitle} 
                    onChange={e => setConfig({...config, heroSubtitle: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Banners */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Banners</CardTitle>
                  <CardDescription>Add promotional banners to display at the top of the Medicines page.</CardDescription>
                </div>
                <Button onClick={addBanner} size="sm" variant="outline">
                  <Plus className="size-4 mr-1" /> Add Banner
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.banners.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-xl">
                    No banners configured.
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndBanner}>
                    <SortableContext items={config.banners.map(b => b.id)} strategy={verticalListSortingStrategy}>
                      {config.banners.map((banner, index) => (
                        <SortableBanner 
                          key={banner.id} 
                          banner={banner} 
                          index={index} 
                          updateBanner={updateBanner} 
                          removeBanner={removeBanner} 
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>

            {/* Offers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Special Offers</CardTitle>
                  <CardDescription>Manage coupon codes or special discounts shown to users.</CardDescription>
                </div>
                <Button onClick={addOffer} size="sm" variant="outline">
                  <Plus className="size-4 mr-1" /> Add Offer
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.offers.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-xl">
                    No offers configured.
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndOffer}>
                    <SortableContext items={config.offers.map(o => o.id)} strategy={verticalListSortingStrategy}>
                      {config.offers.map((offer, index) => (
                        <SortableOffer 
                          key={offer.id} 
                          offer={offer} 
                          index={index} 
                          updateOffer={updateOffer} 
                          removeOffer={removeOffer} 
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <Button onClick={handleSaveConfig} disabled={saving} className="bg-primary text-primary-foreground font-bold shadow-md">
                {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
                Save Changes
              </Button>
              {saveMessage && (
                <div className={`flex items-center gap-2 text-sm font-bold ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {saveMessage.type === 'success' ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
                  {saveMessage.text}
                </div>
              )}
            </div>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SortableBanner({ banner, index, updateBanner, removeBanner }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`p-4 border rounded-xl flex gap-4 bg-muted/20 relative ${isDragging ? 'opacity-70 shadow-md border-primary' : ''}`}>
      <div {...attributes} {...listeners} className="cursor-grab hover:text-primary text-muted-foreground p-1 rounded hover:bg-muted active:cursor-grabbing shrink-0 flex items-center">
        <GripVertical className="size-5" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-primary">Banner #{index + 1}</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Active</span>
            <Switch checked={banner.active} onCheckedChange={v => updateBanner(banner.id, 'active', v)} />
            <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 ml-2" onClick={() => removeBanner(banner.id)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Image URL</Label>
            <Input value={banner.imageUrl} onChange={e => updateBanner(banner.id, 'imageUrl', e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Link (Optional)</Label>
            <Input value={banner.link} onChange={e => updateBanner(banner.id, 'link', e.target.value)} placeholder="/hospitals" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Alt Text / Title</Label>
          <Input value={banner.title} onChange={e => updateBanner(banner.id, 'title', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function SortableOffer({ offer, index, updateOffer, removeOffer }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: offer.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`p-4 border rounded-xl flex gap-4 bg-muted/20 ${isDragging ? 'opacity-70 shadow-md border-primary' : ''}`}>
      <div {...attributes} {...listeners} className="cursor-grab hover:text-primary text-muted-foreground p-1 rounded hover:bg-muted active:cursor-grabbing shrink-0 flex items-center">
        <GripVertical className="size-5" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-primary">Offer #{index + 1}</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Active</span>
            <Switch checked={offer.active} onCheckedChange={v => updateOffer(offer.id, 'active', v)} />
            <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 ml-2" onClick={() => removeOffer(offer.id)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Offer Title</Label>
            <Input value={offer.title} onChange={e => updateOffer(offer.id, 'title', e.target.value)} placeholder="15% Off First Order" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Promo Code</Label>
            <Input value={offer.code} onChange={e => updateOffer(offer.id, 'code', e.target.value)} placeholder="AKZ15" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Description</Label>
          <Input value={offer.description} onChange={e => updateOffer(offer.id, 'description', e.target.value)} placeholder="Use code at checkout..." />
        </div>
      </div>
    </div>
  );
}
