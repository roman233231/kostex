'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Logo from '@/components/layout/Logo';
import Reveal from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';
import MagneticButton from '@/components/ui/MagneticButton';
import FAQ from '@/components/ui/FAQ';
import Reviews from '@/components/ui/Reviews';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Truck, Eye, ArrowRight, Zap } from 'lucide-react';

const buildCards = [
  {
    titleKey: 'build.website',
    href: '/catalog/websites',
    descKey: 'build.websiteDesc',
    emoji: '🌐',
    color1: '#8B5CF6',
    color2: '#A855F7',
    glow: 'rgba(139,92,246,0.5)',
  },
  {
    titleKey: 'build.webapp',
    href: '/catalog/web-apps',
    descKey: 'build.webappDesc',
    emoji: '⚡',
    color1: '#3B82F6',
    color2: '#06B6D4',
    glow: 'rgba(59,130,246,0.5)',
  },
  {
    titleKey: 'build.software',
    href: '/catalog/software',
    descKey: 'build.softwareDesc',
    emoji: '💻',
    color1: '#EC4899',
    color2: '#F43F5E',
    glow: 'rgba(236,72,153,0.5)',
  },
  {
    titleKey: 'build.bot',
    href: '/catalog/bots',
    descKey: 'build.botDesc',
    emoji: '🤖',
    color1: '#10B981',
    color2: '#14B8A6',
    glow: 'rgba(16,185,129,0.5)',
  },
  {
    titleKey: 'build.crm',
    href: '/catalog/web-apps',
    descKey: 'build.crmDesc',
    emoji: '📊',
    color1: '#F59E0B',
    color2: '#F97316',
    glow: 'rgba(245,158,11,0.5)',
  },
  {
    titleKey: 'build.ecommerce',
    href: '/catalog/websites',
    descKey: 'build.ecommerceDesc',
    emoji: '🛒',
    color1: '#D946EF',
    color2: '#A855F7',
    glow: 'rgba(217,70,239,0.5)',
  },
] as const;

const features = [
  {
    key: 'builder',
    icon: Sparkles,
    color1: '#8B5CF6',
    color2: '#A855F7',
    glow: 'rgba(139,92,246,0.5)',
  },
  {
    key: 'delivery',
    icon: Truck,
    color1: '#3B82F6',
    color2: '#06B6D4',
    glow: 'rgba(59,130,246,0.5)',
  },
  {
    key: 'transparency',
    icon: Eye,
    color1: '#EC4899',
    color2: '#F43F5E',
    glow: 'rgba(236,72,153,0.5)',
  },
] as const;

const techStack = [
  'Next.js',
  'React',
  'TypeScript',
  'Firebase',
  'Tauri',
  'Tailwind CSS',
  'Node.js',
  'REST API',
  'Stripe',
  'OpenAI',
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center">
          <div className="grid-bg" />

          <div
            className="glow-orb animate-float-slow hidden md:block"
            style={{
              top: '-10%',
              left: '15%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)',
            }}
          />
          <div
            className="glow-orb animate-float hidden md:block"
            style={{
              bottom: '-15%',
              right: '8%',
              width: '550px',
              height: '550px',
              background: 'radial-gradient(circle, rgba(192,38,255,0.25), transparent 70%)',
              animationDelay: '2s',
            }}
          />

          <div className="container relative py-20 md:py-32">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="mb-8 animate-fade-down">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(139,92,246,0.6), transparent 70%)',
                      filter: 'blur(40px)',
                      animation: 'pulse 4s ease-in-out infinite',
                    }}
                  />
                  <Logo
                    size={96}
                    className="relative w-20 h-20 md:w-24 md:h-24 drop-shadow-[0_0_40px_rgba(139,92,246,0.7)]"
                  />
                </div>
              </div>

              <div className="animate-fade-up delay-100 mb-5">
                <Badge>{t('hero.badge')}</Badge>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 animate-fade-up delay-200 leading-[0.95]">
                {t('hero.title1')}
                <br />
                <span className="gradient-text">{t('hero.title2')}</span>
                <span className="text-[var(--purple)] animate-blink ml-1">_</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mb-9 animate-fade-up delay-300 px-2">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-up delay-400 w-full sm:w-auto px-4 sm:px-0">
                <MagneticButton href="/builder" className="w-full sm:w-auto">
                  <Button className="btn-lg w-full sm:w-auto">
                    {t('hero.cta1')} <ArrowRight size={18} />
                  </Button>
                </MagneticButton>
                <MagneticButton href="/portfolio" className="w-full sm:w-auto">
                  <Button variant="outline" className="btn-lg w-full sm:w-auto">
                    {t('hero.cta2')}
                  </Button>
                </MagneticButton>
              </div>

              <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full max-w-3xl animate-fade-up delay-600">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold" style={{ color: '#A78BFA' }}>
                    <Counter value={50} suffix="+" />
                  </div>
                  <div className="text-[10px] md:text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1.5">
                    {t('hero.stat1')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold" style={{ color: '#60A5FA' }}>
                    24/7
                  </div>
                  <div className="text-[10px] md:text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1.5">
                    {t('hero.stat2')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold" style={{ color: '#F472B6' }}>
                    <Counter value={14} prefix="7–" />
                  </div>
                  <div className="text-[10px] md:text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1.5">
                    {t('hero.stat3')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold" style={{ color: '#34D399' }}>
                    <Counter value={100} suffix="%" />
                  </div>
                  <div className="text-[10px] md:text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1.5">
                    {t('hero.stat4')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="py-6 md:py-8 border-y border-[var(--border)] bg-[var(--surface)]/40">
          <div className="marquee">
            <div className="marquee-track">
              {[...techStack, ...techStack].map((tech, i) => (
                <div
                  key={i}
                  className="text-base md:text-xl font-semibold text-[var(--text-faint)] whitespace-nowrap flex items-center gap-10 md:gap-16"
                >
                  <span>{tech}</span>
                  <span className="text-[var(--purple)] text-sm">✦</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            WHAT WE BUILD — COLORFUL GLASS CARDS
           ============================================================ */}
        <section className="container py-20 md:py-32">
          <Reveal>
            <div className="text-center mb-14 md:mb-20">
              <Badge>{t('sections.whatWeBuild')}</Badge>
              <h2 className="section-title mt-5">
                {t('sections.whatYouWant')}{' '}
                <span className="gradient-text">{t('sections.build')}</span>?
              </h2>
              <p className="section-subtitle mx-auto mt-4">{t('sections.whatSubtitle')}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {buildCards.map((item, i) => (
              <Reveal key={item.titleKey} delay={i * 60}>
                <Link href={item.href} className="block h-full">
                  <div
                    className="color-card h-full"
                    style={
                      {
                        '--card-color-1': item.color1,
                        '--card-color-2': item.color2,
                        '--card-glow': item.glow,
                      } as React.CSSProperties
                    }
                  >
                    <div className="color-card-inner">
                      <div className="color-card-content">
                        {/* Icon */}
                        <div className="color-icon">
                          <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                            {item.emoji}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2">
                          {t(item.titleKey)}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] flex-1 leading-relaxed">
                          {t(item.descKey)}
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
                          <span
                            style={{
                              background: `linear-gradient(135deg, ${item.color1}, ${item.color2})`,
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {t('common.viewDetails')}
                          </span>
                          <ArrowRight
                            size={14}
                            className="color-arrow"
                            style={{ color: item.color1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============================================================
            WHY KOSTEX
           ============================================================ */}
        <section className="container py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <Reveal>
              <div>
                <Badge>{t('sections.whyUs')}</Badge>
                <h2 className="section-title mt-5">
                  {t('sections.whyUsTitle')}{' '}
                  <span className="gradient-text">{t('sections.whyUsTitle2')}</span>
                </h2>
                <p className="section-subtitle mt-4">{t('sections.whyUsSubtitle')}</p>

                <div className="mt-10 space-y-6">
                  {features.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <Reveal key={f.key} delay={i * 100}>
                        <div className="flex gap-5 group">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                            style={{
                              background: `linear-gradient(135deg, ${f.color1}, ${f.color2})`,
                              boxShadow: `0 8px 24px -8px ${f.glow}`,
                            }}
                          >
                            <Icon size={24} strokeWidth={2.2} />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1 text-base md:text-lg">
                              {t(`features.${f.key}` as any)}
                            </h3>
                            <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                              {t(`features.${f.key}Desc` as any)}
                            </p>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative">
                <div
                  className="absolute -top-10 -left-10 w-[300px] h-[300px] rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)',
                    filter: 'blur(70px)',
                  }}
                />
                <div
                  className="absolute -bottom-10 -right-10 w-[350px] h-[350px] rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%)',
                    filter: 'blur(70px)',
                  }}
                />

                <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                  <div className="flex gap-2 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 rounded-full bg-[var(--surface-2)] w-3/4" />
                    <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 w-full" />
                    <div className="h-3 rounded-full bg-[var(--surface-2)] w-5/6" />
                    <div className="h-3 rounded-full bg-[var(--surface-2)] w-2/3" />

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="h-16 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20" />
                      <div className="h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20" />
                      <div className="h-16 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 border border-pink-500/20" />
                    </div>

                    <div className="mt-4 flex gap-2">
                      <div className="h-8 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 w-24" />
                      <div className="h-8 rounded-lg bg-[var(--surface-2)] w-20" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="container py-20 md:py-32">
          <Reveal>
            <div className="text-center mb-14 md:mb-20">
              <Badge>{t('reviews.badge')}</Badge>
              <h2 className="section-title mt-5">
                {t('reviews.title')}{' '}
                <span className="gradient-text">{t('reviews.title2')}</span>
              </h2>
              <p className="section-subtitle mx-auto mt-4">{t('reviews.subtitle')}</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Reviews />
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="container py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <Reveal className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <Badge>{t('faq.badge')}</Badge>
                <h2 className="section-title mt-5">
                  {t('faq.title')}{' '}
                  <span className="gradient-text">{t('faq.title2')}</span>
                </h2>
                <p className="section-subtitle mt-4">{t('faq.subtitle')}</p>

                <div className="mt-10 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] relative overflow-hidden">
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)',
                      filter: 'blur(30px)',
                    }}
                  />
                  <div className="relative">
                    <div className="font-semibold mb-2 text-base">
                      Залишились питання?
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mb-5 leading-relaxed">
                      Напишіть нам — відповімо протягом 24 годин.
                    </p>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full sm:w-auto">
                        {t('cta.contact')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100} className="lg:col-span-3">
              <FAQ />
            </Reveal>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="container py-20 md:py-32">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--bg-2)] px-6 md:px-12 py-16 md:py-28 text-center">
              <div className="grid-bg" />

              <div
                className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)',
                  filter: 'blur(80px)',
                }}
              />
              <div
                className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%)',
                  filter: 'blur(80px)',
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)',
                  filter: 'blur(100px)',
                }}
              />

              <div className="absolute top-12 left-12 hidden md:block opacity-40">
                <Sparkles size={32} className="text-violet-400 animate-float" />
              </div>
              <div
                className="absolute top-20 right-16 hidden md:block opacity-40"
                style={{ animationDelay: '0.5s' }}
              >
                <Zap size={28} className="text-pink-400 animate-float" />
              </div>
              <div
                className="absolute bottom-12 right-12 hidden md:block opacity-40"
                style={{ animationDelay: '1s' }}
              >
                <Sparkles size={28} className="text-cyan-400 animate-float" />
              </div>

              <div className="relative">
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.05]">
                  {t('cta.title1')}
                  <br />
                  <span className="gradient-text">{t('cta.title2')}</span>?
                </h2>
                <p className="text-base md:text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-10 px-2">
                  {t('cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <MagneticButton href="/builder">
                    <Button className="btn-lg">
                      {t('cta.button')} <ArrowRight size={18} />
                    </Button>
                  </MagneticButton>
                  <MagneticButton href="/contact">
                    <Button variant="outline" className="btn-lg">
                      {t('cta.contact')}
                    </Button>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}