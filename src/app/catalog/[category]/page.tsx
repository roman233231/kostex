'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import ProductCard from '@/components/ui/ProductCard';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { getProductsByCategory } from '@/services/product';
import { Product } from '@/types/product';

export default function CategoryPage() {
  const { t } = useLanguage();
  const params = useParams();
  const category = params?.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    const load = async () => {
      try {
        const data = await getProductsByCategory(category);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Link
          href="/catalog"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors inline-flex items-center gap-1"
        >
          {t('product.back')}
        </Link>

        <Reveal>
          <div className="mt-8 mb-12">
            <Badge>{t('nav.catalog')}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight capitalize">
              {category?.replace('-', ' ')}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4">
              {t('catalog.subtitle')}
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div className="p-5">
                  <div className="skeleton skeleton-line" style={{ width: '60%' }} />
                  <div className="skeleton skeleton-line" />
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