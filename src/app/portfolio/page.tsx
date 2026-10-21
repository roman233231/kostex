'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PortfolioCard from '@/components/ui/PortfolioCard';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { getPublishedPortfolio } from '@/services/portfolio';
import { PortfolioItem } from '@/types/portfolio';
import { ArrowRight, Sparkles } from 'lucide-react';

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
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge>{t('nav.portfolio')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6 tracking-tight leading-[1.05] text-gradient-animated">
              {t('portfolio.title')}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)]">
              {t('portfolio.subtitle')}
            </p>
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
        ) : items.length === 0 ? (
          <div className="glass-card rounded-3xl text-center py-20 max-w-2xl mx-auto">
            <Sparkles size={48} className="text-[var(--text-4)] mx-auto mb-4" />
            <p className="text-[var(--text-3)] text-lg">{t('portfolio.noItems')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <PortfolioCard item={item} index={i} />
              </Reveal>
            ))}
          </div>
        )}

        {/* CTA внизу */}
        <Reveal delay={200}>
          <div className="mt-24 text-center glass-card rounded-3xl p-12 md:p-16 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[80px] pointer-events-none" />
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-[var(--text)]">
              Хочете такий самий результат?
            </h2>
            <p className="text-[var(--text-3)] mb-8 max-w-xl mx-auto">
              Давайте створимо щось круте для вашого бізнесу. Почніть свій проєкт вже сьогодні.
            </p>
            <Link href="/builder">
              <Button className="btn-tactile rounded-full px-8 py-4 text-lg shadow-[0_0_20px_var(--accent)]">
                Почати проєкт <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
