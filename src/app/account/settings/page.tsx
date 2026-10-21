'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import { Shield, Mail, User as UserIcon, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, appUser } = useAuth();
  const { t } = useLanguage();

  const info = [
    { labelKey: 'account.email', value: currentUser?.email || '', icon: Mail },
    { labelKey: 'account.role', value: appUser?.role || 'client', icon: Shield },
    {
      labelKey: 'account.userId',
      value: currentUser?.uid?.slice(0, 16) + '...',
      icon: UserIcon,
    },
  ];

  return (
    <div>
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('account.settings')}
          </h1>
        </div>
      </Reveal>

      <div className="space-y-4 max-w-2xl">
        <Reveal delay={80}>
          <div
            className="color-card"
            style={
              {
                '--card-color-1': '#8B5CF6',
                '--card-color-2': '#A855F7',
                '--card-glow': 'rgba(139,92,246,0.5)',
              } as React.CSSProperties
            }
          >
            <div className="color-card-inner">
              <div className="color-card-content">
                <div className="font-semibold mb-5">Інформація акаунта</div>

                <div className="space-y-4">
                  {info.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 pb-4 border-b border-[var(--border)] last:border-b-0 last:pb-0"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
                          <span className="text-sm text-[var(--text-muted)]">
                            {t(item.labelKey as any)}
                          </span>
                          <span className="text-sm font-medium truncate">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div
            className="color-card"
            style={
              {
                '--card-color-1': '#EF4444',
                '--card-color-2': '#F43F5E',
                '--card-glow': 'rgba(239,68,68,0.5)',
              } as React.CSSProperties
            }
          >
            <div className="color-card-inner">
              <div className="color-card-content">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #EF4444, #F43F5E)',
                    }}
                  >
                    <AlertTriangle size={18} />
                  </div>
                  <div className="font-semibold">{t('account.dangerZone')}</div>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {t('account.dangerDesc')}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}