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
  { key: 'v1', icon: Sparkles, color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  { key: 'v2', icon: Zap, color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  { key: 'v3', icon: Eye, color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  { key: 'v4', icon: Heart, color1: '#10B981', color2: '#14B8A6', glow: 'rgba(16,185,129,0.5)' },
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
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge>{t('nav.about')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6 tracking-tight leading-[1.05] text-gradient-animated">
              {t('about.title')}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)] leading-relaxed">
              {t('about.subtitle')}
            </p>
          </div>
        </Reveal>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle, ${s.color}40, transparent 70%)`, filter: 'blur(40px)' }}
                />
                <div className="relative">
                  <div className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" style={{ color: s.color }}>
                    <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <div className="text-xs text-[var(--text-3)] uppercase tracking-widest font-semibold">
                    {t(s.labelKey as any)}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Цінності */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('about.valuesTitle')}
            </h2>
            <p className="text-[var(--text-3)] text-lg">{t('about.valuesSubtitle')}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.key} delay={i * 80}>
                <div className="glass-card rounded-3xl p-8 h-full flex gap-6 group hover:-translate-y-1 transition-all duration-300">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{ background: `linear-gradient(135deg, ${v.color1}, ${v.color2})`, boxShadow: `0 10px 30px -10px ${v.glow}` }}
                  >
                    <Icon size={28} className="text-white" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {t(`about.${v.key}` as any)}
                    </h3>
                    <p className="text-[var(--text-3)] leading-relaxed">
                      {t(`about.${v.key}d` as any)}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* CTA внизу */}
        <Reveal delay={200}>
          <div className="mt-24 text-center glass-card rounded-3xl p-12 md:p-16 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[80px] pointer-events-none" />
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-[var(--text)]">
              {t('about.readyTitle')}
            </h2>
            <p className="text-[var(--text-3)] mb-8 max-w-xl mx-auto">
              {t('about.readySub')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/builder">
                <Button className="btn-tactile rounded-full px-8 py-4 text-lg w-full sm:w-auto shadow-[0_0_20px_var(--accent)]">
                  {t('about.startProject')} <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="btn-tactile rounded-full px-8 py-4 text-lg w-full sm:w-auto border-[var(--accent)]/30 hover:bg-[var(--accent)]/10">
                  {t('about.contactUs')}
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
