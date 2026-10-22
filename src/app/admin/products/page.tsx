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
import { Search, Plus, Pencil, Trash2, Package, Clock, Tag } from 'lucide-react';

export default function AdminProductsPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) router.push('/account');
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          const data = await getAllProducts();
          setProducts(data);
        } catch (err) { console.error(err); } finally { setLoadingData(false); }
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
      <div className="container py-32 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  const filtered = products.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-[var(--text)]">
                Керування <span className="text-gradient-animated">Продуктами</span>
              </h1>
              <p className="text-lg text-[var(--text-3)]">
                {products.length} {products.length === 1 ? 'продукт' : 'продуктів'} в каталозі
              </p>
            </div>
            <Link href="/admin/products/new">
              <Button className="w-full md:w-auto px-6 py-3 rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)]">
                <Plus size={18} className="mr-2" /> Додати продукт
              </Button>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="glass-card rounded-3xl p-4 md:p-6 mb-8">
            <div className="relative w-full md:max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)]" />
              <input
                type="text"
                placeholder="Пошук за назвою, категорією або slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <Reveal delay={150}>
            <div className="glass-card rounded-[2rem] text-center py-20">
              <Package size={48} className="text-[var(--text-4)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[var(--text)] mb-2">Нічого не знайдено</h3>
              <p className="text-[var(--text-3)]">{products.length === 0 ? 'Створіть свій перший продукт.' : 'Спробуйте змінити запит пошуку.'}</p>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-4">
            {filtered.map((product, i) => (
              <Reveal key={product.id} delay={i * 30}>
                <div className="glass-card rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_var(--accent)] transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]">
                      <Package size={24} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{product.title}</h3>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                          {product.category}
                        </span>
                        {!product.published && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold uppercase tracking-wider">
                            Чернетка
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-3)] line-clamp-1 mb-2">{product.shortDescription}</p>
                      <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-4)]">
                        <span className="flex items-center gap-1"><Tag size={12} /> {product.startingPrice.toLocaleString('uk-UA')} ₴</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {product.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0 border-t md:border-t-0 border-[var(--border)] pt-4 md:pt-0">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                    >
                      <Pencil size={16} /> Редагувати
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id!)}
                      className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all btn-tactile"
                      title="Видалити"
                    >
                      <Trash2 size={18} />
                    </button>
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
