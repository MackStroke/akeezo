import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import {
  User,
  Phone,
  MessageSquare,
  FileText,
  Plane,
  Building2,
  Clock,
  Download,
  LogOut,
  CheckCircle2,
  Upload,
  Stethoscope,
  MapPin,
  AlertCircle,
  FileCheck,
  Edit3,
  Save,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { site, telHref } from '@/lib/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const JOURNEY_STAGES = [
  { id: 1, title: 'Inquiry Submitted', desc: 'Medical records under review' },
  { id: 2, title: 'Specialist Opinion', desc: 'Doctor plan & quotes ready' },
  { id: 3, title: 'Estimate Approved', desc: 'Travel & deposit prep active' },
  { id: 4, title: 'Visa & Flight', desc: 'Embassy letter & flight booking' },
  { id: 5, title: 'Hospital Admission', desc: 'Procedure & hospital stay' },
  { id: 6, title: 'Recovery & Home', desc: 'Post-op care & return travel' },
];

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { customerUser, logout, updateProfile, addDocument } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState('journey');
  const [newDocName, setNewDocName] = useState('');
  const [uploading, setUploading] = useState(false);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState(customerUser?.phone || '');
  const [editEmail, setEditEmail] = useState(customerUser?.email || '');
  const [editEmergency, setEditEmergency] = useState(customerUser?.emergencyContact || '');
  const [editLanguage, setEditLanguage] = useState(customerUser?.preferredLanguage || 'English');

  if (!customerUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-card border-border text-center p-6 space-y-4 shadow-widget">
            <AlertCircle className="size-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-ink-strong">Session Expired</h2>
            <p className="text-sm text-muted-foreground">Please sign in to access your patient portal.</p>
            <Button onClick={() => navigate('/login')} className="w-full cta-gradient text-white font-bold">
              Go to Login Page
            </Button>
          </Card>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const { journey } = customerUser;

  const handleUploadSim = (e) => {
    e.preventDefault();
    if (!newDocName) return;
    setUploading(true);
    setTimeout(() => {
      addDocument({
        id: 'doc_' + Date.now(),
        name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        size: '1.8 MB',
        type: 'PDF',
      });
      setNewDocName('');
      setUploading(false);
    }, 500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      phone: editPhone,
      email: editEmail,
      emergencyContact: editEmergency,
      preferredLanguage: editLanguage,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <SEO title="My Healthcare Journey | AKEEZO Patient Portal" noindex={true} />
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Patient Journey Card Banner */}
        <Card className="bg-card border-border shadow-widget overflow-hidden relative">
          <CardContent className="p-5 sm:p-7 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Patient Details */}
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-secondary border border-border flex items-center justify-center text-primary font-bold text-xl shrink-0">
                  {customerUser.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-ink-strong tracking-tight">
                      {customerUser.name}
                    </h1>
                    <Badge variant="outline" className="text-xs font-mono border-border">
                      {journey?.id}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                    <Stethoscope className="size-4 shrink-0" />
                    {journey?.treatment}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="size-3.5 shrink-0" />
                    {journey?.hospital}
                  </p>
                </div>
              </div>

              {/* Care Coordinator Box */}
              <div className="bg-muted border border-border rounded-xl p-3.5 flex items-center justify-between gap-4 shrink-0">
                <div>
                  <p className="text-xs font-bold text-muted-foreground">Assigned Care Lead</p>
                  <p className="text-sm font-extrabold text-ink-strong">{journey?.coordinator?.name}</p>
                  <p className="text-xs text-primary">{journey?.coordinator?.role}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="cta-gradient text-white font-bold text-xs gap-1.5"
                  >
                    <a
                      href={`https://wa.me/${journey?.coordinator?.whatsapp}?text=Hello%20${encodeURIComponent(
                        journey?.coordinator?.name || ''
                      )},%20I%20am%20inquiring%20about%20my%20case%20${journey?.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="size-3.5" /> WhatsApp
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-border text-xs font-bold"
                  >
                    <a href={telHref(journey?.coordinator?.phone || site.emergencyPhone)}>
                      <Phone className="size-3.5" /> Call
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Stepper Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  Current Status: <span className="text-primary">{journey?.statusLabel}</span>
                </span>
                <span className="text-muted-foreground hidden sm:inline">
                  Stage {journey?.statusStep || 1} of {JOURNEY_STAGES.length}
                </span>
              </div>

              {/* Visual Progress Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {JOURNEY_STAGES.map((stage) => {
                  const isDone = stage.id < (journey?.statusStep || 1);
                  const isCurrent = stage.id === (journey?.statusStep || 1);
                  return (
                    <div
                      key={stage.id}
                      className={`p-2.5 rounded-lg border text-xs transition-all ${
                        isCurrent
                          ? 'bg-secondary border-primary text-foreground font-bold shadow-sm'
                          : isDone
                          ? 'bg-muted border-border text-muted-foreground'
                          : 'bg-background border-border text-muted-foreground/60'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="font-mono text-[0.7rem]">0{stage.id}</span>
                        {isDone ? (
                          <CheckCircle2 className="size-3.5 text-emerald-600" />
                        ) : isCurrent ? (
                          <span className="size-2 rounded-full bg-primary animate-ping" />
                        ) : null}
                      </div>
                      <p className="font-bold truncate text-[0.75rem]">{stage.title}</p>
                      <p className="text-[0.68rem] text-muted-foreground truncate hidden sm:block">{stage.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Modules */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-muted text-muted-foreground p-1 rounded-xl w-full grid grid-cols-2 sm:grid-cols-5 h-auto gap-1 border border-border">
            <TabsTrigger
              value="journey"
              className="text-xs font-bold py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground shadow-sm rounded-lg"
            >
              Journey Overview
            </TabsTrigger>
            <TabsTrigger
              value="estimate"
              className="text-xs font-bold py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground shadow-sm rounded-lg"
            >
              Cost & Estimates
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="text-xs font-bold py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground shadow-sm rounded-lg"
            >
              Medical Vault ({journey?.documents?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="travel"
              className="text-xs font-bold py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground shadow-sm rounded-lg"
            >
              Travel & Visa
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-xs font-bold py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground shadow-sm rounded-lg col-span-2 sm:col-span-1"
            >
              Profile Settings
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="journey" className="space-y-6">
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-ink-strong flex items-center gap-2">
                  <Stethoscope className="size-4 text-primary" />
                  Treatment & Hospital Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted border border-border">
                  <div>
                    <p className="text-muted-foreground text-xs font-bold">Planned Treatment</p>
                    <p className="font-extrabold text-ink-strong text-base mt-0.5">{journey?.treatment}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-bold">Physician Lead</p>
                    <p className="font-extrabold text-primary text-base mt-0.5">{journey?.doctor}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-bold">Hospital Network</p>
                    <p className="font-bold text-foreground mt-0.5">{journey?.hospital}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-bold">Case Reference ID</p>
                    <p className="font-bold text-foreground mt-0.5">{journey?.id}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-ink-strong text-xs">Active Tasks & Progress</h4>
                  <div className="p-3.5 rounded-lg bg-secondary border border-border flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-ink-strong text-xs">Medical Records Registered</p>
                      <p className="text-xs text-muted-foreground">
                        Your inquiry is assigned to an international patient coordinator.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: ESTIMATE */}
          <TabsContent value="estimate" className="space-y-6">
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-ink-strong">Cost & Estimate Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted border border-border">
                    <p className="text-xs font-bold text-muted-foreground">Package Estimate</p>
                    <p className="text-xl font-extrabold text-primary mt-1">{journey?.estimatedCost}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted border border-border">
                    <p className="text-xs font-bold text-muted-foreground">Deposit Paid</p>
                    <p className="text-xl font-extrabold text-emerald-600 mt-1">{journey?.depositPaid}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted border border-border">
                    <p className="text-xs font-bold text-muted-foreground">Currency</p>
                    <p className="text-xl font-extrabold text-foreground mt-1">{journey?.currency || 'USD'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: DOCUMENTS */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-ink-strong">Diagnostic Vault & Uploads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleUploadSim} className="p-4 rounded-xl bg-muted border border-dashed border-border space-y-3">
                  <Label htmlFor="docName" className="text-xs font-bold">Upload Medical Document</Label>
                  <div className="flex gap-2">
                    <Input
                      id="docName"
                      placeholder="e.g. Scan_Report.pdf"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="text-xs"
                    />
                    <Button type="submit" disabled={uploading || !newDocName} size="sm" className="cta-gradient text-white font-bold text-xs shrink-0">
                      <Upload className="size-3.5 mr-1" />
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </form>

                <div className="space-y-2">
                  {journey?.documents?.map((doc) => (
                    <div key={doc.id} className="p-3 rounded-lg bg-muted border border-border flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <FileText className="size-4 text-primary shrink-0" />
                        <div>
                          <p className="font-bold text-foreground">{doc.name}</p>
                          <p className="text-[0.7rem] text-muted-foreground">{doc.date} • {doc.size}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => alert(`Downloading ${doc.name}...`)} className="text-xs font-bold">
                        <Download className="size-3 mr-1" /> View
                      </Button>
                    </div>
                  ))}
                  {journey?.documents?.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">No diagnostic reports uploaded yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: TRAVEL */}
          <TabsContent value="travel" className="space-y-6">
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-ink-strong">Travel & Visa Concierge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-muted border border-border">
                    <p className="font-bold text-muted-foreground">Visa Status</p>
                    <p className="font-extrabold text-foreground text-sm mt-0.5">{journey?.travel?.visaStatus}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted border border-border">
                    <p className="font-bold text-muted-foreground">Flight Booking</p>
                    <p className="font-extrabold text-foreground text-sm mt-0.5">{journey?.travel?.flightStatus}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted border border-border">
                    <p className="font-bold text-muted-foreground">Hotel Stay</p>
                    <p className="font-extrabold text-foreground text-sm mt-0.5">{journey?.travel?.hotelBooking}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted border border-border">
                    <p className="font-bold text-muted-foreground">Airport Transfer</p>
                    <p className="font-extrabold text-foreground text-sm mt-0.5">{journey?.travel?.airportPickup}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: PROFILE SETTINGS */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-bold text-ink-strong">Patient Details & Settings</CardTitle>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="text-xs font-bold">
                    <Edit3 className="size-3 mr-1" /> Edit Profile
                  </Button>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {!isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-3 rounded-lg bg-muted border border-border">
                      <p className="text-muted-foreground text-xs font-bold">Full Name</p>
                      <p className="font-bold text-foreground mt-0.5">{customerUser.name}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted border border-border">
                      <p className="text-muted-foreground text-xs font-bold">Email Address</p>
                      <p className="font-bold text-foreground mt-0.5">{customerUser.email || 'N/A'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted border border-border">
                      <p className="text-muted-foreground text-xs font-bold">Phone Number</p>
                      <p className="font-bold text-foreground mt-0.5">{customerUser.phone || 'N/A'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted border border-border">
                      <p className="text-muted-foreground text-xs font-bold">Nationality</p>
                      <p className="font-bold text-foreground mt-0.5">{customerUser.nationality}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <Label htmlFor="ePhone" className="font-bold">Phone Number</Label>
                      <Input id="ePhone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="eEmail" className="font-bold">Email Address</Label>
                      <Input id="eEmail" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="text-xs" />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button type="submit" size="sm" className="cta-gradient text-white font-bold text-xs">
                        <Save className="size-3.5 mr-1" /> Save
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)} className="text-xs">
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <Separator />

                <div className="pt-2 flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-bold"
                      >
                        <LogOut className="size-3.5 mr-1.5" /> Sign Out
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sign Out of Patient Portal?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to sign out? You will need to sign in again to access your treatment estimates, medical vault, and care coordinator.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            logout();
                            navigate('/');
                          }}
                          className="bg-destructive text-white hover:bg-destructive/90 font-bold"
                        >
                          Sign Out
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <SiteFooter />
    </div>
  );
}
