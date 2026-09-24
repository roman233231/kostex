'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { getPortfolioBySlug } from '@/services/portfolio';
import { PortfolioItem } from '@/types/portfolio';

export default function PortfolioDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const data = await getPortfolioBySlug(slug);
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container py-16">
          <div className="skeleton skeleton-line" style={{ width: '200px' }} />
          <div className="skeleton mt-6" style={{ height: '60px', maxWidth: '500px' }} />
          <div className="skeleton mt-10" style={{ height: '400px' }} />
        </main>
        <Footer />
      </>
    );
  }

  if (!item || !item.published) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Link
          href="/portfolio"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors inline-flex items-center gap-1"
        >
          {t('portfolio.back')}
        </Link>

        <Reveal>
          <div className="mt-8 mb-12">
            <Badge>{item.category.replace('-', ' ')}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              {item.title}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4 max-w-3xl">
              {item.description}
            </p>
          </div>
        </Reveal>

        {item.image && (
          <Reveal delay={100}>
            <div className="mb-12 rounded-2xl overflow-hidden border border-[var(--border)] relative w-full aspect-[16/9]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {item.features && item.features.length > 0 && (
              <Reveal>
                <Card hover={false}>
                  <h2 className="text-2xl font-semibold mb-5">{t('product.features')}</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--purple-bright)] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            )}

            {item.technologies && item.technologies.length > 0 && (
              <Reveal delay={100}>
                <Card hover={false}>
                  <h2 className="text-2xl font-semibold mb-5">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Card>
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-5">
              <Reveal delay={150}>
                <Card hover={false} className="border-[var(--border-purple)]">
                  <h3 className="text-lg font-semibold mb-3">{t('portfolio.getThis')}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-5">
                    {t('portfolio.getThisDesc')}
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {item.demoUrl && (
                      <Button href={item.demoUrl} className="w-full">
                        {t('portfolio.viewLive')}
                      </Button>
                    )}
                    <Button variant="outline" href="/builder" className="w-full">
                      {t('portfolio.buildSimilar')}
                    </Button>
                  </div>
                </Card>
              </Reveal>

              <Reveal delay={200}>
                <Card hover={false}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-3">
                    {t('portfolio.category')}
                  </h3>
                  <Badge>{item.category.replace('-', ' ')}</Badge>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}