import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Printer,
  Mail,
  List,
  ArrowUp,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const POLICY_PAGES = [
  {
    path: '/privacy',
    title: 'Privacy Policy',
    icon: ShieldCheck,
    subtitle: 'GDPR, HIPAA & DPDP Compliant Data Protection',
  },
  {
    path: '/terms',
    title: 'Terms of Service',
    icon: FileText,
    subtitle: 'Platform Usage & Facilitation Agreement',
  },
  {
    path: '/disclaimer',
    title: 'Medical Disclaimer',
    icon: AlertTriangle,
    subtitle: 'Non-Clinical Role & Physician Authority Statement',
  },
  {
    path: '/consent',
    title: 'Patient Data & Consent',
    icon: FileCheck,
    subtitle: 'Cross-Border PHI Transfer & Care Authorization',
  },
];

export function LegalLayout({ title, subtitle, category, lastUpdated, toc = [], children }) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(toc[0]?.id || '');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Intersection tracking for TOC
      const headings = toc.map((item) => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 160;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading.offsetTop <= scrollPosition) {
          setActiveSection(heading.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <SiteHeader />

      <main className="flex-1 pb-16">
        {/* Dark Navy Header Banner */}
        <section className="bg-navy text-white relative py-12 sm:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-primary/20" />
          <div className="relative mx-auto max-w-[76rem] px-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/20 text-primary-foreground border-primary/30 text-xs font-bold px-3 py-1">
                {category || 'Legal Governance'}
              </Badge>
              <span className="text-xs text-white/70">
                Last Updated: <strong className="text-white">{lastUpdated || 'September 13, 2026'}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          </div>
        </section>

        {/* 2-Column Main Content with Sticky Left Index */}
        <div className="mx-auto max-w-[76rem] px-4 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sticky Index Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              {/* Document Nav Selector */}
              <Card className="p-4 border-border bg-card shadow-xs rounded-xl space-y-3">
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground block border-b border-border/60 pb-2">
                  Legal Documents
                </span>
                <nav className="flex flex-col gap-1">
                  {POLICY_PAGES.map((page) => {
                    const PageIcon = page.icon;
                    const isActive = location.pathname === page.path;
                    return (
                      <Link
                        key={page.path}
                        to={page.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-ink-strong hover:bg-accent hover:text-primary'
                        }`}
                      >
                        <PageIcon className={`size-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                        <span className="flex-1 truncate">{page.title}</span>
                        <ChevronRight className="size-3.5 opacity-60" />
                      </Link>
                    );
                  })}
                </nav>
              </Card>

              {/* Sticky Table of Contents (Index) */}
              {toc.length > 0 && (
                <Card className="p-4 border-border bg-card shadow-xs rounded-xl space-y-3 hidden sm:block">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <List className="size-3.5 text-primary" /> On This Page Index
                    </span>
                    <span className="text-[0.65rem] font-mono text-muted-foreground">{toc.length} sections</span>
                  </div>
                  <nav className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
                    {toc.map((item, idx) => {
                      const isSelected = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          className={`text-left px-3 py-2 rounded-md text-xs font-semibold transition-all flex items-start gap-2 ${
                            isSelected
                              ? 'bg-accent/80 text-primary font-bold border-l-2 border-primary pl-2.5'
                              : 'text-muted-foreground hover:bg-muted hover:text-ink-strong'
                          }`}
                        >
                          <span className="text-[0.65rem] font-mono text-muted-foreground shrink-0 mt-0.5">
                            {idx + 1}.
                          </span>
                          <span className="line-clamp-2 leading-tight">{item.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </Card>
              )}

              {/* Utility Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="flex-1 text-xs font-bold border-border hover:border-primary"
                >
                  <Printer className="size-3.5 mr-1.5" /> Print Document
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs font-bold border-border hover:border-primary"
                >
                  <a href="mailto:dpo@akeezo.com?subject=Legal%20Compliance%20Inquiry">
                    <Mail className="size-3.5 mr-1.5" /> Contact DPO
                  </a>
                </Button>
              </div>
            </aside>

            {/* Right Main Document Content Area */}
            <article className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-card space-y-8 prose prose-slate max-w-none dark:prose-invert">
              {children}
            </article>

          </div>
        </div>
      </main>

      {/* Back to Top Floating Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full bg-primary text-white shadow-xl hover:bg-primary/90 transition-all focus-visible:outline-none"
          aria-label="Back to top"
        >
          <ArrowUp className="size-5" />
        </button>
      )}

      <SiteFooter />
    </div>
  );
}
