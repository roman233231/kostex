'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllCategories, deleteCategory } from '@/services/category';
import { Category } from '@/types/category';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          const data = await getAllCategories();
          setCategories(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [appUser]);

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цю категорію?')) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Помилка видалення');
    }
  };

  if (loading || loadingData) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <Reveal>
          <div className="flex justify-between items-start mb-8 gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Категорії
              </h1>
              <p className="text-[var(--text-muted)] mt-2">
                {categories.length} {categories.length === 1 ? 'категорія' : 'категорій'}
              </p>
            </div>
            <Link href="/admin/categories/new">
              <Button>
                <Plus size={16} />
                Додати
              </Button>
            </Link>
          </div>
        </Reveal>

        {categories.length === 0 ? (
          <div className="card no-hover text-center py-14">
            <FolderTree size={48} className="text-[var(--text-faint)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">Категорій поки немає.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, i) => (
              <Reveal key={category.id} delay={i * 40}>
                <div
                  className="color-card h-full"
                  style={
                    {
                      '--card-color-1': '#F59E0B',
                      '--card-color-2': '#F97316',
                      '--card-glow': 'rgba(245,158,11,0.5)',
                    } as React.CSSProperties
                  }
                >
                  <div className="color-card-inner">
                    <div className="color-card-content">
                      <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold">{category.name}</h3>
                          <p className="text-xs text-[var(--text-faint)] mt-1">
                            /{category.slug}
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <Link
                            href={`/admin/categories/${category.id}`}
                            className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-colors"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id!)}
                            className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-red-500/40 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}