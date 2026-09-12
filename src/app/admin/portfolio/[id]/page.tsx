'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getPortfolioById, updatePortfolioItem } from '@/services/portfolio';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

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
      const fetchItem = async () => {
        try {
          const item = await getPortfolioById(id as string);
          if (item) {
            setForm({
              title: item.title,
              slug: item.slug,
              description: item.description,
              category: item.category,
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
      fetchItem();
    }
  }, [id, currentUser, appUser, loading, router]);

  if (loading || !form) {
    return <div className="container py-16 text-center">Loading...</div>;
  }

  if (!currentUser || appUser?.role !== 'admin') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updatePortfolioItem(id as string, {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        description: form.description,
        category: form.category,
        image: form.image,
        demoUrl: form.demoUrl,
        technologies: form.technologies.split(',').map((t: string) => t.trim()).filter(Boolean),
        features: form.features.split(',').map((f: string) => f.trim()).filter(Boolean),
        published: form.published,
      });
      router.push('/admin/portfolio');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Edit Portfolio Item</h1>
        {error && <div className="mb-4 p-3 rounded bg-red-500/10 text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} />
          <Input label="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <Input label="Image URL" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} />
          <Input label="Demo URL" value={form.demoUrl} onChange={(e) => setForm({...form, demoUrl: e.target.value})} />
          <Input label="Technologies (comma separated)" value={form.technologies} onChange={(e) => setForm({...form, technologies: e.target.value})} />
          <Input label="Features (comma separated)" value={form.features} onChange={(e) => setForm({...form, features: e.target.value})} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({...form, published: e.target.checked})} />
            <span className="text-sm text-white/80">Published</span>
          </label>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Item'}</Button>
        </form>
      </main>
      <Footer />
    </>
  );
}