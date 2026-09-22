import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EnquiryDialog } from '@/components/EnquiryDialog';

export function PageNavigation({ hospital, enquiryPayload }) {
  const [activeSection, setActiveSection] = useState('about');

  const tabs = [
    { id: 'about', label: 'Overview' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'departments', label: 'Departments' },
    { id: 'excellence', label: 'Accreditations' },
    { id: 'estimates', label: 'Treatments' },
    { id: 'doctors', label: 'Doctors' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Offset for sticky header + nav height
      const scrollPosition = window.scrollY + 220; 

      for (const tab of tabs) {
        const element = document.getElementById(tab.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(tab.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset by roughly the height of both the SiteHeader + PageNavigation sticky navs
      const y = element.getBoundingClientRect().top + window.scrollY - 190; 
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Find lowest treatment price for the CTA
  const lowestPrice = hospital?.treatmentEstimates?.length > 0 
    ? Math.min(...hospital.treatmentEstimates.map(t => t.costRange?.min || Infinity))
    : null;

  return (
    <div className="sticky top-[72px] lg:top-[112px] z-30 bg-white border border-border shadow-sm md:rounded-lg mb-8 transition-all hidden md:flex items-center justify-between py-3 px-5 overflow-hidden">
      
      {/* Left side - Tabs */}
      <div 
        className="flex items-center gap-1 overflow-x-auto grow"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .flex.items-center.gap-1.overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}} />
        {tabs.map(tab => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            onClick={(e) => scrollToSection(e, tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              activeSection === tab.id
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-ink-strong'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Right side - CTA (Price & Button) */}
      <div className="flex items-center gap-4 shrink-0 pl-4 ml-4 border-l border-border/50">
        {lowestPrice && lowestPrice !== Infinity && (
          <div className="flex flex-col items-end justify-center">
            <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5 leading-none">
              Treatments from
            </span>
            <span className="text-base font-black text-ink-strong leading-none">
              ₹ {lowestPrice.toLocaleString('en-IN')}
            </span>
          </div>
        )}
        <EnquiryDialog 
          trigger={<Button className="font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 rounded-full px-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 active:scale-95">Get a Quote</Button>}
          payload={enquiryPayload}
          customSuccessMessage="Our executive will reach out to you for guidance and dedicated Quote offering."
        />
      </div>
    </div>
  );
}
