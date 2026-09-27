'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    key: 'starter',
    popular: false,
    features: ['starterF1', 'starterF2', 'starterF3', 'starterF4', 'starterF5', 'starterF6'],
    color1: '#3B82F6',
    color2: '#06B6D4',
    glow: 'rgba(59,130,246,0.5)',
    emoji: '🚀',
  },
  {
    key: 'business',
    popular: true,
    features: ['businessF1', 'businessF2', 'businessF3', 'businessF4', 'businessF5', 'businessF6', 'businessF7', 'businessF8'],
    color1: '#8B5CF6',
    color2: '#A855F7',
    glow: 'rgba(139,92,246,0.5)',
    emoji: '⭐',
  },
  {
    key: 'enterprise',
    popular: false,
    features: ['enterpriseF1', 'enterpriseF2', 'enterpriseF3', 'enterpriseF4', 'enterpriseF5', 'enterpriseF6', 'enterpriseF7'],
    color1: '#EC4899',
    color2: '#F43F5E',
    glow: 'rgba(236,72,153,0.5)',
    emoji: '👑',
  },
] as const;

export default function PricingPage() {
  const { t } = useLanguage();

  const sortedPlans = [...plans].sort((a, b) => {
    if (a.popular) return -1;
    if (b.popular) return 1;
    return 0;
  });

  return (
    <>
      <Navbar />
      <main className="container py-12 md:py-16">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <Badge>{t('pricing.badge')}</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mt-4 md:mt-5 tracking-tight leading-[1.05]">
              {t('pricing.title')}
              <br />
              <span className="gradient-text">{t('pricing.title2')}</span>
            </h1>
            <p className="text-base md:text-lg text-[var(--text-muted)] mt-4 md:mt-5 px-2">
              {t('pricing.subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 md:items-stretch">
          {sortedPlans.map((plan, i) => {
            const isPopular = plan.popular;
            return (
              <Reveal
                key={plan.key}
                delay={i * 100}
                className={
                  isPopular
                    ? 'md:order-2 order-1'
                    : i === 0
                    ? 'md:order-1 order-2'
                    : 'md:order-3 order-3'
                }
              >
                <div
                  className="color-card h-full relative"
                  style={
                    {
                      '--card-color-1': plan.color1,
                      '--card-color-2': plan.color2,
                      '--card-glow': plan.glow,
                    } as React.CSSProperties
                  }
                >
                  {isPopular && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-[10px] md:text-xs font-bold uppercase tracking-wider z-10 whitespace-nowrap"
                      style={{
                        background: `linear-gradient(135deg, ${plan.color1}, ${plan.color2})`,
                        boxShadow: `0 8px 24px -8px ${plan.glow}`,
                      }}
                    >
                      {t('pricing.popular')}
                    </div>
                  )}

                  <div className="color-card-inner">
                    <div className="color-card-content">
                      {/* Emoji */}
                      <div className="text-4xl mb-4">{plan.emoji}</div>

                      <h3 className="text-lg md:text-xl font-bold mb-1">
                        {t(`pricing.${plan.key}` as any)}
                      </h3>
                      <p className="text-xs md:text-sm text-[var(--text-muted)] mb-6">
                        {t(`pricing.${plan.key}Desc` as any)}
                      </p>

                      <div className="mb-6 pb-6 border-b border-[var(--border)]">
                        <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-1">
                          {t('pricing.starterFrom')}
                        </div>
                        <div
                          className="text-3xl md:text-4xl font-bold leading-none"
                          style={{
                            background: `linear-gradient(135deg, ${plan.color1}, ${plan.color2})`,
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {t(`pricing.${plan.key}Price` as any)}
                        </div>
                      </div>

                      <ul className="space-y-2.5 mb-7 flex-1">
                        {plan.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2.5 text-xs md:text-sm"
                          >
                            <span
                              className="mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0 text-white"
                              style={{
                                background: `linear-gradient(135deg, ${plan.color1}, ${plan.color2})`,
                              }}
                            >
                              <Check size={10} strokeWidth={3} />
                            </span>
                            <span className="text-[var(--text-secondary)]">
                              {t(`pricing.${f}` as any)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Link href={plan.key === 'enterprise' ? '/contact' : '/builder'}>
                        <Button
                          variant={isPopular ? 'primary' : 'outline'}
                          className="w-full"
                        >
                          {plan.key === 'enterprise'
                            ? t('pricing.contact')
                            : t('pricing.choose')}
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={300}>
          <div className="mt-14 md:mt-20">
            <div
              className="color-card max-w-3xl mx-auto"
              style={
                {
                  '--card-color-1': '#D946EF',
                  '--card-color-2': '#8B5CF6',
                  '--card-glow': 'rgba(217,70,239,0.5)',
                } as React.CSSProperties
              }
            >
              <div className="color-card-inner !p-10 md:!p-14">
                <div className="color-card-content text-center">
                  <h2 className="text-xl md:text-3xl font-bold mb-3">
                    {t('pricing.customTitle')}
                  </h2>
                  <p className="text-sm md:text-base text-[var(--text-muted)] mb-7 max-w-lg mx-auto">
                    {t('pricing.customDesc')}
                  </p>
                  <Link href="/builder">
                    <Button className="btn-lg">
                      {t('pricing.customCta')} <ArrowRight size={18} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}