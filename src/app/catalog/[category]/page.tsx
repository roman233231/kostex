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
import { ArrowLeft, Package } from 'lucide-react';

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
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all mb-10 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t('product.back') || 'Назад до каталогу'}
          </Link>
        </Reveal>

        <Reveal delay={50}>
          <div className="mb-12 md:mb-16">
            <Badge className="mb-4">{t('nav.catalog')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-gradient-animated capitalize mb-6">
              {category?.replace('-', ' ')}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)] max-w-2xl">
              {t('catalog.subtitle')}
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 h-80 animate-pulse">
                <div className="h-40 bg-[var(--surface-2)] rounded-xl mb-4" />
                <div className="h-6 bg-[var(--surface-2)] rounded w-2/3 mb-2" />
                <div className="h-4 bg-[var(--surface-2)] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Reveal delay={150}>
            <div className="glass-card rounded-[2rem] text-center py-20 max-w-2xl mx-auto">
              <Package size={56} className="text-[var(--text-4)] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[var(--text)] mb-3">{t('catalog.noProducts')}</h3>
              <p className="text-[var(--text-3)] mb-8">У цій категорії поки немає продуктів. Спробуйте обрати іншу.</p>
              <Link href="/catalog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] font-semibold text-[var(--text)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all btn-tactile">
                <ArrowLeft size={18} /> Повернутися
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
