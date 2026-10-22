'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Reveal from '@/components/ui/Reveal';
import { LayoutDashboard, Package, Bell, ArrowRight, Rocket } from 'lucide-react';

const cards = [
  { titleKey: 'account.activeProjects', noKey: 'account.noActive', value: '0', href: null, icon: LayoutDashboard, color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  { titleKey: 'account.orders', noKey: null, value: '0', href: '/account/orders', icon: Package, color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  { titleKey: 'account.notifications', noKey: null, value: '0', href: '/account/notifications', icon: Bell, color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
];

export default function DashboardPage() {
  const { appUser } = useAuth();
  const { t } = useLanguage();

  return (
    <div>
      <Reveal>
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            {t('account.welcome')},{' '}
            <span className="text-gradient-animated">
              {appUser?.displayName?.split(' ')[0] || 'User'}
            </span>
          </h1>
          <p className="text-lg text-[var(--text-3)]">
            {t('account.subtitle')}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          const content = (
            <div className="glass-card rounded-3xl p-8 h-full relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" style={{ background: c.color1 }} />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ background: `linear-gradient(135deg, ${c.color1}, ${c.color2})`, boxShadow: `0 8px 24px -8px ${c.glow}` }}>
                  <Icon size={24} />
                </div>
                {c.href && (
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-3)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
                    <ArrowRight size={16} className="group-hover:-rotate-45 transition-transform" />
                  </div>
                )}
              </div>

              <div className="text-xs font-bold text-[var(--text-4)] uppercase tracking-wider mb-2 relative z-10">
                {t(c.titleKey as any)}
              </div>
              <div className="text-4xl font-bold mb-2 relative z-10" style={{ background: `linear-gradient(135deg, ${c.color1}, ${c.color2})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {c.value}
              </div>
              {c.noKey && (
                <p className="text-sm text-[var(--text-3)] relative z-10">{t(c.noKey as any)}</p>
              )}
            </div>
          );

          return (
            <Reveal key={i} delay={i * 80}>
              {c.href ? (
                <Link href={c.href} className="block h-full">{content}</Link>
              ) : (
                <div className="h-full">{content}</div>
              )}
            </Reveal>
          );
        })}
      </div>

      {/* Empty state */}
      <Reveal delay={240}>
        <div className="mt-12">
          <div className="glass-card rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden border-[var(--accent)]/30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 relative z-10 animate-float" style={{ background: 'linear-gradient(135deg, #D946EF, #8B5CF6)', boxShadow: '0 12px 32px -8px rgba(217,70,239,0.6)' }}>
              <Rocket size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">
              {t('account.startFirst')}
            </h2>
            <p className="text-base text-[var(--text-3)] mb-8 max-w-lg mx-auto relative z-10">
              {t('account.startFirstDesc')}
            </p>
            <Link href="/builder" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white font-bold text-base hover:brightness-110 hover:-translate-y-1 transition-all shadow-[0_0_20px_var(--accent)] btn-tactile relative z-10">
              {t('account.openBuilder')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
