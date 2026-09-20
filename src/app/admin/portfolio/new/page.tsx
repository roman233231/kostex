'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createPortfolioItem } from '@/services/portfolio';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

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
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
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
        technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
        published: form.published,
      });
      router.push('/admin/portfolio');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create item');
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
            <h1 className="text-4xl font-bold mt-4 tracking-tight">Add Portfolio Item</h1>
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
              <Input
                label="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Auto Service Website"
                required
              />
              <Input
                label="Slug (optional)"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-service-website"
              />
              <Input
                label="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="websites"
                required
              />
              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description of the project..."
                required
              />
              <Input
                label="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
              <Input
                label="Demo URL"
                value={form.demoUrl}
                onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                placeholder="https://..."
              />
              <Input
                label="Technologies (comma separated)"
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                placeholder="Next.js, Firebase, Tailwind"
              />
              <Input
                label="Features (comma separated)"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder="Online Booking, Contact Form"
              />
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
                  {saving ? 'Creating...' : 'Create Item'}
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