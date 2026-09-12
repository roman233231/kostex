'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createCategory } from '@/services/category';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function NewCategoryPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
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
      <main className="container py-16 max-w-md">
        <h1 className="text-4xl font-bold mb-8">Add Category</h1>
        {error && <div className="mb-4 p-3 rounded bg-red-500/10 text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Slug (optional)" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated if empty" />
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Category'}</Button>
        </form>
      </main>
      <Footer />
    </>
  );
}