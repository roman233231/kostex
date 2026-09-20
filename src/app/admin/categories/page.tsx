'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllCategories, deleteCategory } from '@/services/category';
import { Category } from '@/types/category';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

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
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
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
              <Badge>Admin</Badge>
              <h1 className="text-4xl font-bold mt-4 tracking-tight">Categories</h1>
            </div>
            <Button href="/admin/categories/new">+ Add Category</Button>
          </div>
        </Reveal>

        {categories.length === 0 ? (
          <p className="text-[var(--text-muted)]">No categories yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, i) => (
              <Reveal key={category.id} delay={i * 40}>
                <Card hover={false}>
                  <div className="flex justify-between items-start gap-3 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold">{category.name}</h3>
                      <p className="text-xs text-[var(--text-faint)] mt-1">
                        /{category.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="px-2.5 py-1 rounded-md border border-[var(--border)] text-xs text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)] transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id!)}
                        className="px-2.5 py-1 rounded-md border border-[var(--border)] text-xs text-[var(--text-muted)] hover:border-red-500/40 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}