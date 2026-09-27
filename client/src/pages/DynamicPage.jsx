import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ChevronRight, Home } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { getPageBySlug } from '../lib/pagesStore';

export default function DynamicPage({ slug: propSlug }) {
  const { slug: paramSlug } = useParams();
  const slug = propSlug || paramSlug;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    const data = getPageBySlug(slug);
    setPage(data);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!page || page.status !== 'Published') {
    return <Navigate to="/" replace />;
  }

  const renderContent = (content) => {
    if (!content) return null;
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-extrabold text-ink-strong pt-6 pb-2">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-extrabold text-ink-strong pt-4 pb-2">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n');
        return (
          <ul key={index} className="space-y-2 pl-4 list-disc text-sm my-4">
            {items.map((item, idx) => (
              <li key={idx} className="font-medium text-foreground" dangerouslySetInnerHTML={{ __html: item.replace(/^[0-9]+\.\s+|^-\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </ul>
        );
      }
      
      // Basic bold formatting
      let formattedText = paragraph;
      formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      return (
        <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: formattedText }} />
      );
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO title={`${page.title} | Akeezo`} description={page.seoDescription || page.title} />

      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-navy py-12 md:py-20 text-white">
          <div className="mx-auto max-w-[76rem] px-4">
            <nav className="mb-6 flex items-center gap-2 text-sm text-white/70 font-medium">
              <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home className="size-4" />
                Home
              </Link>
              <ChevronRight className="size-4" />
              <span className="text-white">{page.title}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{page.title}</h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-[76rem] px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-foreground/90 leading-relaxed text-sm sm:text-base">
            {renderContent(page.content)}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
