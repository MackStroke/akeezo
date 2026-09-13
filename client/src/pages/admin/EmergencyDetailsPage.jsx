import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Phone, User, Activity, AlertCircle, Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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
} from "../../components/ui/alert-dialog";

export default function EmergencyDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    async function fetchCase() {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await fetch(`/api/admin/emergencies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch emergency case', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setStatusUpdating(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/emergencies/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus, note: `Admin updated status to ${newStatus}` })
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    setStatusUpdating(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/emergencies/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ note })
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        setNote('');
      }
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown Time';
    try {
      return format(new Date(dateStr), 'PPpp');
    } catch (err) {
      return dateStr;
    }
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse flex flex-col items-center gap-4"><Loader2 className="size-8 animate-spin text-primary" /> Loading SOS case...</div>;
  if (!data) return <div className="p-12 text-center text-emergency font-bold text-xl">SOS Case Not Found</div>;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/emergencies" className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors border shadow-sm bg-white dark:bg-slate-900">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-ink-strong flex items-center gap-3">
              SOS: {data.caseId}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <Clock className="size-4" /> Received {formatDate(data.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Status */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-emergency/30 shadow-sm overflow-hidden">
            <div className="bg-emergency/10 px-6 py-4 border-b border-emergency/20">
              <CardTitle className="text-lg flex items-center gap-2 text-emergency-strong">
                <AlertCircle className="size-5" /> Emergency Status
              </CardTitle>
            </div>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status</span>
                <Badge className="font-bold bg-emergency hover:bg-emergency-strong animate-pulse">
                  {(data.status || 'Received').replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Take Action</span>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    disabled={statusUpdating || data.status === 'desk_contacted'}
                    onClick={() => handleStatusUpdate('desk_contacted')}
                  >
                    Desk Contacted
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start"
                    disabled={statusUpdating || data.status === 'en_route'}
                    onClick={() => handleStatusUpdate('en_route')}
                  >
                    Ambulance En Route
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full justify-start"
                    disabled={statusUpdating || data.status === 'patient_arrived'}
                    onClick={() => handleStatusUpdate('patient_arrived')}
                  >
                    Patient Arrived at Hospital
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full justify-start text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                        disabled={statusUpdating || data.status === 'closed'}
                      >
                        Close Case (Resolved)
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Close this Emergency Case?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark the emergency as resolved and closed. Please ensure all necessary medical handover and administrative steps are complete before proceeding.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleStatusUpdate('closed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Confirm & Close
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm pt-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <User className="size-4 text-primary shrink-0" /> 
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider">Requester ({data.requesterType || 'unknown'})</span>
                  <span className="font-bold text-foreground text-base">{data.requesterName || '-'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="size-4 text-primary shrink-0" /> 
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider">Phone Number</span>
                  <span className="font-bold text-primary text-base">{data.requesterPhone || '-'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="size-4 text-primary shrink-0" /> 
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider">Location</span>
                  <span className="font-medium text-foreground">{data.location?.label || data.location?.placeType || '-'}</span>
                  {data.location?.coordinates?.length === 2 && (
                    <div className="text-[10px] font-mono mt-1 bg-muted px-2 py-1 rounded">
                      {data.location.coordinates[1]}, {data.location.coordinates[0]}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Problem & Timeline Notes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg text-emergency">The Emergency Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-black text-ink-strong mb-6 leading-tight bg-muted/30 p-4 rounded-xl border border-emergency/20">
                "{data.problem}"
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">Conscious</span>
                  <p className="mt-1 font-medium capitalize flex items-center gap-1.5">
                    <Activity className={`size-4 ${data.conscious === 'yes' ? 'text-green-500' : 'text-emergency'}`} />
                    {data.conscious || 'Unknown'}
                  </p>
                </div>
                <div>
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">Breathing</span>
                  <p className="mt-1 font-medium capitalize flex items-center gap-1.5">
                    <Activity className={`size-4 ${data.breathingNormally === 'yes' ? 'text-green-500' : 'text-emergency'}`} />
                    {data.breathingNormally || 'Unknown'}
                  </p>
                </div>
                <div>
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">Help Needed</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(data.helpNeeded || []).map((h, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-slate-50">{h}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Activity & Dispatch Notes</CardTitle>
              <CardDescription>Real-time timeline of steps taken on this emergency.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {data.timeline && data.timeline.length > 0 ? (
                  data.timeline.map((evt, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                      <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {evt.actor ? evt.actor.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">{evt.actor || 'System'}</span>
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                              {(evt.status || '').replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                            <Clock className="size-3" />
                            {formatDate(evt.at)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-2">{evt.note}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-center text-muted-foreground py-6 bg-muted/20 rounded-xl border border-dashed">
                    No timeline events yet.
                  </div>
                )}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <Input 
                  placeholder="Type a dispatch note or step taken..." 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  disabled={statusUpdating}
                  className="bg-muted/30"
                />
                <Button type="submit" disabled={!note.trim() || statusUpdating} className="shrink-0 gap-2 font-bold bg-slate-900 text-white">
                  {statusUpdating ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Add Note
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
