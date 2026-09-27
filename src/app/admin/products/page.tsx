'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllProducts, deleteProduct } from '@/services/product';
import { Product } from '@/types/product';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  ArrowRight,
} from 'lucide-react';

export default function AdminProductsPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          const data = await getAllProducts();
          setProducts(data);
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
    if (!confirm('Видалити цей продукт?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
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

  const filtered = products.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <Reveal>
          <div className="flex justify-between items-start mb-8 gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Продукти
              </h1>
              <p className="text-[var(--text-muted)] mt-2">
                {products.length} {products.length === 1 ? 'продукт' : 'продуктів'}
              </p>
            </div>
            <Link href="/admin/products/new">
              <Button>
                <Plus size={16} />
                Додати продукт
              </Button>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative md:max-w-sm mb-6">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
            />
            <input
              type="text"
              placeholder="Пошук продуктів..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="card no-hover text-center py-14">
            <Package size={48} className="text-[var(--text-faint)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">
              {products.length === 0 ? 'Продуктів поки немає.' : 'Нічого не знайдено.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product, i) => (
              <Reveal key={product.id} delay={i * 30}>
                <div
                  className="color-card"
                  style={
                    {
                      '--card-color-1': '#EC4899',
                      '--card-color-2': '#F43F5E',
                      '--card-glow': 'rgba(236,72,153,0.5)',
                    } as React.CSSProperties
                  }
                >
                  <div className="color-card-inner">
                    <div className="color-card-content">
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold">{product.title}</h3>
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                              style={{
                                background: 'linear-gradient(135deg, #EC4899, #F43F5E)',
                              }}
                            >
                              {product.category}
                            </span>
                            {!product.published && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">
                                Чернетка
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-1">
                            {product.shortDescription}
                          </p>
                          <p className="text-xs text-[var(--text-faint)] mt-1">
                            {product.startingPrice.toLocaleString('uk-UA')} ₴ · {product.estimatedTime}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-colors"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id!)}
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