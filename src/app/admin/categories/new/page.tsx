'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createCategory } from '@/services/category';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

export default function NewCategoryPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
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
      await createCategory({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      });
      router.push('/admin/categories');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-12 max-w-md">
        <Reveal>
          <div className="mb-8">
            <Badge>Admin</Badge>
            <h1 className="text-4xl font-bold mt-4 tracking-tight">Add Category</h1>
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
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Websites"
                required
              />
              <Input
                label="Slug (optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="websites"
              />
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Creating...' : 'Create Category'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')}>
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