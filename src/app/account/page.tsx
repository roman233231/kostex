'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Reveal from '@/components/ui/Reveal';
import { LayoutDashboard, Package, Bell, ArrowRight, Rocket } from 'lucide-react';

const cards = [
  {
    titleKey: 'account.activeProjects',
    noKey: 'account.noActive',
    value: '0',
    href: null,
    icon: LayoutDashboard,
    color1: '#8B5CF6',
    color2: '#A855F7',
    glow: 'rgba(139,92,246,0.5)',
  },
  {
    titleKey: 'account.orders',
    noKey: null,
    value: '0',
    href: '/account/orders',
    icon: Package,
    color1: '#3B82F6',
    color2: '#06B6D4',
    glow: 'rgba(59,130,246,0.5)',
  },
  {
    titleKey: 'account.notifications',
    noKey: null,
    value: '0',
    href: '/account/notifications',
    icon: Bell,
    color1: '#EC4899',
    color2: '#F43F5E',
    glow: 'rgba(236,72,153,0.5)',
  },
];

export default function DashboardPage() {
  const { appUser } = useAuth();
  const { t } = useLanguage();

  return (
    <div>
      <Reveal>
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('account.welcome')},{' '}
            <span className="gradient-text">
              {appUser?.displayName?.split(' ')[0] || 'User'}
            </span>
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            {t('account.subtitle')}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          const content = (
            <div
              className="color-card h-full"
              style={
                {
                  '--card-color-1': c.color1,
                  '--card-color-2': c.color2,
                  '--card-glow': c.glow,
                } as React.CSSProperties
              }
            >
              <div className="color-card-inner">
                <div className="color-card-content">
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                      style={{
                        background: `linear-gradient(135deg, ${c.color1}, ${c.color2})`,
                        boxShadow: `0 8px 24px -8px ${c.glow}`,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    {c.href && (
                      <ArrowRight
                        size={18}
                        className="text-[var(--text-faint)] group-hover:text-[var(--purple-bright)] group-hover:translate-x-1 transition-all"
                      />
                    )}
                  </div>

                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    {t(c.titleKey as any)}
                  </div>
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{
                      background: `linear-gradient(135deg, ${c.color1}, ${c.color2})`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {c.value}
                  </div>
                  {c.noKey && (
                    <p className="text-xs text-[var(--text-faint)]">
                      {t(c.noKey as any)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );

          return (
            <Reveal key={i} delay={i * 80}>
              {c.href ? (
                <Link href={c.href} className="block h-full group">
                  {content}
                </Link>
              ) : (
                <div className="h-full">{content}</div>
              )}
            </Reveal>
          );
        })}
      </div>

      {/* Empty state */}
      <Reveal delay={240}>
        <div className="mt-10">
          <div
            className="color-card"
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
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto mb-5"
                  style={{
                    background: 'linear-gradient(135deg, #D946EF, #8B5CF6)',
                    boxShadow: '0 12px 32px -8px rgba(217,70,239,0.6)',
                  }}
                >
                  <Rocket size={28} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3">
                  {t('account.startFirst')}
                </h2>
                <p className="text-sm md:text-base text-[var(--text-muted)] mb-7 max-w-md mx-auto">
                  {t('account.startFirstDesc')}
                </p>
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] text-white font-semibold text-sm hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-[0_8px_24px_rgba(139,92,246,0.4)]"
                >
                  {t('account.openBuilder')}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}