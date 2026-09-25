'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';

const plans = [
  {
    key: 'starter',
    popular: false,
    features: ['starterF1', 'starterF2', 'starterF3', 'starterF4', 'starterF5', 'starterF6'],
  },
  {
    key: 'business',
    popular: true,
    features: ['businessF1', 'businessF2', 'businessF3', 'businessF4', 'businessF5', 'businessF6', 'businessF7', 'businessF8'],
  },
  {
    key: 'enterprise',
    popular: false,
    features: ['enterpriseF1', 'enterpriseF2', 'enterpriseF3', 'enterpriseF4', 'enterpriseF5', 'enterpriseF6', 'enterpriseF7'],
  },
] as const;

export default function PricingPage() {
  const { t } = useLanguage();

  // Сортуємо так, щоб популярний був другим на десктопі та першим на мобільному
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
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7 md:items-stretch">
          {sortedPlans.map((plan, i) => {
            const isPopular = plan.popular;
            return (
              <Reveal
                key={plan.key}
                delay={i * 100}
                className={isPopular ? 'md:order-2 order-1' : i === 0 ? 'md:order-1 order-2' : 'md:order-3 order-3'}
              >
                <div
                  className={`relative h-full rounded-2xl md:rounded-3xl border p-6 md:p-7 flex flex-col transition-all duration-300 ${
                    isPopular
                      ? 'border-[var(--border-purple)] bg-gradient-to-b from-[var(--purple)]/[0.08] to-transparent shadow-[0_20px_60px_-20px_rgba(139,92,246,0.4)] md:scale-[1.02]'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] text-white text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.6)] whitespace-nowrap">
                      {t('pricing.popular')}
                    </div>
                  )}

                  <div className="mb-5 md:mb-6">
                    <h3 className="text-lg md:text-xl font-bold mb-1">
                      {t(`pricing.${plan.key}` as any)}
                    </h3>
                    <p className="text-xs md:text-sm text-[var(--text-muted)]">
                      {t(`pricing.${plan.key}Desc` as any)}
                    </p>
                  </div>

                  <div className="mb-6 md:mb-7 pb-6 md:pb-7 border-b border-[var(--border)]">
                    <div className="text-[10px] md:text-xs text-[var(--text-faint)] uppercase tracking-wider mb-1">
                      {t('pricing.starterFrom')}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold gradient-text leading-none">
                      {t(`pricing.${plan.key}Price` as any)}
                    </div>
                  </div>

                  <ul className="space-y-2.5 md:space-y-3 mb-7 md:mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 md:gap-3 text-sm">
                        <span className="mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-[var(--purple-soft)] border border-[var(--border-purple)] flex items-center justify-center shrink-0 text-[var(--purple-bright)]">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className="text-[var(--text-secondary)] text-xs md:text-sm">
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
                      {plan.key === 'enterprise' ? t('pricing.contact') : t('pricing.choose')}
                    </Button>
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={300}>
          <div className="mt-14 md:mt-20">
            <Card hover={false} className="text-center py-10 md:py-16 max-w-3xl mx-auto">
              <h2 className="text-xl md:text-3xl font-bold mb-3">
                {t('pricing.customTitle')}
              </h2>
              <p className="text-sm md:text-base text-[var(--text-muted)] mb-6 md:mb-7 max-w-lg mx-auto px-3">
                {t('pricing.customDesc')}
              </p>
              <Link href="/builder">
                <Button className="btn-lg">{t('pricing.customCta')} →</Button>
              </Link>
            </Card>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}