'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createPortfolioItem } from '@/services/portfolio';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function NewPortfolioPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    image: '',
    demoUrl: '',
    technologies: '',
    features: '',
    published: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (loading || !currentUser || appUser?.role !== 'admin') {
    return <div className="container py-16 text-center">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createPortfolioItem({
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        description: form.description,
        category: form.category,
        image: form.image,
        demoUrl: form.demoUrl,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        published: form.published,
      });
      router.push('/admin/portfolio');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Add Portfolio Item</h1>
        {error && <div className="mb-4 p-3 rounded bg-red-500/10 text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
          <Input label="Slug (optional)" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} />
          <Input label="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} placeholder="websites, web-apps..." />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <Input label="Image URL" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="https://..." />
          <Input label="Demo URL" value={form.demoUrl} onChange={(e) => setForm({...form, demoUrl: e.target.value})} placeholder="https://..." />
          <Input label="Technologies (comma separated)" value={form.technologies} onChange={(e) => setForm({...form, technologies: e.target.value})} />
          <Input label="Features (comma separated)" value={form.features} onChange={(e) => setForm({...form, features: e.target.value})} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({...form, published: e.target.checked})} />
            <span className="text-sm text-white/80">Published</span>
          </label>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Item'}</Button>
        </form>
      </main>
      <Footer />
    </>
  );
}