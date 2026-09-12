'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getCategoryById, updateCategory } from '@/services/category';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { currentUser, appUser, loading } = useAuth();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
    if (id && appUser?.role === 'admin') {
      const fetchCategory = async () => {
        try {
          const category = await getCategoryById(id as string);
          if (category) {
            setName(category.name);
            setSlug(category.slug);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchCategory();
    }
  }, [id, currentUser, appUser, loading, router]);

  if (loading || !currentUser || appUser?.role !== 'admin') {
    return <div className="container py-16 text-center">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateCategory(id as string, {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      });
      router.push('/admin/categories');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-md">
        <h1 className="text-4xl font-bold mb-8">Edit Category</h1>
        {error && <div className="mb-4 p-3 rounded bg-red-500/10 text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Category'}</Button>
        </form>
      </main>
      <Footer />
    </>
  );
}