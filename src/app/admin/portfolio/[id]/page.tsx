'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getPortfolioById, updatePortfolioItem } from '@/services/portfolio';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function EditPortfolioPage() {
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
          const item = await getPortfolioById(id as string);
          if (item) {
            setForm({
              title: item.title,
              slug: item.slug,
              category: item.category,
              description: item.description,
              image: item.image || '',
              demoUrl: item.demoUrl || '',
              technologies: item.technologies.join(', '),
              features: item.features.join(', '),
              published: item.published,
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
      await updatePortfolioItem(id as string, {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        category: form.category,
        description: form.description,
        image: form.image,
        demoUrl: form.demoUrl,
        technologies: form.technologies.split(',').map((t: string) => t.trim()).filter(Boolean),
        features: form.features.split(',').map((f: string) => f.trim()).filter(Boolean),
        published: form.published,
      });
      router.push('/admin/portfolio');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Помилка оновлення');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-12 max-w-3xl">
        <Link
          href="/admin/portfolio"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Назад до портфоліо
        </Link>

        <Reveal>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                style={{
                  background: 'linear-gradient(135deg, #D946EF, #A855F7)',
                  boxShadow: '0 8px 24px -8px rgba(217,70,239,0.6)',
                }}
              >
                <ImageIcon size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--purple-bright)]">
                Редагування
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {form.title || 'Кейс'}
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
                '--card-color-1': '#D946EF',
                '--card-color-2': '#A855F7',
                '--card-glow': 'rgba(217,70,239,0.5)',
              } as React.CSSProperties
            }
          >
            <div className="color-card-inner">
              <div className="color-card-content">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Назва"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                  <Input
                    label="Slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                  <Input
                    label="Категорія"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                  <Textarea
                    label="Опис"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                  <Input
                    label="URL зображення"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                  <Input
                    label="Demo URL"
                    value={form.demoUrl}
                    onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                  />
                  <Input
                    label="Технології (через кому)"
                    value={form.technologies}
                    onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  />
                  <Input
                    label="Функції (через кому)"
                    value={form.features}
                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                  />
                  <label className="flex items-center gap-3 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="w-4 h-4 accent-[var(--purple)]"
                    />
                    <span className="text-sm text-[var(--text-secondary)]">
                      Опубліковано
                    </span>
                  </label>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        'Зберігаємо...'
                      ) : (
                        <>
                          <Save size={16} /> Зберегти
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin/portfolio')}
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