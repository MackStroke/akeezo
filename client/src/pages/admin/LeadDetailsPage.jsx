import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
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

export default function LeadDetailsPage() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  async function fetchLead() {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus) {
    try {
      setStatusUpdating(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  }

  async function addNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    
    try {
      setSavingNote(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/leads/${id}/notes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ text: noteText })
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data.data);
        setNoteText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Lead Not Found</h2>
        <Button asChild className="mt-4">
          <Link to="/admin/leads">Back to Leads</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="shrink-0">
          <Link to="/admin/leads"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink-strong">{lead.name || 'Anonymous User'}</h1>
          <p className="text-muted-foreground mt-1 text-sm">Lead Reference: {lead.journeyId || lead._id || lead.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="size-4 text-primary" /> 
                <span className="font-medium text-foreground">{lead.email || '-'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="size-4 text-primary" /> 
                <span className="font-medium text-foreground">{lead.phone || '-'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="size-4 text-primary" /> 
                <span className="font-medium text-foreground">{lead.country || lead.preferredCity || '-'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="size-4 text-primary" /> 
                <span className="font-medium text-foreground">
                  Received {new Date(lead.createdAt || lead.date).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Lead Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status</span>
                <Badge variant="secondary" className="font-bold bg-primary/10 text-primary">
                  {lead.status || 'New'}
                </Badge>
              </div>
              
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Update Status</span>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={statusUpdating || lead.status === 'New'}
                    onClick={() => updateStatus('New')}
                  >
                    New
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={statusUpdating || lead.status === 'Contacted'}
                    onClick={() => updateStatus('Contacted')}
                  >
                    Contacted
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={statusUpdating || lead.status === 'Qualified'}
                    onClick={() => updateStatus('Qualified')}
                  >
                    Qualified
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-emergency hover:text-emergency hover:bg-emergency-surface"
                        disabled={statusUpdating || lead.status === 'Lost'}
                      >
                        Lost
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark lead as Lost?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark the lead as lost and remove it from the active pipeline. This action can be reversed later if needed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => updateStatus('Lost')}
                          className="bg-emergency hover:bg-emergency-strong text-white"
                        >
                          Mark as Lost
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Request & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">Intent</span>
                  <p className="mt-1 font-medium capitalize">{lead.intent?.replace('_', ' ') || lead.type || 'General Inquiry'}</p>
                </div>
                <div>
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">Treatment / Service</span>
                  <p className="mt-1 font-medium capitalize">{lead.treatment || 'Not specified'}</p>
                </div>
                <div>
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">Urgency</span>
                  <p className="mt-1 font-medium capitalize">{lead.urgency?.replace('_', ' ') || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Message from Patient</span>
                <div className="bg-muted/30 p-4 rounded-xl text-sm whitespace-pre-wrap">
                  {lead.message || 'No additional message provided.'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Internal Notes</CardTitle>
              <CardDescription>Activity log and internal coordination notes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.map(note => (
                    <div key={note.id} className="flex gap-4 p-4 bg-muted/20 rounded-xl border">
                      <div className="size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {note.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm">{note.author}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            {new Date(note.date).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{note.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-center text-muted-foreground py-6 bg-muted/20 rounded-xl border border-dashed">
                    No notes added yet.
                  </div>
                )}
              </div>

              <form onSubmit={addNote} className="flex gap-2">
                <Input 
                  placeholder="Type a note..." 
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  disabled={savingNote}
                />
                <Button type="submit" disabled={!noteText.trim() || savingNote} className="shrink-0 gap-2 font-bold">
                  {savingNote ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
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
