'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProductById, updateProduct } from '@/services/product';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function EditProductPage() {
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
      const fetchProduct = async () => {
        try {
          const product = await getProductById(id as string);
          if (product) {
            setForm({
              title: product.title,
              slug: product.slug,
              category: product.category,
              shortDescription: product.shortDescription,
              description: product.description,
              startingPrice: product.startingPrice,
              estimatedTime: product.estimatedTime,
              tags: product.tags.join(', '),
              features: product.features.join(', '),
              pages: product.pages ? product.pages.join(', ') : '',
              demoUrl: product.demoUrl || '',
              published: product.published,
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchProduct();
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
      const productData = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        category: form.category,
        shortDescription: form.shortDescription,
        description: form.description,
        startingPrice: Number(form.startingPrice),
        estimatedTime: form.estimatedTime,
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        features: form.features.split(',').map((f: string) => f.trim()).filter(Boolean),
        pages: form.pages ? form.pages.split(',').map((p: string) => p.trim()).filter(Boolean) : [],
        demoUrl: form.demoUrl || '#',
        published: form.published,
      };
      await updateProduct(id as string, productData);
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Edit Product</h1>
        {error && <div className="mb-4 p-3 rounded bg-red-500/10 text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} />
          <div>
            <label className="text-sm font-medium text-white/80">Category</label>
            <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="mt-1 block w-full bg-surface-2 border border-white/10 rounded-md px-3 py-2 text-white">
              {['websites', 'web-apps', 'software', 'bots'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <Textarea label="Short Description" value={form.shortDescription} onChange={(e) => setForm({...form, shortDescription: e.target.value})} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <Input label="Starting Price (UAH)" type="number" value={form.startingPrice} onChange={(e) => setForm({...form, startingPrice: Number(e.target.value)})} />
          <Input label="Estimated Time" value={form.estimatedTime} onChange={(e) => setForm({...form, estimatedTime: e.target.value})} />
          <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} />
          <Input label="Features (comma separated)" value={form.features} onChange={(e) => setForm({...form, features: e.target.value})} />
          <Input label="Pages (comma separated)" value={form.pages} onChange={(e) => setForm({...form, pages: e.target.value})} />
          <Input label="Demo URL" value={form.demoUrl} onChange={(e) => setForm({...form, demoUrl: e.target.value})} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({...form, published: e.target.checked})} />
            <span className="text-sm text-white/80">Published</span>
          </label>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Product'}</Button>
        </form>
      </main>
      <Footer />
    </>
  );
}