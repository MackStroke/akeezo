import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Star, Building2, Phone, Globe, CheckCircle2, AlertCircle, BedDouble, Award } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { fetchHospital, fetchHospitals } from '@/lib/api';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import SEO from '@/components/SEO';
import { ImageGallery } from '@/components/hospitals/ImageGallery';
import { PageNavigation } from '@/components/hospitals/PageNavigation';
import { FacilitiesSection } from '@/components/hospitals/FacilitiesSection';
import { DepartmentsSection } from '@/components/hospitals/DepartmentsSection';
import { TreatmentEstimates } from '@/components/hospitals/TreatmentEstimates';
import { DoctorsList } from '@/components/hospitals/DoctorsList';
import { ShowcaseSlider } from '@/components/hospitals/ShowcaseSlider';

// Hardcoded top destinations mimicking Agoda's structure
const TOP_DESTINATIONS = [
  { id: 'delhi', title: 'Delhi NCR', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=400&h=400', link: '/hospitals?city=Delhi+NCR' },
  { id: 'mumbai', title: 'Mumbai', image: 'https://images.unsplash.com/photo-1522749465369-07eb782f2f76?auto=format&fit=crop&q=80&w=400&h=400', link: '/hospitals?city=Mumbai' },
  { id: 'bangalore', title: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=400&h=400', link: '/hospitals?city=Bangalore' },
  { id: 'chennai', title: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?auto=format&fit=crop&q=80&w=400&h=400', link: '/hospitals?city=Chennai' },
  { id: 'hyderabad', title: 'Hyderabad', image: 'https://images.unsplash.com/photo-1513346940221-6f673d962e97?auto=format&fit=crop&q=80&w=400&h=400', link: '/hospitals?city=Hyderabad' },
  { id: 'pune', title: 'Pune', image: 'https://images.unsplash.com/photo-1565551934963-71e1f13b63b2?auto=format&fit=crop&q=80&w=400&h=400', link: '/hospitals?city=Pune' },
];

export default function HospitalDetailsPage() {
  const { slug } = useParams();
  const [hospital, setHospital] = useState(null);
  const [recommendedHospitals, setRecommendedHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHospital(slug);
        if (active) setHospital(data);
        
        // Fetch recommended hospitals from the same city
        if (data?.city) {
          fetchHospitals({ city: data.city, limit: 10 }).then(res => {
            if (active && res.data) {
              // Filter out current hospital
              const filtered = res.data.filter(h => h.slug !== slug).slice(0, 6);
              setRecommendedHospitals(filtered);
            }
          }).catch(console.error);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 bg-sunk py-12 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-muted-foreground font-medium">Loading hospital details...</div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO title="Hospital Not Found" noindex={true} />
        <SiteHeader />
        <main className="flex-1 bg-sunk py-12 flex flex-col items-center justify-center">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Hospital Not Found</h2>
          <p className="text-muted-foreground mb-6 max-w-md text-center">
            {error || 'The hospital you are looking for does not exist or is no longer listed.'}
          </p>
          <Button asChild>
            <Link to="/hospitals">Back to Discovery</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Pre-fill enquiry payload
  const enquiryPayload = {
    hospitalId: hospital.hospitalId || hospital._id,
    hospitalName: hospital.name,
    context: `Viewed details for ${hospital.name} in ${hospital.city}`,
  };

  const hospitalJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: hospital.name,
    description: hospital.description || `Details about ${hospital.name} in ${hospital.city}.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: hospital.city,
      addressCountry: 'IN'
    },
    url: `https://www.akeezo.com/hospitals/${hospital.slug}`,
    image: hospital.images?.[0] || 'https://www.akeezo.com/images/default_hospital.webp'
  };

  return (
    <div className="min-h-screen flex flex-col bg-sunk">
      <SEO 
        title={`${hospital.name} - ${hospital.city}`}
        description={hospital.description || `Get world-class treatment at ${hospital.name} in ${hospital.city}. Connect with AKEEZO for a complete healthcare journey.`}
        canonical={`/hospitals/${hospital.slug}`}
        jsonLd={hospitalJsonLd}
        ogImage={hospital.images?.[0]}
        keywords={`${hospital.name}, Hospitals in ${hospital.city}, Medical Tourism India, Top Hospitals India, ${hospital.type} Hospital`}
      />
      <SiteHeader />
      
      <main className="flex-1 pb-16">
        
        {/* Breadcrumb / Back Navigation */}
        <div className="bg-transparent border-b border-border/50">
          <div className="mx-auto max-w-[76rem] px-4 py-3 flex items-center gap-2 text-sm">
            <Link to="/hospitals" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to all hospitals
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-[76rem] px-4 pt-6 md:pt-8">
          
          {/* Top Header Section */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6 md:mb-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {hospital.rating && (
                  <div className="bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded text-sm font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {hospital.rating}
                  </div>
                )}
                {hospital.type && (
                  <div className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                    {hospital.type} Hospital
                  </div>
                )}
                {hospital.partnerTier === 'platinum' && (
                  <div className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                    Platinum Partner
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-ink-strong mb-2 leading-tight">
                {hospital.name}
              </h1>
              
              <div className="flex flex-wrap items-center text-muted-foreground gap-x-4 gap-y-2 text-sm md:text-base">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{hospital.address || `${hospital.locality ? hospital.locality + ', ' : ''}${hospital.city}, ${hospital.stateRegion || ''}`}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-border">•</span>
                  <a 
                    href={hospital.location?.coordinates 
                      ? `https://www.google.com/maps/search/?api=1&query=${hospital.location.coordinates[1]},${hospital.location.coordinates[0]}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.name}, ${hospital.city}`)}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
            
            {/* Mobile Enquiry Button (Hidden on Desktop) */}
            <div className="md:hidden">
              <EnquiryDialog 
                trigger={<Button size="lg" className="w-full text-base font-bold shadow-widget-orange">Enquire Now</Button>}
                payload={enquiryPayload}
              />
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-4">
            <ImageGallery images={hospital.images} hospitalName={hospital.name} />
          </div>

          <PageNavigation hospital={hospital} enquiryPayload={enquiryPayload} />

          {/* Two Column Layout for Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
            
            {/* Left Main Content */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* About Section */}
              <section id="about">
                <h2 className="text-xl md:text-2xl font-bold text-ink-strong mb-4">About {hospital.name}</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  <p>{hospital.description || `Recognized as a leading medical institution in ${hospital.city}, providing high-quality healthcare and advanced medical procedures.`}</p>
                </div>

                {/* Quick Stats / Facilities tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {hospital.bedCapacity > 0 && (
                    <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-sm font-medium">
                      <BedDouble className="w-4 h-4 text-muted-foreground" />
                      {hospital.bedCapacity} Beds
                    </div>
                  )}
                  {hospital.hasEmergency && (
                    <div className="flex items-center gap-1.5 bg-emergency/10 text-emergency px-3 py-1.5 rounded-full text-sm font-medium border border-emergency/20">
                      <AlertCircle className="w-4 h-4" />
                      24x7 Emergency Care
                    </div>
                  )}
                </div>
              </section>

              {/* Facilities Section */}
              <section id="facilities">
                <FacilitiesSection title="Facilities" items={hospital.facilities || []} />
              </section>

              {/* Departments Section */}
              <section id="departments">
                <DepartmentsSection title="Departments" items={hospital.centersOfExcellence || []} />
              </section>

              {/* Accreditations */}
              <section id="excellence">
                <h2 className="text-xl md:text-2xl font-bold text-ink-strong mb-4">Accreditations</h2>
                <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Quality Accreditations & Certifications
                  </h3>
                  {hospital.accreditations && hospital.accreditations.length > 0 ? (
                    <ul className="space-y-4">
                      {hospital.accreditations.map((acc, idx) => {
                        const isObj = typeof acc === 'object';
                        const name = isObj ? acc.name : acc;
                        const logo = isObj ? acc.logo : null;
                        
                        return (
                          <li key={idx} className="flex items-center gap-3">
                            {logo ? (
                              <img src={logo} alt={name} className="w-10 h-10 object-contain p-1 border rounded bg-white shadow-sm" />
                            ) : (
                              <div className="w-10 h-10 rounded border bg-primary/10 flex items-center justify-center shrink-0">
                                <Award className="w-5 h-5 text-primary" />
                              </div>
                            )}
                            <span className="text-sm font-medium text-ink-strong">{name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Standard certifications apply</p>
                  )}
                </div>
              </section>

              {/* Procedures & Estimates */}
              <section id="estimates">
                <div className="mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-ink-strong">Estimated Treatment Costs</h2>
                  <p className="text-sm text-muted-foreground mt-1">Estimates are indicative and include standard hospital stay. Final cost depends on medical evaluation.</p>
                </div>
                <TreatmentEstimates estimates={hospital.treatmentEstimates} />
              </section>

              {/* Medical Team */}
              <section id="doctors">
                <div className="mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-ink-strong">Top Specialists</h2>
                  <p className="text-sm text-muted-foreground mt-1">A selection of leading doctors available at this facility.</p>
                </div>
                <DoctorsList doctors={hospital.doctors} />
              </section>

            </div>

            {/* Right Sticky Sidebar */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-[160px] lg:top-[200px]">
                
                <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
                  
                  {/* Top Branding / CTA */}
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-b border-border">
                    <h3 className="text-lg font-bold text-ink-strong mb-2">Interested in treatment here?</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Get a personalized quote, visa assistance, and free second opinion from our medical board.
                    </p>
                    <EnquiryDialog 
                      trigger={<Button size="lg" className="w-full text-base font-bold shadow-widget-orange hover:shadow-lg transition-shadow">Request a Quote</Button>}
                      payload={enquiryPayload}
                    />
                    <div className="text-center mt-3 text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      100% Free Consultation
                    </div>
                  </div>

                  {/* Quick Contact & Links */}
                  <div className="p-6 flex flex-col gap-4">
                    {hospital.contact && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-ink-strong" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Helpline</div>
                          <div className="font-semibold text-sm">{hospital.contact}</div>
                        </div>
                      </div>
                    )}
                    
                    {hospital.website && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <Globe className="w-4 h-4 text-ink-strong" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Website</div>
                          <a href={hospital.website.startsWith('http') ? hospital.website : `https://${hospital.website}`} target="_blank" rel="noreferrer" className="font-semibold text-sm text-primary hover:underline line-clamp-1">
                            {hospital.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amenities Summary */}
                  {hospital.amenities && hospital.amenities.length > 0 && (
                    <div className="px-6 pb-6">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Key Patient Services</div>
                      <div className="flex flex-wrap gap-2">
                        {hospital.amenities.map(am => (
                          <span key={am} className="text-xs bg-sunk px-2 py-1 rounded border border-border/50 capitalize">
                            {am.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Sliders */}
          <div className="mt-8 border-t border-border/50 pt-4">
            {recommendedHospitals.length > 0 && (
              <ShowcaseSlider 
                title={`More Hospitals in ${hospital.city}`} 
                items={recommendedHospitals.map(h => ({
                  id: h.slug,
                  title: h.name,
                  subtitle: h.type ? `${h.type} Hospital` : '',
                  image: h.images?.[0] || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=400&h=400',
                  link: `/hospitals/${h.slug}`
                }))}
              />
            )}
            
            <ShowcaseSlider 
              title="Top destinations" 
              items={TOP_DESTINATIONS} 
              rounded="rounded-xl"
            />
          </div>

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
