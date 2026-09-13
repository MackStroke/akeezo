import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Tag,
  Eye,
  HeartPulse,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoredBlogPosts } from '@/lib/blogStore';

const CATEGORIES = ['All', 'Medical Tourism', 'Emergency Care', 'Home Healthcare', 'Travel & Visa'];

const blogPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AKEEZO Healthcare & Medical Tourism Blog',
  url: 'https://www.akeezo.com/blog',
  description:
    'Guides and articles on medical tourism in India, hospital selection, treatment cost estimates, emergency response, and home healthcare.',
  publisher: {
    '@type': 'Organization',
    name: 'AKEEZO',
    url: 'https://www.akeezo.com',
  },
  breadcrumb: {
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
    ],
  },
};

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const json = await res.json();
          // Filter to only published posts (though the API already does this)
          setPosts(json.data.filter(p => p.status === 'Published'));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const regularPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <SEO
        title="Medical Tourism & Healthcare Guides | AKEEZO Blog"
        description="Expert articles and complete patient guides on medical tourism in India, hospital selection, treatment cost estimates, medical visa support, and home healthcare."
        canonical="/blog"
        jsonLd={blogPageJsonLd}
      />
      <SiteHeader />

      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Banner Header */}
        <section className="bg-navy text-white relative py-12 sm:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-primary/20" />
          <div className="relative mx-auto max-w-[76rem] px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-sky-300 text-xs font-bold border border-white/20">
              <HeartPulse className="size-3.5 text-primary animate-pulse" />
              AKEEZO Healthcare Knowledge Hub
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Medical Tourism & Healthcare Journey Guides
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
              Expert articles on hospital selection in India, treatment cost estimates, medical visa procedures, and 24/7 care coordination.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles by title, topic, or treatment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 h-12 bg-white text-foreground rounded-full shadow-lg text-sm border-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter Chips */}
        <div className="mx-auto max-w-[76rem] px-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'cta-gradient text-white shadow-md'
                    : 'bg-card border border-border text-foreground hover:bg-secondary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mx-auto max-w-[76rem] px-4 space-y-12">
          {/* Featured Post Card (When 'All' selected & search is empty) */}
          {selectedCategory === 'All' && !searchTerm && featuredPost && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="size-4" /> Featured Guide
              </div>

              <Card className="overflow-hidden border-border bg-card shadow-widget hover:shadow-2xl transition-all rounded-2xl group">
                <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 relative overflow-hidden aspect-[16/9] lg:aspect-auto">
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground font-bold text-xs">
                        {featuredPost.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5 text-primary" /> {featuredPost.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5 text-primary" /> {featuredPost.readTime}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-ink-strong leading-tight group-hover:text-primary transition-colors">
                        <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={featuredPost.authorAvatar}
                          alt={featuredPost.author}
                          className="size-8 rounded-full object-cover border"
                        />
                        <div>
                          <p className="text-xs font-bold text-ink-strong">{featuredPost.author}</p>
                          <p className="text-[0.7rem] text-muted-foreground">{featuredPost.authorRole}</p>
                        </div>
                      </div>

                      <Button asChild size="sm" className="cta-gradient text-white font-bold text-xs rounded-full">
                        <Link to={`/blog/${featuredPost.slug}`}>
                          Read Guide <ArrowRight className="size-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Regular Articles Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink-strong">
                {selectedCategory === 'All' ? 'Latest Articles & Care Guides' : `${selectedCategory} Articles`}
              </h2>
              <span className="text-xs font-medium text-muted-foreground">
                Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(selectedCategory === 'All' && !searchTerm ? regularPosts : filteredPosts).map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden border-border bg-card shadow-card hover:shadow-widget transition-all rounded-2xl flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground font-bold text-[0.7rem] border border-border">
                          {post.category}
                        </Badge>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[0.72rem] text-muted-foreground font-medium">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                          {post.views > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Eye className="size-3" /> {post.views}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-ink-strong leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed pt-1">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-border/50 mt-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">{post.author}</span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        Read <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border space-y-3">
                <BookOpen className="size-10 text-muted-foreground mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-ink-strong">No Articles Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  No blog articles matched your search query "{searchTerm}". Try clearing your filters.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  variant="outline"
                  size="sm"
                  className="font-bold text-xs"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
