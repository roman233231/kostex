'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Card from '@/components/ui/Card';
import Reveal from '@/components/ui/Reveal';

export default function DashboardPage() {
  const { appUser } = useAuth();
  const { t } = useLanguage();

  return (
    <div>
      <Reveal>
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('account.welcome')}, {appUser?.displayName?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-[var(--text-muted)] mt-1">{t('account.subtitle')}</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Reveal delay={0}>
          <Card hover={false}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                {t('account.activeProjects')}
              </span>
              <span className="text-xl">📊</span>
            </div>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-[var(--text-faint)] mt-1">{t('account.noActive')}</p>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card hover={false}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                {t('account.orders')}
              </span>
              <span className="text-xl">📦</span>
            </div>
            <div className="text-3xl font-bold">0</div>
            <Link
              href="/account/orders"
              className="text-sm text-[var(--purple-bright)] mt-1 inline-block hover:underline"
            >
              {t('account.viewAll')}
            </Link>
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card hover={false}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                {t('account.notifications')}
              </span>
              <span className="text-xl">🔔</span>
            </div>
            <div className="text-3xl font-bold">0</div>
            <Link
              href="/account/notifications"
              className="text-sm text-[var(--purple-bright)] mt-1 inline-block hover:underline"
            >
              {t('account.viewAll')}
            </Link>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={240}>
        <div className="mt-10">
          <Card hover={false} className="text-center py-12">
            <div className="text-4xl mb-3">🚀</div>
            <h2 className="text-xl font-semibold mb-2">{t('account.startFirst')}</h2>
            <p className="text-[var(--text-muted)] mb-5 max-w-md mx-auto">
              {t('account.startFirstDesc')}
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] text-white font-semibold text-sm hover:brightness-110 transition"
            >
              {t('account.openBuilder')}
            </Link>
          </Card>
        </div>
      </Reveal>
    </div>
  );
}