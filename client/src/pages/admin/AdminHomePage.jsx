import { useState, useEffect } from 'react';
import { Save, Plus, X, GripVertical, Home } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '../../components/SEO';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';

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

export default function AdminHomePage() {
  const [homeContent, setHomeContent] = useState({
    whyUsTitle: 'Why Us',
    whyUsDescription: 'Akeezo is your trusted home care partner...',
    whyUsCards: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.ok && data.data && data.data.homeContent) {
        setHomeContent(data.data.homeContent);
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      const payload = {
        homeContent
      };

      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Home page content updated successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCardChange = (id, field, value) => {
    setHomeContent(prev => ({
      ...prev,
      whyUsCards: prev.whyUsCards.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const handleAddCard = () => {
    setHomeContent(prev => ({
      ...prev,
      whyUsCards: [...(prev.whyUsCards || []), { id: crypto.randomUUID(), text: '', svgContent: '' }]
    }));
  };

  const handleRemoveCard = (id) => {
    setHomeContent(prev => ({
      ...prev,
      whyUsCards: prev.whyUsCards.filter(c => c.id !== id)
    }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setHomeContent(prev => {
        const oldIndex = prev.whyUsCards.findIndex(c => c.id === active.id);
        const newIndex = prev.whyUsCards.findIndex(c => c.id === over.id);
        return {
          ...prev,
          whyUsCards: arrayMove(prev.whyUsCards, oldIndex, newIndex)
        };
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <SEO title="Home Page Config - Admin" noindex={true} />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-ink-strong tracking-tight flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Home className="size-6" />
            </div>
            Home Page Content
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage sections and text for the main landing page.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? <span className="animate-spin text-lg block">↻</span> : <Save className="size-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Why Us Main Header */}
        <div className="bg-card border rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-ink-strong">Why Us Section</h2>
            <p className="text-sm text-muted-foreground">Configure the main title and description.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={homeContent.whyUsTitle || ''} 
                onChange={(e) => setHomeContent({...homeContent, whyUsTitle: e.target.value})} 
                placeholder="Why Us"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={homeContent.whyUsDescription || ''} 
                onChange={(e) => setHomeContent({...homeContent, whyUsDescription: e.target.value})} 
                placeholder="Akeezo is your trusted home care partner..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Why Us Cards List */}
        <div className="bg-card border rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-ink-strong">Why Us Cards</h2>
              <p className="text-sm text-muted-foreground">Add features with SVG icons and text.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddCard} className="gap-1 text-primary border-primary/20 hover:bg-primary/5">
              <Plus className="size-3.5" />
              Add Card
            </Button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={(homeContent.whyUsCards || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4 mt-4">
                {(homeContent.whyUsCards || []).length === 0 && (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-xl">
                    No cards added yet.
                  </div>
                )}
                {(homeContent.whyUsCards || []).map((card, index) => (
                  <SortableCard 
                    key={card.id}
                    card={card}
                    index={index}
                    onChange={handleCardChange}
                    onRemove={handleRemoveCard}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

      </div>
    </div>
  );
}

function SortableCard({ card, index, onChange, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`p-4 border rounded-xl flex gap-4 bg-muted/20 relative ${isDragging ? 'opacity-70 shadow-md border-primary' : ''}`}>
      <div {...attributes} {...listeners} className="cursor-grab hover:text-primary text-muted-foreground p-1 rounded hover:bg-muted active:cursor-grabbing shrink-0 flex items-start pt-2">
        <GripVertical className="size-5" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-primary">Feature Card #{index + 1}</Label>
          <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => onRemove(card.id)}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Text</Label>
          <Textarea 
            value={card.text || ''} 
            onChange={(e) => onChange(card.id, 'text', e.target.value)} 
            placeholder="Feature description..."
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">SVG Icon Code</Label>
          <Textarea 
            value={card.svgContent || ''} 
            onChange={(e) => onChange(card.id, 'svgContent', e.target.value)} 
            placeholder="<svg>...</svg>"
            className="font-mono text-xs text-muted-foreground bg-slate-900 dark:bg-slate-950"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
