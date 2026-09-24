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

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Reveal>
          <div className="mb-12">
            <Badge>{t('nav.catalog')}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              {t('catalog.title')}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4 max-w-2xl">
              {t('catalog.subtitle')}
            </p>
          </div>
        </Reveal>

        {/* Category chips */}
        <Reveal delay={80}>
          <div className="flex flex-wrap gap-2.5 mb-10">
            {categories.length > 0
              ? categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/catalog/${cat.slug}`}
                    className="px-4 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-colors"
                  >
                    {cat.name}
                  </a>
                ))
              : ['websites', 'web-apps', 'software', 'bots'].map((cat) => (
                  <a
                    key={cat}
                    href={`/catalog/${cat}`}
                    className="px-4 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--border-purple)] hover:text-[var(--purple-bright)] transition-colors capitalize"
                  >
                    {cat.replace('-', ' ')}
                  </a>
                ))}
          </div>
        </Reveal>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div className="p-5">
                  <div className="skeleton skeleton-line" style={{ width: '100px' }} />
                  <div className="skeleton skeleton-title mt-3" />
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line" style={{ width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-[var(--text-muted)]">{t('catalog.noProducts')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product, i) => (
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