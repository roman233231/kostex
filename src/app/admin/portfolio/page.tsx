'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllPortfolio, deletePortfolioItem } from '@/services/portfolio';
import { PortfolioItem } from '@/types/portfolio';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { Search, Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminPortfolioPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
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
          const data = await getAllPortfolio();
          setItems(data);
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
    if (!confirm('Видалити цей кейс?')) return;
    try {
      await deletePortfolioItem(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
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

  const filtered = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
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
                Портфоліо
              </h1>
              <p className="text-[var(--text-muted)] mt-2">
                {items.length} {items.length === 1 ? 'кейс' : 'кейсів'}
              </p>
            </div>
            <Link href="/admin/portfolio/new">
              <Button>
                <Plus size={16} />
                Додати
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
              placeholder="Пошук портфоліо..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="card no-hover text-center py-14">
            <ImageIcon size={48} className="text-[var(--text-faint)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">
              {items.length === 0 ? 'Кейсів поки немає.' : 'Нічого не знайдено.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <Reveal key={item.id} delay={i * 30}>
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
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold">{item.title}</h3>
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                              style={{
                                background: 'linear-gradient(135deg, #D946EF, #A855F7)',
                              }}
                            >
                              {item.category}
                            </span>
                            {!item.published && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">
                                Чернетка
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Link
                            href={`/admin/portfolio/${item.id}`}
                            className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-colors"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id!)}
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