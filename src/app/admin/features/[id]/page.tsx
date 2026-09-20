'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getFeatureById, updateFeature } from '@/services/feature';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

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
      const fetchData = async () => {
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
      <main className="container py-12 max-w-2xl">
        <Reveal>
          <div className="mb-8">
            <Badge>Admin</Badge>
            <h1 className="text-4xl font-bold mt-4 tracking-tight">Edit Feature</h1>
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
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Price (₴)"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  required
                />
                <Input
                  label="Estimated Time"
                  value={form.estimatedTime}
                  onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                  required
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 accent-[var(--purple)]"
                />
                <span className="text-sm text-[var(--text-secondary)]">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/admin/features')}>
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