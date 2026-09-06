'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllProducts, deleteProduct } from '@/services/product';
import { Product } from '@/types/product';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminProductsPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchProducts = async () => {
        try {
          const data = await getAllProducts();
          setProducts(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingProducts(false);
        }
      };
      fetchProducts();
    }
  }, [appUser]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  if (loading || loadingProducts) {
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
            <h1 className="text-4xl font-bold mt-4">Products</h1>
          </div>
          <Button href="/admin/products/new">Add Product</Button>
        </div>

        {products.length === 0 ? (
          <p className="text-white/60">No products yet.</p>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <Card key={product.id} hover={false}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-sm text-white/50">{product.category}</p>
                    <p className="text-sm text-white/60 mt-1">{product.shortDescription}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" href={`/admin/products/${product.id}`}>Edit</Button>
                    <Button variant="outline" onClick={() => handleDelete(product.id)}>Delete</Button>
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