'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllCategories, deleteCategory } from '@/services/category';
import { Category } from '@/types/category';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminCategoriesPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchCategories = async () => {
        try {
          const data = await getAllCategories();
          setCategories(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [appUser]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete category');
    }
  };

  if (loading || loadingCategories) {
    return <div className="container py-16 text-center">Loading...</div>;
  }

  if (!currentUser || appUser?.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Badge>Admin</Badge>
            <h1 className="text-4xl font-bold mt-4">Categories</h1>
          </div>
          <Button href="/admin/categories/new">Add Category</Button>
        </div>

        {categories.length === 0 ? (
          <p className="text-white/60">No categories yet.</p>
        ) : (
          <div className="space-y-4">
            {categories.map(category => (
              <Card key={category.id} hover={false}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-white/50">Slug: {category.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" href={`/admin/categories/${category.id}`}>Edit</Button>
                    <Button variant="outline" onClick={() => handleDelete(category.id!)}>Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}