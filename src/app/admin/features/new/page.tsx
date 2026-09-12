'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createFeature } from '@/services/feature';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function NewFeaturePage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    estimatedTime: '',
    active: true,
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
      await createFeature({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        estimatedTime: form.estimatedTime,
        active: form.active,
      });
      router.push('/admin/features');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create feature');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Add Feature</h1>
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
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Feature'}</Button>
        </form>
      </main>
      <Footer />
    </>
  );
}