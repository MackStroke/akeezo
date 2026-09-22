import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
  HeartPulse,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Building2,
  Eye,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getBlogPostBySlug, getStoredBlogPosts } from '@/lib/blogStore';
import { site, formatPhone, telHref, whatsappHref } from '@/lib/site';

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const json = await res.json();
          setPost(json.data);
          
          // Fetch related posts (for now, just all and slice)
          const allRes = await fetch('/api/blog');
          if (allRes.ok) {
            const allJson = await allRes.json();
            setRelatedPosts(allJson.data.filter(p => p.slug !== slug).slice(0, 3));
          }
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error(err);
        setPost(null);
      }
    }
    fetchPost();
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <SEO title="Article Not Found" noindex={true} />
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-card border-border text-center p-8 space-y-4 shadow-widget">
            <h2 className="text-2xl font-black text-ink-strong">Article Not Found</h2>
            <p className="text-xs text-muted-foreground">
              The article you are looking for may have been removed or updated.
            </p>
            <Button onClick={() => navigate('/blog')} className="w-full cta-gradient text-white font-bold text-xs">
              <ArrowLeft className="size-4 mr-2" /> Back to Blog Knowledge Hub
            </Button>
          </Card>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const postJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `https://www.akeezo.com/blog/${post.slug}#article`,
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        datePublished: post.date,
        author: {
          '@type': 'Person',
          name: post.author,
          jobTitle: post.authorRole,
        },
        publisher: {
          '@type': 'Organization',
          name: 'AKEEZO Healthcare',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.akeezo.com/images/logo-light.svg',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.akeezo.com/blog/${post.slug}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.akeezo.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://www.akeezo.com/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `https://www.akeezo.com/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogImage={post.coverImage}
        ogType="article"
        jsonLd={postJsonLd}
        keywords={post.tags?.join(', ') || `AKEEZO Blog, ${post.category}, Medical Tourism India, Healthcare Journey`}
      />
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" /> Back to All Articles
          </Link>
          <Badge variant="outline" className="text-xs font-bold border-border">
            {post.category}
          </Badge>
        </div>

        {/* Article Header */}
        <header className="space-y-4 max-w-4xl mx-auto text-left">
          <h1 className="text-2xl sm:text-4xl font-black text-ink-strong tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-y border-border py-3">
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="size-10 rounded-full object-cover border"
              />
              <div>
                <p className="text-xs font-bold text-ink-strong">{post.author}</p>
                <p className="text-[0.72rem] text-muted-foreground">{post.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5 text-primary" /> {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-primary" /> {post.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border shadow-widget aspect-[16/9] bg-muted">
          <img src={post.coverImage} alt={post.title} className="size-full object-cover" />
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Main Article Body */}
          <article className="lg:col-span-8 space-y-6 text-sm sm:text-base leading-relaxed text-foreground/90">
            {/* Render formatted paragraphs */}
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-extrabold text-ink-strong pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                const items = paragraph.split('\n');
                return (
                  <ul key={index} className="space-y-2 pl-4 list-disc text-sm">
                    {items.map((item, idx) => (
                      <li key={idx} className="font-medium text-foreground">
                        {item.replace(/^[0-9]+\.\s+|^-\s+/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}

            {/* Key Takeaways Callout */}
            <div className="p-6 rounded-2xl bg-secondary/60 border border-primary/20 space-y-3 mt-8">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <CheckCircle2 className="size-5" /> Key Takeaway & Next Steps
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                AKEEZO coordinates end-to-end medical journeys in India — providing side-by-side hospital options, specialist doctor opinions in 24 hours, medical visa invitation letters, and 24/7 care concierge support.
              </p>
            </div>
          </article>

          {/* Sidebar Inquiry CTA */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="bg-card border-border shadow-widget rounded-2xl p-6 space-y-5 sticky top-24">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold border border-border">
                <HeartPulse className="size-3.5 text-primary" /> Need Treatment Guidance?
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-ink-strong leading-tight">
                  Get Free Doctor & Hospital Advice
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Submit your diagnostic reports to receive expert hospital options and itemized cost estimates.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  asChild
                  className="w-full cta-gradient text-white font-bold py-2.5 text-xs rounded-lg"
                >
                  <a href={whatsappHref('Hello AKEEZO, I read your article "' + post.title + '" and would like advice.')} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="size-4 mr-1.5" /> Request Doctor Advice
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full font-bold text-xs rounded-lg"
                >
                  <a href={telHref(site.emergencyPhone)}>
                    <PhoneCall className="size-4 mr-1.5 text-primary" /> Call Care Desk: {formatPhone(site.emergencyPhone)}
                  </a>
                </Button>
              </div>

              <div className="pt-3 border-t border-border space-y-2 text-[0.72rem] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary shrink-0" />
                  <span>100% Confidential & HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-primary shrink-0" />
                  <span>40+ JCI & NABH Partner Hospitals</span>
                </div>
              </div>
            </Card>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 border-t border-border space-y-6 max-w-6xl mx-auto">
            <h3 className="text-xl font-bold text-ink-strong">Related Patient Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <Card key={rPost.id} className="overflow-hidden border-border bg-card shadow-card hover:shadow-widget transition-all rounded-2xl">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img src={rPost.coverImage} alt={rPost.title} className="size-full object-cover" />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <Badge variant="outline" className="text-[0.68rem] font-bold">
                      {rPost.category}
                    </Badge>
                    <h4 className="text-sm font-bold text-ink-strong line-clamp-2 hover:text-primary transition-colors">
                      <Link to={`/blog/${rPost.slug}`}>{rPost.title}</Link>
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{rPost.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
