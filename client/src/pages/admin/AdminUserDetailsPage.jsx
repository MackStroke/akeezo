import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, Globe, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center">Loading user details...</div>;
  }

  if (!data || !data.user) {
    return <div className="p-8 text-center text-muted-foreground">User not found.</div>;
  }

  const { user, leads } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    try {
      return format(new Date(dateStr), 'PPpp');
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-3 text-muted-foreground hover:text-foreground">
          <Link to="/admin/users">
            <ArrowLeft className="size-4 mr-2" /> Back to Users
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-ink-strong">{user.name}</h1>
              <Badge variant="secondary" className={user.status === 'active' ? 'bg-green-100 text-green-700' : ''}>
                {user.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
              <ShieldCheck className="size-4" /> User ID: {user.userId}
            </p>
          </div>
          <Button variant="outline">Edit Profile</Button>
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
                <span className="font-medium text-foreground">{user.email || '-'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="size-4 text-primary" /> 
                <span className="font-medium text-foreground">{user.phone || '-'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Globe className="size-4 text-primary" /> 
                <span className="font-medium text-foreground">{user.nationality || 'Nationality not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="size-4 text-primary" /> 
                <span className="font-medium text-foreground">{user.preferredLanguage || 'Language not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="size-4 text-primary" /> 
                <span className="font-medium text-foreground">
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Leads and Queries */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Related Leads & Inquiries</CardTitle>
              <CardDescription>All queries and leads submitted by this user</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {leads.length > 0 ? (
                <div className="divide-y">
                  {leads.map(lead => (
                    <div key={lead._id || lead.id} className="p-4 hover:bg-muted/30 transition-colors flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Link to={`/admin/leads/${lead._id || lead.id}`} className="font-bold text-primary hover:underline">
                            {lead.journeyId || lead._id || lead.id}
                          </Link>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {lead.intent || lead.type || 'General'}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground">{lead.treatment || 'No specific treatment'}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="size-3" /> {formatDate(lead.createdAt || lead.date)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="font-bold bg-primary/10 text-primary uppercase text-[10px]">
                        {lead.status || 'New'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>This user has not raised any inquiries or leads yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
