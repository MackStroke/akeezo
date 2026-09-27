import { useState, useEffect } from 'react';
import { Save, Plus, X, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '../../components/SEO';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

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

export default function AdminFormsConfigPage() {
  const [formData, setFormData] = useState({
    planTreatments: [],
    planTimelines: [],
    homeServices: [],
    homeDurations: [],
    emergencyPlaceTypes: [],
    emergencyProblems: [],
    medicinesNeedTypes: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('plan');

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
      if (data.ok && data.data) {
        // Map strings to objects with stable IDs for dnd-kit
        const mapToIdObj = (arr) => (arr || []).map((val) => ({ id: crypto.randomUUID(), value: val }));
        
        // planTreatments is already an array of objects {id, label, icon}, we just map it for dnd-kit internal id and to avoid mutating
        const mappedTreatments = (data.data.planTreatments || []).map(t => ({
           id: crypto.randomUUID(),
           treatmentId: t.id,
           label: t.label,
           icon: t.icon
        }));

        setFormData({
          planTreatments: mappedTreatments,
          planTimelines: mapToIdObj(data.data.planTimelines),
          homeServices: mapToIdObj(data.data.homeServices),
          homeDurations: mapToIdObj(data.data.homeDurations),
          emergencyPlaceTypes: mapToIdObj(data.data.emergencyPlaceTypes),
          emergencyProblems: mapToIdObj(data.data.emergencyProblems),
          medicinesNeedTypes: mapToIdObj(data.data.medicinesNeedTypes)
        });
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
        planTreatments: formData.planTreatments.map(t => ({ id: t.treatmentId, label: t.label, icon: t.icon })),
        planTimelines: formData.planTimelines.map(i => i.value),
        homeServices: formData.homeServices.map(i => i.value),
        homeDurations: formData.homeDurations.map(i => i.value),
        emergencyPlaceTypes: formData.emergencyPlaceTypes.map(i => i.value),
        emergencyProblems: formData.emergencyProblems.map(i => i.value),
        medicinesNeedTypes: formData.medicinesNeedTypes.map(i => i.value)
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
        toast.success('Form dropdowns updated successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArrayChange = (key, id, newValue) => {
    const newArray = formData[key].map(item => item.id === id ? { ...item, value: newValue } : item);
    setFormData({ ...formData, [key]: newArray });
  };

  const handleTreatmentChange = (id, field, newValue) => {
    const newArray = formData.planTreatments.map(item => item.id === id ? { ...item, [field]: newValue } : item);
    setFormData({ ...formData, planTreatments: newArray });
  };

  const handleAddArrayItem = (key, defaultVal = 'New Option') => {
    if (key === 'planTreatments') {
      setFormData({
        ...formData,
        planTreatments: [...formData.planTreatments, { id: crypto.randomUUID(), treatmentId: 'new-id', label: 'New Treatment', icon: 'stethoscope' }]
      });
      return;
    }
    setFormData({
      ...formData,
      [key]: [...formData[key], { id: crypto.randomUUID(), value: defaultVal }]
    });
  };

  const handleRemoveArrayItem = (key, id) => {
    setFormData({
      ...formData,
      [key]: formData[key].filter(item => item.id !== id)
    });
  };

  const handleDragEnd = (key, event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFormData((prev) => {
        const items = prev[key];
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return {
          ...prev,
          [key]: arrayMove(items, oldIndex, newIndex)
        };
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex justify-center py-20">
        <div className="animate-spin text-primary size-8 border-4 border-current border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <SEO title="Form Dropdowns Config - Admin" noindex={true} />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-ink-strong tracking-tight">Form Dropdowns</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage dropdown options for search widget forms</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? <span className="animate-spin block">?</span> : <Save className="size-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-muted/40 p-1 w-full flex overflow-x-auto justify-start border border-rule">
          <TabsTrigger value="plan" className="flex-1 min-w-[120px]">Plan Treatment</TabsTrigger>
          <TabsTrigger value="home" className="flex-1 min-w-[120px]">Home Healthcare</TabsTrigger>
          <TabsTrigger value="emergency" className="flex-1 min-w-[120px]">Emergency Help</TabsTrigger>
          <TabsTrigger value="medicines" className="flex-1 min-w-[120px]">Medicines & Supplements</TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="space-y-6 mt-0 outline-none">
          <TreatmentEditor
            title="Treatments / Specialties"
            description="Options for the 'Type of treatment' dropdown in the Plan tab. These also appear on the landing page grid."
            items={formData.planTreatments}
            onChange={handleTreatmentChange}
            onAdd={() => handleAddArrayItem('planTreatments')}
            onRemove={(id) => handleRemoveArrayItem('planTreatments', id)}
            onDragEnd={(e) => handleDragEnd('planTreatments', e)}
          />
          <ArrayEditor
            title="Preferred Timeline"
            description="Options for the 'Preferred timeline' dropdown."
            items={formData.planTimelines}
            onChange={(id, val) => handleArrayChange('planTimelines', id, val)}
            onAdd={() => handleAddArrayItem('planTimelines')}
            onRemove={(id) => handleRemoveArrayItem('planTimelines', id)}
            onDragEnd={(e) => handleDragEnd('planTimelines', e)}
          />
        </TabsContent>

        <TabsContent value="home" className="space-y-6 mt-0 outline-none">
          <ArrayEditor
            title="Home Healthcare Services"
            description="Options for the 'Who do you need?' dropdown."
            items={formData.homeServices}
            onChange={(id, val) => handleArrayChange('homeServices', id, val)}
            onAdd={() => handleAddArrayItem('homeServices')}
            onRemove={(id) => handleRemoveArrayItem('homeServices', id)}
            onDragEnd={(e) => handleDragEnd('homeServices', e)}
          />
          <ArrayEditor
            title="Care Duration"
            description="Options for the 'For how long?' dropdown."
            items={formData.homeDurations}
            onChange={(id, val) => handleArrayChange('homeDurations', id, val)}
            onAdd={() => handleAddArrayItem('homeDurations')}
            onRemove={(id) => handleRemoveArrayItem('homeDurations', id)}
            onDragEnd={(e) => handleDragEnd('homeDurations', e)}
          />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6 mt-0 outline-none">
          <ArrayEditor
            title="Emergency Place Types"
            description="Options for the 'Where is the patient?' dropdown."
            items={formData.emergencyPlaceTypes}
            onChange={(id, val) => handleArrayChange('emergencyPlaceTypes', id, val)}
            onAdd={() => handleAddArrayItem('emergencyPlaceTypes')}
            onRemove={(id) => handleRemoveArrayItem('emergencyPlaceTypes', id)}
            onDragEnd={(e) => handleDragEnd('emergencyPlaceTypes', e)}
          />
          <ArrayEditor
            title="Emergency Problems"
            description="Options for the 'What happened?' dropdown."
            items={formData.emergencyProblems}
            onChange={(id, val) => handleArrayChange('emergencyProblems', id, val)}
            onAdd={() => handleAddArrayItem('emergencyProblems')}
            onRemove={(id) => handleRemoveArrayItem('emergencyProblems', id)}
            onDragEnd={(e) => handleDragEnd('emergencyProblems', e)}
          />
        </TabsContent>

        <TabsContent value="medicines" className="space-y-6 mt-0 outline-none">
          <ArrayEditor
            title="What you Need?"
            description="Options for the need type dropdown."
            items={formData.medicinesNeedTypes}
            onChange={(id, val) => handleArrayChange('medicinesNeedTypes', id, val)}
            onAdd={() => handleAddArrayItem('medicinesNeedTypes')}
            onRemove={(id) => handleRemoveArrayItem('medicinesNeedTypes', id)}
            onDragEnd={(e) => handleDragEnd('medicinesNeedTypes', e)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ArrayEditor({ title, description, items, onChange, onAdd, onRemove, onDragEnd }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="bg-card border rounded-xl shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-ink-strong">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext 
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <SortableItem 
                key={item.id} 
                item={item} 
                onChange={onChange} 
                onRemove={onRemove} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={onAdd} className="w-full gap-2 border-dashed">
        <Plus className="size-4" /> Add Option
      </Button>
    </div>
  );
}

function SortableItem({ item, onChange, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex gap-2 items-center bg-card rounded-md ${isDragging ? 'opacity-70 shadow-md border-primary' : ''}`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab hover:text-primary text-muted-foreground p-1 rounded hover:bg-muted active:cursor-grabbing shrink-0"
      >
        <GripVertical className="size-4" />
      </div>
      <Input
        value={item.value}
        onChange={(e) => onChange(item.id, e.target.value)}
        placeholder="Dropdown item label..."
        className="flex-1"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        className="text-muted-foreground hover:text-destructive shrink-0"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}


function TreatmentEditor({ title, description, items, onChange, onAdd, onRemove, onDragEnd }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="bg-card border rounded-xl shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-ink-strong">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-12 gap-2 px-8 mb-2">
        <div className="col-span-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">ID Key</div>
        <div className="col-span-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Label</div>
        <div className="col-span-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Lucide Icon</div>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext 
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <SortableTreatmentItem 
                key={item.id} 
                item={item} 
                onChange={onChange} 
                onRemove={onRemove} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={onAdd} className="w-full gap-2 border-dashed">
        <Plus className="size-4" /> Add Treatment
      </Button>
    </div>
  );
}

function SortableTreatmentItem({ item, onChange, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex gap-2 items-center bg-card rounded-md ${isDragging ? 'opacity-70 shadow-md border-primary' : ''}`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab hover:text-primary text-muted-foreground p-1 rounded hover:bg-muted active:cursor-grabbing shrink-0"
      >
        <GripVertical className="size-4" />
      </div>
      <div className="grid grid-cols-12 gap-2 flex-1">
        <Input
          value={item.treatmentId}
          onChange={(e) => onChange(item.id, 'treatmentId', e.target.value)}
          placeholder="e.g. cardiac"
          className="col-span-3 bg-muted/30"
        />
        <Input
          value={item.label}
          onChange={(e) => onChange(item.id, 'label', e.target.value)}
          placeholder="e.g. Cardiac care"
          className="col-span-6"
        />
        <Input
          value={item.icon}
          onChange={(e) => onChange(item.id, 'icon', e.target.value)}
          placeholder="e.g. heart"
          className="col-span-3 bg-muted/30"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        className="text-muted-foreground hover:text-destructive shrink-0"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
