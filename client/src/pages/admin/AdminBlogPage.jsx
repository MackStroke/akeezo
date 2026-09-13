import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  Sparkles,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../components/ui/dialog';
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
} from '../../components/ui/alert-dialog';
import {
  getStoredBlogPosts,
  addOrUpdateBlogPost,
  deleteBlogPost,
  toggleBlogPostStatus,
} from '../../lib/blogStore';
import { cn } from '../../lib/utils';

const CATEGORIES = ['Medical Tourism', 'Emergency Care', 'Home Healthcare', 'Travel & Visa', 'Patient Stories'];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Editor Dialog State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Medical Tourism');
  const [formAuthor, setFormAuthor] = useState('AKEEZO Care Desk');
  const [formAuthorRole, setFormAuthorRole] = useState('Medical Travel Coordinator');
  const [formCoverImage, setFormCoverImage] = useState('https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&auto=format&fit=crop&q=80');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formStatus, setFormStatus] = useState('Published');
  const [formFeatured, setFormFeatured] = useState(false);

  useEffect(() => {
    refreshPosts();
  }, []);

  const refreshPosts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/blog', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setPosts(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormCategory('Medical Tourism');
    setFormAuthor('AKEEZO Care Desk');
    setFormAuthorRole('Medical Travel Coordinator');
    setFormCoverImage('https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&auto=format&fit=crop&q=80');
    setFormExcerpt('');
    setFormContent('');
    setFormStatus('Published');
    setFormFeatured(false);
    setEditorOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormTitle(post.title || '');
    setFormCategory(post.category || 'Medical Tourism');
    setFormAuthor(post.author || 'AKEEZO Care Desk');
    setFormAuthorRole(post.authorRole || 'Medical Travel Coordinator');
    setFormCoverImage(post.coverImage || '');
    setFormExcerpt(post.excerpt || '');
    setFormContent(post.content || '');
    setFormStatus(post.status || 'Published');
    setFormFeatured(!!post.featured);
    setEditorOpen(true);
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formTitle || !formContent) return;

    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        _id: editingPost?._id || editingPost?.id, // support old data
        title: formTitle,
        category: formCategory,
        author: formAuthor,
        authorRole: formAuthorRole,
        coverImage: formCoverImage,
        excerpt: formExcerpt,
        content: formContent,
        status: formStatus,
        featured: formFeatured,
        views: editingPost?.views || 0,
        date: editingPost?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      };

      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditorOpen(false);
        refreshPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/admin/blog/${id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || post.category === categoryFilter;
    const matchesStatus = statusFilter === '' || post.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPublished = posts.filter((p) => p.status === 'Published').length;
  const totalDrafts = posts.filter((p) => p.status === 'Draft').length;
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink-strong flex items-center gap-2">
            <BookOpen className="size-7 text-primary" /> Blog & Content Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create, edit, and publish healthcare guides and patient articles for the website.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="cta-gradient text-white font-bold gap-2 shadow-md">
          <Plus className="size-4" /> Create New Article
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Articles</p>
              <p className="text-2xl font-black text-ink-strong mt-1">{posts.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Published</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{totalPublished}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Drafts</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{totalDrafts}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Views</p>
              <p className="text-2xl font-black text-sky-600 mt-1">{totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <TrendingUp className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Articles Card */}
      <Card className="bg-card border-border shadow-widget">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-ink-strong">All Blog Articles</CardTitle>
              <CardDescription>Manage published posts, drafts, and featured guides.</CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full bg-background text-xs"
                />
              </div>

              <select
                className="h-9 px-3 text-xs bg-background border rounded-md font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                className="h-9 px-3 text-xs bg-background border rounded-md font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 font-bold text-muted-foreground text-xs uppercase">
                <tr className="border-b">
                  <th className="h-11 px-6">Article Details</th>
                  <th className="h-11 px-6">Category</th>
                  <th className="h-11 px-6">Status</th>
                  <th className="h-11 px-6">Author & Date</th>
                  <th className="h-11 px-6">Views</th>
                  <th className="h-11 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr key={post._id || post.id} className="border-b transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="size-12 rounded-lg object-cover border shrink-0 bg-muted"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              {post.featured && (
                                <Badge className="bg-primary/20 text-primary text-[0.65rem] px-1.5 font-bold">
                                  <Sparkles className="size-3 mr-0.5" /> Featured
                                </Badge>
                              )}
                              <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-foreground hover:text-primary hover:underline line-clamp-1"
                              >
                                {post.title}
                              </a>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.excerpt}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <Badge variant="outline" className="text-xs font-bold border-border">
                          {post.category}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(post._id || post.id)}
                          className="cursor-pointer"
                        >
                          <Badge
                            className={cn(
                              'font-bold text-xs cursor-pointer',
                              post.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                            )}
                          >
                            {post.status}
                          </Badge>
                        </button>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <p className="font-bold text-xs text-ink-strong">{post.author}</p>
                        <p className="text-[0.72rem] text-muted-foreground">{post.date}</p>
                      </td>

                      <td className="px-6 py-4 align-middle font-mono text-xs font-bold text-muted-foreground">
                        {post.views || 0}
                      </td>

                      <td className="px-6 py-4 align-middle text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(post)}
                          className="text-xs font-bold"
                        >
                          <Edit className="size-3.5 mr-1 text-primary" /> Edit
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-destructive hover:bg-destructive/10">
                              <Trash2 className="size-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{post.title}"? This action will permanently remove it from the public website.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePost(post._id || post.id)}
                                className="bg-destructive text-white hover:bg-destructive/90 font-bold"
                              >
                                Delete Article
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="h-32 text-center text-muted-foreground">
                      No blog articles found. Click "Create New Article" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Editor Modal Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-ink-strong">
              {editingPost ? 'Edit Blog Article' : 'Create New Blog Article'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Fill in article content and metadata. Changes publish live to the website.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 text-xs pt-2">
            <div className="space-y-1">
              <Label htmlFor="title" className="font-bold">Article Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g. Ultimate Guide to Medical Travel in India"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                className="text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="category" className="font-bold">Category *</Label>
                <select
                  id="category"
                  className="w-full h-9 px-3 text-xs bg-background border rounded-md font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="status" className="font-bold">Publish Status</Label>
                <select
                  id="status"
                  className="w-full h-9 px-3 text-xs bg-background border rounded-md font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                >
                  <option value="Published">Published (Live on Website)</option>
                  <option value="Draft">Draft (Internal Only)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="author" className="font-bold">Author Name</Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Dr. Ananya Sharma"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="authorRole" className="font-bold">Author Role / Designation</Label>
                <Input
                  id="authorRole"
                  type="text"
                  placeholder="Head of International Care"
                  value={formAuthorRole}
                  onChange={(e) => setFormAuthorRole(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="coverImage" className="font-bold">Cover Image URL</Label>
              <Input
                id="coverImage"
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={formCoverImage}
                onChange={(e) => setFormCoverImage(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="excerpt" className="font-bold">Article Excerpt / Summary</Label>
              <Input
                id="excerpt"
                type="text"
                placeholder="Short 2-sentence summary visible on blog cards"
                value={formExcerpt}
                onChange={(e) => setFormExcerpt(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="content" className="font-bold">Full Article Content (Markdown / Text) *</Label>
              <textarea
                id="content"
                rows={8}
                placeholder="Write full article paragraphs here. Use ### for section headings..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                required
                className="w-full p-3 bg-background border rounded-md text-xs font-mono leading-relaxed outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="featured"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <Label htmlFor="featured" className="cursor-pointer font-bold">
                Feature as Hero Article on Blog Page
              </Label>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setEditorOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="cta-gradient text-white font-bold">
                {editingPost ? 'Save Article Changes' : 'Publish Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
