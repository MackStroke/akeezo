import { useState, useEffect } from 'react';
import { Loader2, Stethoscope, Search, Video, User, MapPin, Building2, CheckCircle } from 'lucide-react';
import SEO from '@/components/SEO';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [consultationFilter, setConsultationFilter] = useState('all');

  useEffect(() => {
    async function fetchDoctors() {
      setIsLoading(true);
      setError(null);
      try {
        let url = '/api/doctors';
        if (consultationFilter !== 'all') {
          url += `?consultationType=${consultationFilter}`;
        }
        const res = await fetch(import.meta.env.VITE_API_URL + url);
        if (!res.ok) throw new Error('Failed to fetch doctors');
        const json = await res.json();
        setDoctors(json.data || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load doctors. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoctors();
  }, [consultationFilter]);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEO 
        title="Find Doctors for Online & Offline Consultation | AKEEZO" 
        description="Discover specialist doctors open for online video consultation and offline in-person visits."
      />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-navy text-white relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-primary/20" />
          <div className="relative mx-auto max-w-5xl px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-sky-300 text-xs font-bold border border-white/20">
              <Stethoscope className="size-3.5 text-primary" />
              AKEEZO Doctor Directory
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Consult with Top Specialists
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
              Find experienced doctors offering both online video consultations and offline clinic visits.
            </p>

            <div className="max-w-2xl mx-auto pt-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search doctors, specialties, or hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 h-12 bg-white text-foreground rounded-lg shadow-lg text-sm border-none w-full"
                />
              </div>
              <div className="w-full sm:w-48 text-left">
                <Select value={consultationFilter} onValueChange={setConsultationFilter}>
                  <SelectTrigger className="h-12 bg-white text-foreground border-none shadow-lg">
                    <SelectValue placeholder="All Consultation Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="online">Online Video</SelectItem>
                    <SelectItem value="offline">Offline Clinic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Listings */}
        <div className="mx-auto max-w-5xl px-4 py-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Finding available doctors...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border space-y-3">
              <Stethoscope className="size-10 text-muted-foreground mx-auto opacity-50" />
              <h3 className="text-lg font-bold">Unable to Load Doctors</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm">Retry</Button>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border space-y-3">
              <Stethoscope className="size-10 text-muted-foreground mx-auto opacity-50" />
              <h3 className="text-lg font-bold">No Doctors Found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search query or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex gap-5">
                  <div className="shrink-0">
                    <img 
                      src={doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&q=80'} 
                      alt={doctor.name} 
                      className="size-20 sm:size-24 object-cover rounded-full border-2 border-primary/20"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-bold text-lg text-ink-strong">{doctor.name}</h3>
                      <p className="text-sm text-primary font-semibold">{doctor.specialty}</p>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3.5" />
                        <span>{doctor.hospital}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        <span>{doctor.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {doctor.consultationType.includes('online') && (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 flex gap-1 items-center font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5">
                          <Video className="size-3" /> Online
                        </Badge>
                      )}
                      {doctor.consultationType.includes('offline') && (
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex gap-1 items-center font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5">
                          <User className="size-3" /> Offline
                        </Badge>
                      )}
                    </div>
                    
                    <div className="pt-3 mt-3 border-t border-border flex items-center justify-between">
                      <div className="text-xs font-semibold text-ink-strong">
                        Fee: <span className="text-primary font-bold">₹{doctor.fee}</span>
                      </div>
                      <Button size="sm" className="h-8 text-xs font-bold rounded-full">
                        Book Consult
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
