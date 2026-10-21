'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import ProductCard from '@/components/ui/ProductCard';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { getPublishedProducts } from '@/services/product';
import { getAllCategories } from '@/services/category';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

export default function CatalogPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<string>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [prods, cats] = await Promise.all([getPublishedProducts().catch(() => []), getAllCategories().catch(() => [])]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = activeCat === 'all' ? products : products.filter((p) => p.category === activeCat);
  const allCats = categories.length > 0 ? categories : [{ id: 'websites', name: 'Websites', slug: 'websites' }, { id: 'web-apps', name: 'Web Apps', slug: 'web-apps' }, { id: 'software', name: 'Software', slug: 'software' }, { id: 'bots', name: 'Bots', slug: 'bots' }];

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="mb-12 text-center">
            <Badge>{t('nav.catalog')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-4 text-gradient-animated">{t('catalog.title')}</h1>
            <p className="text-lg md:text-xl text-[var(--text-3)] max-w-2xl mx-auto">{t('catalog.subtitle')}</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mb-12 flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-2 p-2 glass-card rounded-2xl">
              <button onClick={() => setActiveCat('all')} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeCat === 'all' ? 'bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent)] btn-tactile' : 'text-[var(--text-3)] hover:text-white hover:bg-[var(--surface-2)]'}`}>
                {t('common.search') === 'Search' ? 'All' : 'Усі'}
              </button>
              {allCats.map((cat: any) => (
                <button key={cat.id} onClick={() => setActiveCat(cat.slug || cat.id)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${activeCat === (cat.slug || cat.id) ? 'bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent)] btn-tactile' : 'text-[var(--text-3)] hover:text-white hover:bg-[var(--surface-2)]'}`}>
                  {cat.name.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 h-80 animate-pulse">
                <div className="h-40 bg-[var(--surface-2)] rounded-xl mb-4" />
                <div className="h-6 bg-[var(--surface-2)] rounded w-2/3 mb-2" />
                <div className="h-4 bg-[var(--surface-2)] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-[var(--text-3)] py-20 text-center text-lg">{t('catalog.noProducts')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <Reveal key={product.id} delay={i * 50}>
                <ProductCard product={product} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
