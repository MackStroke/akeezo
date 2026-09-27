import { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  HelpCircle,
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
import { cn } from '../../lib/utils';

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Editor Dialog State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  // Form Fields
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formOrder, setFormOrder] = useState(0);
  const [formStatus, setFormStatus] = useState('Published');

  useEffect(() => {
    refreshFaqs();
  }, []);

  const refreshFaqs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/faqs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setFaqs(json.data);
        const uniqueCategories = [...new Set(json.data.map(faq => faq.category))].filter(Boolean);
        if (!uniqueCategories.includes('General')) uniqueCategories.push('General');
        if (!uniqueCategories.includes('Partner Help')) uniqueCategories.push('Partner Help');
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('General');
    setFormOrder(0);
    setFormStatus('Published');
    setEditorOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question || '');
    setFormAnswer(faq.answer || '');
    setFormCategory(faq.category || 'General');
    setFormOrder(faq.order || 0);
    setFormStatus(faq.status || 'Published');
    setEditorOpen(true);
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formQuestion || !formAnswer) return;

    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        question: formQuestion,
        answer: formAnswer,
        category: formCategory,
        order: Number(formOrder),
        status: formStatus,
      };

      const url = editingFaq ? `/api/admin/faqs/${editingFaq._id || editingFaq.id}` : '/api/admin/faqs';
      const method = editingFaq ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setEditorOpen(false);
        refreshFaqs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (faq) => {
    try {
      const token = localStorage.getItem('adminToken');
      const newStatus = faq.status === 'Published' ? 'Draft' : 'Published';
      await fetch(`/api/admin/faqs/${faq._id || faq.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      refreshFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFaq = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || faq.category === categoryFilter;
    const matchesStatus = statusFilter === '' || faq.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPublished = faqs.filter((f) => f.status === 'Published').length;
  const totalDrafts = faqs.filter((f) => f.status === 'Draft').length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink-strong flex items-center gap-2">
            <HelpCircle className="size-7 text-primary" /> FAQ Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage Frequently Asked Questions and categories for the FAQ page.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleOpenCreate} className="cta-gradient text-white font-bold gap-2 shadow-md">
            <Plus className="size-4" /> Create FAQ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Total FAQs</p>
              <p className="text-2xl font-black text-ink-strong mt-1">{faqs.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="size-5" />
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
      </div>

      <Card className="bg-card border-border shadow-widget">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-ink-strong">All FAQs</CardTitle>
              <CardDescription>Manage FAQ entries, categories, and order.</CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
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
                {categories.map((c) => (
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
                  <th className="h-11 px-6">Question & Answer</th>
                  <th className="h-11 px-6 w-32">Category</th>
                  <th className="h-11 px-6 w-24">Order</th>
                  <th className="h-11 px-6 w-28">Status</th>
                  <th className="h-11 px-6 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => {
                    const faqId = faq._id || faq.id;
                    return (
                    <tr key={faqId} className="border-b transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 align-middle">
                        <div className="font-bold text-foreground mb-1">{faq.question}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{faq.answer}</div>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <Badge variant="outline" className="text-xs font-bold border-border">
                          {faq.category}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 align-middle font-mono text-xs font-bold text-muted-foreground">
                        {faq.order}
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(faq)}
                          className="cursor-pointer"
                        >
                          <Badge
                            className={cn(
                              'font-bold text-xs cursor-pointer',
                              faq.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                            )}
                          >
                            {faq.status}
                          </Badge>
                        </button>
                      </td>

                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-primary"
                          title="Edit FAQ"
                          onClick={() => handleOpenEdit(faq)}
                        >
                          <Edit className="size-3.5" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              title="Delete FAQ"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this FAQ? This will permanently remove it from the public website.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFaq(faqId)}
                                className="bg-destructive text-white hover:bg-destructive/90 font-bold"
                              >
                                Delete FAQ
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        </div>
                      </td>
                    </tr>
                   );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="h-32 text-center text-muted-foreground">
                      No FAQs found. Click "Create FAQ" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-ink-strong">
              {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Fill in FAQ content and metadata. Changes publish live to the website.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 text-xs pt-2">
            <div className="space-y-1">
              <Label htmlFor="question" className="font-bold">Question *</Label>
              <Input
                id="question"
                type="text"
                placeholder="e.g. How does Akeezo help patients?"
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                required
                className="text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="answer" className="font-bold">Answer *</Label>
              <textarea
                id="answer"
                rows={4}
                placeholder="Provide a clear, concise answer..."
                value={formAnswer}
                onChange={(e) => setFormAnswer(e.target.value)}
                required
                className="w-full p-3 bg-background border rounded-md text-xs font-mono leading-relaxed outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="category" className="font-bold">Category *</Label>
                <div className="relative">
                  <Input
                    id="category"
                    type="text"
                    list="category-options"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="text-xs"
                    required
                  />
                  <datalist id="category-options">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Type to add a new category or select existing.</p>
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

            <div className="space-y-1 w-full sm:w-1/2">
              <Label htmlFor="order" className="font-bold">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formOrder}
                onChange={(e) => setFormOrder(e.target.value)}
                className="text-xs"
              />
              <p className="text-[10px] text-muted-foreground mt-0.5">Lower numbers appear first within the same category.</p>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setEditorOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="cta-gradient text-white font-bold">
                {editingFaq ? 'Save FAQ Changes' : 'Publish FAQ'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
