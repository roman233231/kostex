'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Zap, Eye, Heart, ArrowRight } from 'lucide-react';

const values = [
  {
    key: 'v1',
    icon: Sparkles,
    color1: '#8B5CF6',
    color2: '#A855F7',
    glow: 'rgba(139,92,246,0.5)',
  },
  {
    key: 'v2',
    icon: Zap,
    color1: '#3B82F6',
    color2: '#06B6D4',
    glow: 'rgba(59,130,246,0.5)',
  },
  {
    key: 'v3',
    icon: Eye,
    color1: '#EC4899',
    color2: '#F43F5E',
    glow: 'rgba(236,72,153,0.5)',
  },
  {
    key: 'v4',
    icon: Heart,
    color1: '#10B981',
    color2: '#14B8A6',
    glow: 'rgba(16,185,129,0.5)',
  },
] as const;

const stats = [
  { value: 50, suffix: '+', color: '#A78BFA', labelKey: 'about.projects' },
  { value: 14, prefix: '7–', color: '#F472B6', labelKey: 'about.days' },
  { value: 100, suffix: '%', color: '#34D399', labelKey: 'about.custom' },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Reveal>
          <div className="max-w-3xl mb-14">
            <Badge>{t('nav.about')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 tracking-tight leading-[1.05]">
              {t('about.title')}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-6 leading-relaxed">
              {t('about.subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center overflow-hidden">
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${s.color}30, transparent 70%)`,
                    filter: 'blur(40px)',
                  }}
                />
                <div className="relative">
                  <div className="text-4xl md:text-5xl font-bold" style={{ color: s.color }}>
                    <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-2 uppercase tracking-wider">
                    {t(s.labelKey as any)}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t('about.valuesTitle')}
            </h2>
            <p className="text-[var(--text-muted)]">{t('about.valuesSubtitle')}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.key} delay={i * 80}>
                <div
                  className="color-card h-full"
                  style={
                    {
                      '--card-color-1': v.color1,
                      '--card-color-2': v.color2,
                      '--card-glow': v.glow,
                    } as React.CSSProperties
                  }
                >
                  <div className="color-card-inner">
                    <div className="color-card-content">
                      <div className="color-icon">
                        <Icon size={28} className="text-white" strokeWidth={2.2} />
                      </div>
                      <h3 className="text-lg font-bold mb-2">
                        {t(`about.${v.key}` as any)}
                      </h3>
                      <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                        {t(`about.${v.key}d` as any)}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <div className="mt-20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('about.readyTitle')}
            </h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-xl mx-auto">
              {t('about.readySub')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/builder">
                <Button>
                  {t('about.startProject')} <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">{t('about.contactUs')}</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}