import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Upload, ImageIcon, Star, X, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../context/AuthContext';

function TagsInput({ value = [], onChange, placeholder, suggestions = [] }) {
  const [inputValue, setInputValue] = useState('');
  const [listId] = useState(() => 'tags-' + Math.random().toString(36).substring(2, 9));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTags(inputValue);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    addTags(pastedText);
  };

  const addTags = (text) => {
    if (!text.trim()) return;
    const newTags = text.split(/[,;\n]+/).map(t => t.trim()).filter(Boolean);
    const uniqueTags = [...new Set([...(value || []), ...newTags])];
    onChange(uniqueTags);
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    onChange((value || []).filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-wrap gap-2">
        {(value || []).map((tag, idx) => (
          <Badge key={idx} variant="secondary" className="px-2.5 py-1 text-sm font-medium flex items-center gap-1.5 bg-muted">
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)} 
              className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </Badge>
        ))}
      </div>
      <Input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={() => addTags(inputValue)}
        placeholder={placeholder || "Type and press Enter or paste comma-separated values..."}
        className="mt-1"
        list={suggestions.length > 0 ? listId : undefined}
      />
      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.filter(s => !(value || []).includes(s)).map(s => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}

const PREDEFINED_FACILITIES = [
  "24/7 Emergency", "ICU", "Blood Bank", "Pharmacy", "Cafeteria", 
  "Ambulance Services", "Parking", "Wi-Fi", "ATM", "Waiting Lounge", 
  "Diagnostic Center", "NICU", "Operation Theaters", "MRI", "CT Scan", "Pathology Lab"
];

const PREDEFINED_SPECIALTIES = [
  "Cardiology", "Oncology", "Orthopedics", "Neurology", "Pediatrics", 
  "Gynecology", "Urology", "Gastroenterology", "Dermatology", "Ophthalmology", 
  "Psychiatry", "Pulmonology", "Endocrinology", "Nephrology", "ENT", "General Surgery", "Internal Medicine"
];

const PREDEFINED_COE = [
  "Heart Institute", "Cancer Care", "Orthopedics & Joint Replacement", 
  "Neurosciences", "Organ Transplant", "Women & Child Care", "Renal Sciences", 
  "Gastroenterology", "Emergency & Trauma", "Robotic Surgery"
];

const PREDEFINED_ACCREDITATIONS = [
  "NABH", "NABL", "JCI", "ISO 9001", "QAI", "CAP", "ACHS"
];

export default function AdminHospitalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHospital();
  }, [id]);

  const fetchHospital = async () => {
    try {
      const res = await fetch(`/api/admin/hospitals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setHospital(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/hospitals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(hospital)
      });
      if (res.ok) {
        alert('Hospital updated successfully!');
      } else {
        alert('Failed to update hospital');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating hospital');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setHospital(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (index, value) => {
    const val = parseFloat(value);
    setHospital(prev => {
      const coords = [...(prev.location?.coordinates || [0, 0])];
      coords[index] = isNaN(val) ? 0 : val;
      return {
        ...prev,
        location: {
          type: 'Point',
          coordinates: coords
        }
      };
    });
  };

  const updateArrayField = (field, csvValue) => {
    const arr = csvValue.split(',').map(s => s.trim()).filter(Boolean);
    updateField(field, arr);
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer?.files || e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1600;
          
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Auto-convert all uploaded images to webp to save bandwidth/DB space
          const webpDataUrl = canvas.toDataURL('image/webp', 0.85);
          
          setHospital(prev => ({
            ...prev,
            images: [
              ...(prev.images || []),
              { url: webpDataUrl, alt: file.name.replace(/\.[^/.]+$/, ''), category: 'gallery' }
            ]
          }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const setFeaturedImage = (targetIdx) => {
    const newImages = [...hospital.images].map((img, idx) => ({
      ...img,
      category: idx === targetIdx ? 'featured' : (img.category === 'featured' ? 'gallery' : img.category)
    }));
    updateField('images', newImages);
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!hospital) {
    return <div className="p-8 text-center">Hospital not found.</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/hospitals')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink-strong">{hospital.name || 'Edit Hospital'}</h1>
            <p className="text-sm text-muted-foreground">Manage hospital details, doctors, and services</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/hospitals/${hospital.slug}`} target="_blank">View Live Page</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="flex flex-wrap w-full max-w-4xl h-auto gap-2 p-1 bg-muted rounded-lg">
          <TabsTrigger value="basic" className="flex-1 min-w-[100px]">Basic Info</TabsTrigger>
          <TabsTrigger value="content" className="flex-1 min-w-[100px]">Content</TabsTrigger>
          <TabsTrigger value="doctors" className="flex-1 min-w-[100px]">Doctors</TabsTrigger>
          <TabsTrigger value="treatments" className="flex-1 min-w-[100px]">Treatments</TabsTrigger>
          <TabsTrigger value="location" className="flex-1 min-w-[100px]">Location</TabsTrigger>
          <TabsTrigger value="media" className="flex-1 min-w-[100px]">Media & Docs</TabsTrigger>
          <TabsTrigger value="internal" className="flex-1 min-w-[100px]">Internal</TabsTrigger>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Core Details</CardTitle>
              <CardDescription>Primary identification and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div>
                  <h4 className="font-semibold text-sm">Listing Status</h4>
                  <p className="text-xs text-muted-foreground">Toggle whether this hospital is visible to patients.</p>
                </div>
                <Switch 
                  checked={hospital.isActive} 
                  onCheckedChange={(val) => updateField('isActive', val)} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hospital Name</Label>
                  <Input value={hospital.name || ''} onChange={e => updateField('name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input value={hospital.slug || ''} onChange={e => updateField('slug', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input value={hospital.type || ''} onChange={e => updateField('type', e.target.value)} placeholder="e.g. Multi-Specialty" />
                </div>
                <div className="space-y-2">
                  <Label>Bed Capacity</Label>
                  <Input type="number" value={hospital.bedCapacity || ''} onChange={e => updateField('bedCapacity', parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Partner Tier</Label>
                  <Select value={hospital.partnerTier || 'standard'} onValueChange={v => updateField('partnerTier', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Experience Tier</Label>
                  <Select value={hospital.experienceTier || 'best_value'} onValueChange={v => updateField('experienceTier', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="best_value">Best Value</SelectItem>
                      <SelectItem value="best_medical">Best Medical</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>Main descriptive text and array lists displayed on the detail page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Overview / Description</Label>
                <Textarea 
                  rows={6}
                  value={hospital.description || ''} 
                  onChange={e => updateField('description', e.target.value)} 
                  placeholder="Comprehensive description of the hospital..."
                />
              </div>

              <div className="space-y-2">
                <Label>Facilities & Amenities</Label>
                <TagsInput 
                  value={hospital.facilities} 
                  onChange={tags => updateField('facilities', tags)} 
                  placeholder="Select or type (ICU, Pharmacy...)"
                  suggestions={PREDEFINED_FACILITIES}
                />
              </div>

              <div className="space-y-2">
                <Label>Specialties / Departments</Label>
                <TagsInput 
                  value={hospital.specialties} 
                  onChange={tags => updateField('specialties', tags)} 
                  placeholder="Select or type (Cardiology, Oncology...)"
                  suggestions={PREDEFINED_SPECIALTIES}
                />
              </div>

              <div className="space-y-2">
                <Label>Centers of Excellence</Label>
                <TagsInput 
                  value={hospital.centersOfExcellence} 
                  onChange={tags => updateField('centersOfExcellence', tags)} 
                  placeholder="Select or type (Heart Institute...)"
                  suggestions={PREDEFINED_COE}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg">Accreditations</Label>
                    <p className="text-sm text-muted-foreground">Manage hospital accreditations with logos</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    const current = Array.isArray(hospital.accreditations) ? hospital.accreditations : [];
                    updateField('accreditations', [...current, { name: '', logo: '' }]);
                  }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Accreditation
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(hospital.accreditations || []).map((acc, idx) => {
                    const accObj = typeof acc === 'string' ? { name: acc, logo: '' } : acc;
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/20 relative group">
                        {/* Logo Upload Box */}
                        <div className="relative w-16 h-16 rounded-md border-2 border-dashed bg-white flex items-center justify-center overflow-hidden shrink-0">
                          {accObj.logo ? (
                            <img src={accObj.logo} alt="logo" className="w-full h-full object-contain p-1" />
                          ) : (
                            <Award className="w-6 h-6 text-muted-foreground/40" />
                          )}
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const newAcc = [...hospital.accreditations];
                                if (typeof newAcc[idx] === 'string') newAcc[idx] = { name: newAcc[idx], logo: '' };
                                newAcc[idx].logo = ev.target.result;
                                updateField('accreditations', newAcc);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </div>

                        {/* Name Input */}
                        <div className="flex-1 space-y-2">
                          <Label className="text-xs">Accreditation Name</Label>
                          <Input 
                            value={accObj.name || ''} 
                            onChange={(e) => {
                              const newAcc = [...hospital.accreditations];
                              if (typeof newAcc[idx] === 'string') newAcc[idx] = { name: newAcc[idx], logo: '' };
                              newAcc[idx].name = e.target.value;
                              updateField('accreditations', newAcc);
                            }}
                            placeholder="e.g. NABH, JCI..."
                            list="acc-suggestions"
                          />
                        </div>

                        {/* Remove */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          onClick={() => {
                            const newAcc = [...hospital.accreditations];
                            newAcc.splice(idx, 1);
                            updateField('accreditations', newAcc);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                  <datalist id="acc-suggestions">
                    {PREDEFINED_ACCREDITATIONS.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Doctors Tab */}
        <TabsContent value="doctors" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Top Specialists</CardTitle>
                <CardDescription>Manage the list of key doctors and specialists shown on the hospital profile.</CardDescription>
              </div>
              <Button onClick={() => {
                const current = hospital.doctors || [];
                updateField('doctors', [...current, { name: '', specialty: '', designation: '', experienceYears: 0, languages: [] }]);
              }}>
                <Plus className="w-4 h-4 mr-2" /> Add Doctor
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {(hospital.doctors || []).map((doc, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-muted/10 relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    onClick={() => {
                      const newDocs = [...hospital.doctors];
                      newDocs.splice(idx, 1);
                      updateField('doctors', newDocs);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex gap-6">
                    {/* Doctor Image Upload */}
                    <div className="shrink-0 space-y-2">
                      <Label>Profile Image</Label>
                      <div className="relative w-24 h-24 rounded-full border-2 border-dashed bg-white flex items-center justify-center overflow-hidden">
                        {doc.image ? (
                          <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-muted-foreground/40 flex flex-col items-center">
                            <Upload className="w-6 h-6 mb-1" />
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const newDocs = [...hospital.doctors];
                              newDocs[idx].image = ev.target.result;
                              updateField('doctors', newDocs);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Doctor Name</Label>
                        <Input 
                          value={doc.name || ''} 
                        onChange={(e) => {
                          const newDocs = [...hospital.doctors];
                          newDocs[idx].name = e.target.value;
                          updateField('doctors', newDocs);
                        }}
                        placeholder="Dr. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Specialty</Label>
                      <Input 
                        value={doc.specialty || ''} 
                        onChange={(e) => {
                          const newDocs = [...hospital.doctors];
                          newDocs[idx].specialty = e.target.value;
                          updateField('doctors', newDocs);
                        }}
                        placeholder="e.g. Cardiology"
                        list="doc-specialties"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Designation</Label>
                      <Input 
                        value={doc.designation || ''} 
                        onChange={(e) => {
                          const newDocs = [...hospital.doctors];
                          newDocs[idx].designation = e.target.value;
                          updateField('doctors', newDocs);
                        }}
                        placeholder="e.g. Head of Cardiology"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Experience (Years)</Label>
                      <Input 
                        type="number"
                        min="0"
                        value={doc.experienceYears || ''} 
                        onChange={(e) => {
                          const newDocs = [...hospital.doctors];
                          newDocs[idx].experienceYears = parseInt(e.target.value) || 0;
                          updateField('doctors', newDocs);
                        }}
                        placeholder="e.g. 15"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Languages Spoken</Label>
                      <TagsInput 
                        value={doc.languages || []} 
                        onChange={(tags) => {
                          const newDocs = [...hospital.doctors];
                          newDocs[idx].languages = tags;
                          updateField('doctors', newDocs);
                        }}
                        placeholder="English, Hindi, Marathi..."
                        suggestions={["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Bengali"]}
                      />
                    </div>
                  </div>
                </div>
                </div>
              ))}
              {(!hospital.doctors || hospital.doctors.length === 0) && (
                <div className="text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground">
                  No doctors added yet. Click "Add Doctor" to create one.
                </div>
              )}
              <datalist id="doc-specialties">
                {PREDEFINED_SPECIALTIES.map(s => <option key={s} value={s} />)}
              </datalist>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatments Tab */}
        <TabsContent value="treatments" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Estimated Treatment Costs</CardTitle>
                <CardDescription>Provide rough cost and stay estimates for common procedures.</CardDescription>
              </div>
              <Button onClick={() => {
                const current = hospital.treatmentEstimates || [];
                updateField('treatmentEstimates', [...current, { 
                  treatmentId: '', 
                  treatmentLabel: '', 
                  procedure: '',
                  costRange: { min: 0, max: 0 },
                  stayDays: { min: 0, max: 0 }
                }]);
              }}>
                <Plus className="w-4 h-4 mr-2" /> Add Treatment
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {(hospital.treatmentEstimates || []).map((trt, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-muted/10 relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    onClick={() => {
                      const newTrt = [...hospital.treatmentEstimates];
                      newTrt.splice(idx, 1);
                      updateField('treatmentEstimates', newTrt);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Treatment Name (Label)</Label>
                        <Input 
                          value={trt.treatmentLabel || ''} 
                          onChange={(e) => {
                            const newTrt = [...hospital.treatmentEstimates];
                            newTrt[idx].treatmentLabel = e.target.value;
                            if (!newTrt[idx].treatmentId) {
                              newTrt[idx].treatmentId = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                            }
                            updateField('treatmentEstimates', newTrt);
                          }}
                          placeholder="e.g. Total Knee Replacement"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Procedure Category / Type</Label>
                        <Input 
                          value={trt.procedure || ''} 
                          onChange={(e) => {
                            const newTrt = [...hospital.treatmentEstimates];
                            newTrt[idx].procedure = e.target.value;
                            updateField('treatmentEstimates', newTrt);
                          }}
                          placeholder="e.g. Orthopedics"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Internal ID (Slug)</Label>
                        <Input 
                          value={trt.treatmentId || ''} 
                          onChange={(e) => {
                            const newTrt = [...hospital.treatmentEstimates];
                            newTrt[idx].treatmentId = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                            updateField('treatmentEstimates', newTrt);
                          }}
                          placeholder="total-knee-replacement"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-sm border-b pb-2 mb-4">Estimates</h4>
                      
                      <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground uppercase">Cost Range (₹)</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number" min="0" placeholder="Min Cost"
                            value={trt.costRange?.min || ''}
                            onChange={(e) => {
                              const newTrt = [...hospital.treatmentEstimates];
                              if (!newTrt[idx].costRange) newTrt[idx].costRange = { min: 0, max: 0 };
                              newTrt[idx].costRange.min = parseInt(e.target.value) || 0;
                              updateField('treatmentEstimates', newTrt);
                            }}
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input 
                            type="number" min="0" placeholder="Max Cost"
                            value={trt.costRange?.max || ''}
                            onChange={(e) => {
                              const newTrt = [...hospital.treatmentEstimates];
                              if (!newTrt[idx].costRange) newTrt[idx].costRange = { min: 0, max: 0 };
                              newTrt[idx].costRange.max = parseInt(e.target.value) || 0;
                              updateField('treatmentEstimates', newTrt);
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <Label className="text-xs text-muted-foreground uppercase">Hospital Stay (Days)</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number" min="0" placeholder="Min Days"
                            value={trt.stayDays?.min || ''}
                            onChange={(e) => {
                              const newTrt = [...hospital.treatmentEstimates];
                              if (!newTrt[idx].stayDays) newTrt[idx].stayDays = { min: 0, max: 0 };
                              newTrt[idx].stayDays.min = parseInt(e.target.value) || 0;
                              updateField('treatmentEstimates', newTrt);
                            }}
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input 
                            type="number" min="0" placeholder="Max Days"
                            value={trt.stayDays?.max || ''}
                            onChange={(e) => {
                              const newTrt = [...hospital.treatmentEstimates];
                              if (!newTrt[idx].stayDays) newTrt[idx].stayDays = { min: 0, max: 0 };
                              newTrt[idx].stayDays.max = parseInt(e.target.value) || 0;
                              updateField('treatmentEstimates', newTrt);
                            }}
                          />
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              ))}
              {(!hospital.treatmentEstimates || hospital.treatmentEstimates.length === 0) && (
                <div className="text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground">
                  No treatment estimates added yet. Click "Add Treatment" to create one.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Location & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={hospital.city || ''} onChange={e => updateField('city', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>State / Region</Label>
                  <Input value={hospital.stateRegion || ''} onChange={e => updateField('stateRegion', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Full Address</Label>
                  <Input value={hospital.address || ''} onChange={e => updateField('address', e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <Label>Google Maps Latitude</Label>
                  <Input 
                    type="number" 
                    step="any"
                    value={hospital.location?.coordinates?.[1] || ''} 
                    onChange={e => handleLocationChange(1, e.target.value)} 
                    placeholder="e.g. 18.5204"
                  />
                  <p className="text-[0.65rem] text-muted-foreground">Used for distance calculations and map pins.</p>
                </div>
                <div className="space-y-2">
                  <Label>Google Maps Longitude</Label>
                  <Input 
                    type="number" 
                    step="any"
                    value={hospital.location?.coordinates?.[0] || ''} 
                    onChange={e => handleLocationChange(0, e.target.value)} 
                    placeholder="e.g. 73.8567"
                  />
                  <p className="text-[0.65rem] text-muted-foreground">Longitude (X-axis).</p>
                </div>

                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input value={hospital.contact || ''} onChange={e => updateField('contact', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input value={hospital.website || ''} onChange={e => updateField('website', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Gallery</CardTitle>
              <CardDescription>Manage images displayed in the gallery section. Uploaded images are automatically optimized and converted to WebP format.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Dropzone */}
              <div 
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-muted/30'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleImageUpload}
              >
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  multiple 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  title="Drop images here or click to browse"
                />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg text-ink-strong mb-1">Click or drag images to upload</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-[300px]">
                    Supported formats: JPEG, PNG, WebP. Images are auto-converted to WebP (Max 1600px width).
                  </p>
                  <Button variant="secondary" size="sm" className="pointer-events-auto relative z-10" onClick={() => document.querySelector('input[type="file"]').click()}>
                    Browse Files
                  </Button>
                </div>
              </div>

              {/* Gallery Grid */}
              {hospital.images && hospital.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border">
                  {hospital.images.map((img, idx) => {
                    const isFeatured = img.category === 'featured';
                    return (
                      <div key={idx} className={`relative group rounded-xl overflow-hidden border-2 transition-all ${isFeatured ? 'border-primary shadow-md' : 'border-border'}`}>
                        {/* Image Preview */}
                        <div className="aspect-[4/3] bg-muted relative">
                          {img.url ? (
                            <img src={img.url} alt={img.alt || 'Hospital Image'} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full"><ImageIcon className="w-8 h-8 text-muted-foreground/30" /></div>
                          )}
                          
                          {/* Featured Badge */}
                          {isFeatured && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[0.65rem] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Featured
                            </div>
                          )}

                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            {!isFeatured && (
                              <Button variant="secondary" size="sm" className="h-8 text-xs font-semibold" onClick={() => setFeaturedImage(idx)}>
                                Set Featured
                              </Button>
                            )}
                            <Button variant="destructive" size="sm" className="h-8 text-xs font-semibold" onClick={() => {
                              const newImages = [...hospital.images];
                              newImages.splice(idx, 1);
                              updateField('images', newImages);
                            }}>
                              <Trash2 className="w-3 h-3 mr-1.5" /> Remove
                            </Button>
                          </div>
                        </div>

                        {/* Image Meta Editing */}
                        <div className="p-3 bg-white space-y-2">
                          <div>
                            <Label className="text-[0.65rem] text-muted-foreground uppercase tracking-wider mb-1 block">Alt Text</Label>
                            <Input 
                              className="h-7 text-xs" 
                              value={img.alt || ''} 
                              onChange={(e) => {
                                const newImages = [...hospital.images];
                                newImages[idx].alt = e.target.value;
                                updateField('images', newImages);
                              }}
                              placeholder="Describe image..."
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Internal Tab */}
        <TabsContent value="internal" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Internal Admin Details</CardTitle>
              <CardDescription>Point of Contact (POC) and private notes. This information is strictly internal and will never be visible on the public website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>POC Name</Label>
                  <Input 
                    value={hospital.poc?.name || ''} 
                    onChange={e => updateField('poc', { ...hospital.poc, name: e.target.value })} 
                    placeholder="e.g. Dr. Jane Doe or Partnership Desk"
                  />
                </div>
                <div className="space-y-2">
                  <Label>POC Phone</Label>
                  <Input 
                    value={hospital.poc?.phone || ''} 
                    onChange={e => updateField('poc', { ...hospital.poc, phone: e.target.value })} 
                    placeholder="Direct or mobile line"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>POC Email</Label>
                  <Input 
                    type="email"
                    value={hospital.poc?.email || ''} 
                    onChange={e => updateField('poc', { ...hospital.poc, email: e.target.value })} 
                    placeholder="partnerships@hospital.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Internal Notes / Partnership Details</Label>
                  <Textarea 
                    rows={4}
                    value={hospital.poc?.notes || ''} 
                    onChange={e => updateField('poc', { ...hospital.poc, notes: e.target.value })} 
                    placeholder="Discount rates, negotiation status, SLA terms..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
