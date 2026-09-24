'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import PortfolioCard from '@/components/ui/PortfolioCard';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { getPublishedPortfolio } from '@/services/portfolio';
import { PortfolioItem } from '@/types/portfolio';

export default function PortfolioPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublishedPortfolio();
        setItems(data);
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
            <Badge>{t('nav.portfolio')}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              {t('portfolio.title')}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4 max-w-2xl">
              {t('portfolio.subtitle')}
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div className="p-5">
                  <div className="skeleton skeleton-line" style={{ width: '80px' }} />
                  <div className="skeleton skeleton-title mt-3" />
                  <div className="skeleton skeleton-line" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-[var(--text-muted)]">{t('portfolio.noItems')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <PortfolioCard item={item} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}