'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';
import { useLanguage } from '@/context/LanguageContext';

const valueKeys = ['v1', 'v2', 'v3', 'v4'] as const;

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Reveal>
          <div className="max-w-3xl mb-14">
            <Badge>{t('nav.about')}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              {t('about.title')}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-5">{t('about.subtitle')}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          <Reveal delay={0}>
            <Card hover={false} className="text-center py-8">
              <div className="text-4xl font-bold gradient-text">
                <Counter value={50} suffix="+" />
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-2 uppercase tracking-wider">
                {t('about.projects')}
              </div>
            </Card>
          </Reveal>
          <Reveal delay={80}>
            <Card hover={false} className="text-center py-8">
              <div className="text-4xl font-bold gradient-text">
                <Counter value={14} prefix="7–" />
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-2 uppercase tracking-wider">
                {t('about.days')}
              </div>
            </Card>
          </Reveal>
          <Reveal delay={160}>
            <Card hover={false} className="text-center py-8">
              <div className="text-4xl font-bold gradient-text">
                <Counter value={100} suffix="%" />
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-2 uppercase tracking-wider">
                {t('about.custom')}
              </div>
            </Card>
          </Reveal>
        </div>

        <Reveal>
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('about.valuesTitle')}</h2>
            <p className="text-[var(--text-muted)]">{t('about.valuesSubtitle')}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {valueKeys.map((key, i) => (
            <Reveal key={key} delay={i * 80}>
              <Card hover={false} className="h-full">
                <h3 className="text-lg font-semibold mb-2">{t(`about.${key}` as any)}</h3>
                <p className="text-[var(--text-muted)]">{t(`about.${key}d` as any)}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('about.readyTitle')}</h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-xl mx-auto">
              {t('about.readySub')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/builder"><Button>{t('about.startProject')}</Button></Link>
              <Link href="/contact"><Button variant="outline">{t('about.contactUs')}</Button></Link>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}