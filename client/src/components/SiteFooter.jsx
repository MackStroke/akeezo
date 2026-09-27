import { Link } from 'react-router-dom';
import { ShieldAlert, HeartHandshake } from 'lucide-react';
import { site, formatPhone, telHref } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#f5f5f5] text-ink relative z-10" data-testid="full-footer">
      
      {/* 1. Quick Links (Inline list) */}
      <div className="border-b border-black/10">
        <div className="mx-auto max-w-[76rem] px-4 py-4">
          <nav aria-label="Quick Links">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <li><Link to="/hospitals" className="hover:underline">Hospitals in Delhi</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Hospitals in Mumbai</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Hospitals in Bangalore</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Hospitals in Chennai</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Hospitals in Hyderabad</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Hospitals in Pune</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Hospitals in Kolkata</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Cardiology</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Oncology</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Orthopedics</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Neurology</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Gastroenterology</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Gynecology & Obstetrics</Link></li>
              <li><Link to="/hospitals" className="hover:underline">IVF & Fertility</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Organ Transplant</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Ayurveda</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Dental Clinics</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Eye Hospitals</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Physiotherapy</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Skin & Hair Clinics</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Diagnostic Centers</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Rehabilitation Centers</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* 2. Main Columns */}
      <div className="mx-auto max-w-[76rem] px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 gap-y-12 text-sm">
          
          {/* Column 1 */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link to="/hospitals" className="hover:underline">Hospitals & Clinics</Link></li>
              <li><Link to="/doctors" className="hover:underline">Expert Doctors</Link></li>
              <li><Link to="/packages" className="hover:underline">Medical Packages</Link></li>
              <li><Link to="/medicines" className="hover:underline">Medicines & Supplements</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Surgeries & Procedures</Link></li>
              <li><Link to="/hospitals" className="hover:underline">Lab Tests & Diagnostics</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Support & Care</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#emergency" className="hover:underline">24/7 Emergency Dispatch</a></li>
              <li><a href="#home-care" className="hover:underline">Home Healthcare</a></li>
              <li><a href="#telehealth" className="hover:underline">Online Consultations</a></li>
              <li><a href="#post-op" className="hover:underline">Post-Surgery Recovery</a></li>
              <li><a href="#visa" className="hover:underline">Medical Visa Assistance</a></li>
              <li><a href={telHref(site.emergencyPhone)} className="hover:underline font-semibold text-ink-strong">Call: {formatPhone(site.emergencyPhone)}</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link to="/about" className="hover:underline">About Akeezo</Link></li>
              
              <li><Link to="/blog" className="hover:underline">Careers</Link></li>
              <li><Link to="/blog" className="hover:underline">Press & Media</Link></li>
              <li><Link to="/blog" className="hover:underline">Health Blog</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Terms & Settings</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link to="/legal" className="hover:underline">Privacy Notice</Link></li>
              <li><Link to="/legal" className="hover:underline">Terms of Service</Link></li>
              <li><Link to="/legal" className="hover:underline">Medical Disclaimer</Link></li>
              <li><Link to="/legal" className="hover:underline">Patient Consent</Link></li>
              <li><Link to="/legal" className="hover:underline">Refund Policy</Link></li>
              <li><Link to="/legal" className="hover:underline">Grievance Officer</Link></li>
            </ul>
          </div>

          {/* Column 5 */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Partners</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link to="/faq#partner-help" className="hover:underline">Partner Help Center</Link></li>
              <li><Link to="/join-partner" className="hover:underline">List your Hospital</Link></li>
              <li><Link to="/join-partner" className="hover:underline">Join as a Doctor</Link></li>
              <li><Link to="/join-partner" className="hover:underline">Join as Attendant</Link></li>
              <li><Link to="/join-partner" className="hover:underline">Join as Nurse</Link></li>
              <li><Link to="/join-partner" className="hover:underline">Join as Physiotherapist</Link></li>
              <li><Link to="/join-partner" className="hover:underline">Other partnerships</Link></li>
            </ul>
          </div>

        </div>
      
      <div className="mt-12 pt-8 border-t border-black/10 flex flex-col lg:flex-row justify-between items-center gap-8 w-full">
        
        {/* Contact Details (Left) */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center lg:justify-start items-center text-xs sm:text-sm">
          <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-call size-3.5" aria-hidden="true"><path d="M13 2a9 9 0 0 1 9 9"></path><path d="M13 6a5 5 0 0 1 5 5"></path><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>
                </span>
                <span className="font-bold text-ink-strong">24/7 Desk: </span>
                <a href="tel:+918287639443" className="font-bold text-primary underline">+91 82876 39443</a>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center items-center pt-0">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-handshake size-3.5" aria-hidden="true"><path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762"></path></svg>
                  </span>
                  <strong className="text-foreground font-semibold">Care Team: </strong>
                  <a href="mailto:care@akeezo.com" className="font-bold text-primary underline">care@akeezo.com</a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe size-3.5" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                  </span>
                  <strong className="text-foreground font-semibold">Medical Tourism: </strong>
                  <a href="mailto:medical@akeezo.com" className="font-bold text-primary underline">medical@akeezo.com</a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-handshake size-3.5" aria-hidden="true"><path d="m11 17 2 2a1 1 0 1 0 3-3"></path><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path><path d="m21 3 1 11h-2"></path><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"></path><path d="M3 4h8"></path></svg>
                  </span>
                  <strong className="text-foreground font-semibold">Partners: </strong>
                  <a href="mailto:partners@akeezo.com" className="font-bold text-primary underline">partners@akeezo.com</a>
                </div>
              </div>
            </div>
        </div>
        
        {/* Social links (Right) */}
        <div className="flex shrink-0">
{/* Social links */}
           <div className="flex flex-col items-center md:items-end gap-3">
             <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">Connect with AKEEZO</span>
             <div className="flex items-center justify-center md:justify-end gap-2 flex-wrap">
               <a href="https://facebook.com/akeezohealth" target="_blank" rel="noopener noreferrer" aria-label="AKEEZO on Facebook" className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-xs" title="Facebook"><svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg></a>
               <a href="https://instagram.com/akeezohealth" target="_blank" rel="noopener noreferrer" aria-label="AKEEZO on Instagram" className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-xs" title="Instagram"><svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg></a>
               <a href="https://x.com/akeezohealth" target="_blank" rel="noopener noreferrer" aria-label="AKEEZO on Twitter / X" className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-xs" title="Twitter / X"><svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a>
               <a href="https://linkedin.com/company/akeezo" target="_blank" rel="noopener noreferrer" aria-label="AKEEZO on LinkedIn" className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-xs" title="LinkedIn"><svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg></a>
               <a href="https://youtube.com/@akeezohealth" target="_blank" rel="noopener noreferrer" aria-label="AKEEZO on YouTube" className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-xs" title="YouTube"><svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg></a>
               <a href="https://wa.me/918287639443?text=Hello%20AKEEZO" target="_blank" rel="noopener noreferrer" aria-label="AKEEZO on WhatsApp" className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-xs" title="WhatsApp"><svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.415 1.065 2.747 1.213 2.945c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.794 0-3.557-.482-5.111-1.396l-.367-.217-3.797.996 1.014-3.7-.238-.379a9.85 9.85 0 0 1-1.516-5.26c0-5.446 4.431-9.877 9.877-9.877 2.638 0 5.119 1.028 6.984 2.894 1.865 1.866 2.892 4.347 2.891 6.985 0 5.447-4.431 9.878-9.877 9.878"></path></svg></a>
             </div>
           </div>
           

        </div>
        
      </div>

      {/* 3. Bottom Control Section */}
      <div className="mx-auto max-w-[76rem] px-4 pb-20 sm:pb-8">
        
        {/* Language & Currency Pickers */}
        <div className="flex gap-4 mb-6">
          <button className="flex items-center justify-center w-8 h-8 rounded-full border border-black/20 hover:bg-black/5 transition-colors" aria-label="Language: English">
            <img src="https://t-cf.bstatic.com/design-assets/assets/v3.202.0/images-flags/In@3x.png" alt="English (India)" className="w-5 h-5 rounded-full object-cover" />
          </button>
          <button className="flex items-center justify-center px-3 h-8 rounded-full border border-black/20 hover:bg-black/5 transition-colors font-medium text-xs" aria-label="Currency: INR">
            INR
          </button>
        </div>

        <hr className="border-black/10 mb-6" aria-hidden="true" />
        
        {/* Copyright & Disclaimer */}
        <div className="text-center text-xs text-muted-foreground space-y-2 mb-8">
          <p>
            Akeezo is your trusted healthcare journey partner, seamlessly connecting you with top hospitals and doctors.
            <br className="hidden sm:block" />
            Healthcare services are delivered by independent medical professionals and accredited facilities.
          </p>
          <p>Copyright &copy; 1996&ndash;{year} Akeezo&trade;. All rights reserved.</p>
        </div>
        
        {/* Social & Logos */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-black/10 pt-8 mt-8">
           
           {/* Logos */}
           <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 opacity-80">
             <img src="/images/logo-dark.svg" alt="Akeezo" className="h-6 object-contain" />
             <div className="h-6 flex items-center gap-2 font-bold text-lg tracking-tight">
               <ShieldAlert className="size-5" /> Verified
             </div>
             <div className="h-6 flex items-center gap-2 font-bold text-lg tracking-tight">
               <HeartHandshake className="size-5" /> Trusted
             </div>
           </div>

                              </div>

      </div>
    </footer>
  );
}
