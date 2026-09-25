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

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge>{t('pricing.badge')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-5 tracking-tight leading-[1.05]">
              {t('pricing.title')}
              <br />
              <span className="gradient-text">{t('pricing.title2')}</span>
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-5">{t('pricing.subtitle')}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {plans.map((plan, i) => {
            const isPopular = plan.popular;
            return (
              <Reveal key={plan.key} delay={i * 100}>
                <div
                  className={`relative h-full rounded-3xl border p-7 flex flex-col transition-all duration-300 ${
                    isPopular
                      ? 'border-[var(--border-purple)] bg-gradient-to-b from-[var(--purple)]/[0.08] to-transparent shadow-[0_20px_60px_-20px_rgba(139,92,246,0.4)] md:scale-[1.02]'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.6)] whitespace-nowrap">
                      {t('pricing.popular')}
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1">{t(`pricing.${plan.key}` as any)}</h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {t(`pricing.${plan.key}Desc` as any)}
                    </p>
                  </div>

                  <div className="mb-7 pb-7 border-b border-[var(--border)]">
                    <div className="text-xs text-[var(--text-faint)] uppercase tracking-wider mb-1">
                      {t('pricing.starterFrom')}
                    </div>
                    <div className="text-4xl font-bold gradient-text">
                      {t(`pricing.${plan.key}Price` as any)}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-[var(--purple-soft)] border border-[var(--border-purple)] flex items-center justify-center shrink-0 text-[var(--purple-bright)]">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className="text-[var(--text-secondary)]">
                          {t(`pricing.${f}` as any)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.key === 'enterprise' ? (
                    <Link href="/contact">
                      <Button variant={isPopular ? 'primary' : 'outline'} className="w-full">
                        {t('pricing.contact')}
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/builder">
                      <Button variant={isPopular ? 'primary' : 'outline'} className="w-full">
                        {t('pricing.choose')}
                      </Button>
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={300}>
          <div className="mt-20">
            <Card hover={false} className="text-center py-12 md:py-16 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('pricing.customTitle')}</h2>
              <p className="text-[var(--text-muted)] mb-7 max-w-lg mx-auto">
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