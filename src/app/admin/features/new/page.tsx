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
import Reveal from '@/components/ui/Reveal';
import { ArrowLeft, Save, Zap } from 'lucide-react';
import Link from 'next/link';

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
      setError(err.message || 'Помилка створення');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-12 max-w-2xl">
        <Link
          href="/admin/features"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Назад до функцій
        </Link>

        <Reveal>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #14B8A6)',
                  boxShadow: '0 8px 24px -8px rgba(16,185,129,0.6)',
                }}
              >
                <Zap size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--purple-bright)]">
                Нова функція
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Додати функцію
            </h1>
          </div>
        </Reveal>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <Reveal delay={80}>
          <div
            className="color-card"
            style={
              {
                '--card-color-1': '#10B981',
                '--card-color-2': '#14B8A6',
                '--card-glow': 'rgba(16,185,129,0.5)',
              } as React.CSSProperties
            }
          >
            <div className="color-card-inner">
              <div className="color-card-content">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Назва"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Online Booking"
                    required
                  />

                  <Textarea
                    label="Опис"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Дозвольте клієнтам записуватись онлайн..."
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Ціна (₴)"
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      required
                    />
                    <Input
                      label="Термін"
                      value={form.estimatedTime}
                      onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
                      placeholder="1–2 дні"
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
                    <span className="text-sm text-[var(--text-secondary)]">
                      Активна
                    </span>
                  </label>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        'Створюємо...'
                      ) : (
                        <>
                          <Save size={16} /> Створити
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin/features')}
                    >
                      Скасувати
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}