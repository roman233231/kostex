'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

export default function SettingsPage() {
  const { currentUser, appUser } = useAuth();
  const { t } = useLanguage();

  return (
    <div>
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t('account.settings')}</h1>
        </div>
      </Reveal>

      <div className="space-y-4 max-w-2xl">
        <Reveal delay={80}>
          <Card hover={false}>
            <h2 className="text-base font-semibold mb-3">{t('account.email')}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">{t('account.email')}</span>
                <span>{currentUser?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">{t('account.role')}</span>
                <Badge>{appUser?.role || 'client'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">{t('account.userId')}</span>
                <span className="text-[var(--text-faint)] text-xs font-mono">
                  {currentUser?.uid.slice(0, 12)}...
                </span>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card hover={false}>
            <h2 className="text-base font-semibold mb-3">{t('account.dangerZone')}</h2>
            <p className="text-sm text-[var(--text-muted)]">{t('account.dangerDesc')}</p>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}