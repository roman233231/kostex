'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { Check, ArrowRight, Star } from 'lucide-react';

const plans = [
  { key: 'starter', popular: false, features: ['starterF1', 'starterF2', 'starterF3', 'starterF4', 'starterF5', 'starterF6'], color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)', emoji: '🚀' },
  { key: 'business', popular: true, features: ['businessF1', 'businessF2', 'businessF3', 'businessF4', 'businessF5', 'businessF6', 'businessF7', 'businessF8'], color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)', emoji: '⭐' },
  { key: 'enterprise', popular: false, features: ['enterpriseF1', 'enterpriseF2', 'enterpriseF3', 'enterpriseF4', 'enterpriseF5', 'enterpriseF6', 'enterpriseF7'], color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)', emoji: '👑' },
] as const;

export default function PricingPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge>{t('pricing.badge')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6 leading-tight">
              {t('pricing.title')}<br />
              <span className="text-gradient-animated">{t('pricing.title2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)]">{t('pricing.subtitle')}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, i) => {
            const isPopular = plan.popular;
            return (
              <Reveal key={plan.key} delay={i * 100} className={`h-full ${isPopular ? 'md:-translate-y-4 z-10' : 'z-0'}`}>
                <div className={`relative h-full glass-card rounded-[2rem] p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 ${isPopular ? 'border-[var(--accent)] shadow-[0_0_40px_var(--accent)] bg-[var(--surface)]/80' : 'hover:border-[var(--accent)]/50'}`}>
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest animate-glow flex items-center gap-2" style={{ background: `linear-gradient(135deg, ${plan.color1}, ${plan.color2})` }}>
                      <Star size={14} fill="currentColor" /> {t('pricing.popular')}
                    </div>
                  )}

                  <div className="text-5xl mb-6">{plan.emoji}</div>
                  <h3 className="text-2xl font-bold mb-2">{t(`pricing.${plan.key}` as any)}</h3>
                  <p className="text-sm text-[var(--text-3)] mb-8 min-h-[40px]">{t(`pricing.${plan.key}Desc` as any)}</p>
                  
                  <div className="mb-8 pb-8 border-b border-[var(--border)]">
                    <div className="text-xs text-[var(--text-4)] uppercase tracking-widest mb-2 font-semibold">{t('pricing.starterFrom')}</div>
                    <div className="text-4xl font-bold" style={{ background: `linear-gradient(135deg, ${plan.color1}, ${plan.color2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {t(`pricing.${plan.key}Price` as any)}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-[var(--text-2)]">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${plan.color1}20`, color: plan.color1 }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="leading-snug">{t(`pricing.${f}` as any)}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.key === 'enterprise' ? '/contact' : '/builder'} className="mt-auto">
                    <Button variant={isPopular ? 'primary' : 'outline'} className={`w-full py-4 rounded-xl font-bold btn-tactile ${isPopular ? 'shadow-[0_10px_20px_-10px_var(--accent)]' : ''}`}>
                      {plan.key === 'enterprise' ? t('pricing.contact') : t('pricing.choose')}
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
