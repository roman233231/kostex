'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getFeatureById, updateFeature } from '@/services/feature';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function EditFeaturePage() {
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
      const fetchFeature = async () => {
        try {
          const feature = await getFeatureById(id as string);
          if (feature) {
            setForm({
              name: feature.name,
              description: feature.description,
              price: feature.price,
              estimatedTime: feature.estimatedTime,
              active: feature.active,
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchFeature();
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
      await updateFeature(id as string, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        estimatedTime: form.estimatedTime,
        active: form.active,
      });
      router.push('/admin/features');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update feature');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Edit Feature</h1>
        {error && <div className="mb-4 p-3 rounded bg-red-500/10 text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <Input label="Price (UAH)" type="number" value={form.price} onChange={(e) => setForm({...form, price: Number(e.target.value)})} />
          <Input label="Estimated Time" value={form.estimatedTime} onChange={(e) => setForm({...form, estimatedTime: e.target.value})} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({...form, active: e.target.checked})} />
            <span className="text-sm text-white/80">Active</span>
          </label>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Feature'}</Button>
        </form>
      </main>
      <Footer />
    </>
  );
}