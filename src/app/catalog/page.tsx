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
        const [prods, cats] = await Promise.all([
          getPublishedProducts().catch(() => []),
          getAllCategories().catch(() => []),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    activeCat === 'all' ? products : products.filter((p) => p.category === activeCat);

  const allCats =
    categories.length > 0
      ? categories
      : [
          { id: 'websites', name: 'Websites', slug: 'websites' },
          { id: 'web-apps', name: 'Web Apps', slug: 'web-apps' },
          { id: 'software', name: 'Software', slug: 'software' },
          { id: 'bots', name: 'Bots', slug: 'bots' },
        ];

  return (
    <>
      <Navbar />
      <main className="container py-12 md:py-16">
        <Reveal>
          <div className="mb-8 md:mb-12">
            <Badge>{t('nav.catalog')}</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              {t('catalog.title')}
            </h1>
            <p className="text-base md:text-lg text-[var(--text-muted)] mt-3 md:mt-4 max-w-2xl">
              {t('catalog.subtitle')}
            </p>
          </div>
        </Reveal>

        {/* Category chips — mobile: horizontal scroll */}
        <Reveal delay={80}>
          <div className="mb-8 md:mb-10 -mx-5 px-5 md:mx-0 md:px-0">
            <div className="flex gap-2.5 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0 scrollbar-hide">
              <button
                onClick={() => setActiveCat('all')}
                className={`shrink-0 px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all ${
                  activeCat === 'all'
                    ? 'bg-[var(--purple)] text-white border-[var(--purple)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)]'
                }`}
              >
                {t('common.search') === 'Search' ? 'All' : 'Усі'}
              </button>
              {allCats.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.slug || cat.id)}
                  className={`shrink-0 px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all capitalize ${
                    activeCat === (cat.slug || cat.id)
                      ? 'bg-[var(--purple)] text-white border-[var(--purple)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)]'
                  }`}
                >
                  {cat.name.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div className="p-4 md:p-5">
                  <div className="skeleton skeleton-line" style={{ width: '100px' }} />
                  <div className="skeleton skeleton-title mt-3" />
                  <div className="skeleton skeleton-line" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-[var(--text-muted)] py-12 text-center">{t('catalog.noProducts')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((product, i) => (
              <Reveal key={product.id} delay={i * 60}>
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