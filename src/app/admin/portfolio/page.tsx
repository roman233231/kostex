'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllPortfolio, deletePortfolioItem } from '@/services/portfolio';
import { PortfolioItem } from '@/types/portfolio';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminPortfolioPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchItems = async () => {
        try {
          const data = await getAllPortfolio();
          setItems(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingItems(false);
        }
      };
      fetchItems();
    }
  }, [appUser]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this portfolio item?')) return;
    try {
      await deletePortfolioItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  if (loading || loadingItems) {
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
            <h1 className="text-4xl font-bold mt-4">Portfolio</h1>
          </div>
          <Button href="/admin/portfolio/new">Add Item</Button>
        </div>

        {items.length === 0 ? (
          <p className="text-white/60">No portfolio items yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <Card key={item.id} hover={false}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-white/50">Category: {item.category}</p>
                    <p className="text-sm text-white/60 mt-1">{item.description}</p>
                    {!item.published && <Badge className="mt-2">Draft</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" href={`/admin/portfolio/${item.id}`}>Edit</Button>
                    <Button variant="outline" onClick={() => handleDelete(item.id)}>Delete</Button>
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