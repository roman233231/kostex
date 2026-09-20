'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getPortfolioById, updatePortfolioItem } from '@/services/portfolio';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

export default function EditPortfolioPage() {
  const { id } = useParams();
  const router = useRouter();
  const { currentUser, appUser, loading } = useAuth();
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
    if (id && appUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          const item = await getPortfolioById(id as string);
          if (item) {
            setForm({
              title: item.title,
              slug: item.slug,
              category: item.category,
              description: item.description,
              image: item.image || '',
              demoUrl: item.demoUrl || '',
              technologies: item.technologies.join(', '),
              features: item.features.join(', '),
              published: item.published,
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
  }, [id, currentUser, appUser, loading, router]);

  if (loading || !form) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updatePortfolioItem(id as string, {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        category: form.category,
        description: form.description,
        image: form.image,
        demoUrl: form.demoUrl,
        technologies: form.technologies.split(',').map((t: string) => t.trim()).filter(Boolean),
        features: form.features.split(',').map((f: string) => f.trim()).filter(Boolean),
        published: form.published,
      });
      router.push('/admin/portfolio');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-12 max-w-3xl">
        <Reveal>
          <div className="mb-8">
            <Badge>Admin</Badge>
            <h1 className="text-4xl font-bold mt-4 tracking-tight">Edit Portfolio Item</h1>
          </div>
        </Reveal>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <Reveal delay={80}>
          <Card hover={false}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <Input label="Demo URL" value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />
              <Input label="Technologies (comma separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
              <Input label="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 accent-[var(--purple)]"
                />
                <span className="text-sm text-[var(--text-secondary)]">Published</span>
              </label>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/admin/portfolio')}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}