'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Reveal from '@/components/ui/Reveal';
import { Shield, Mail, User as UserIcon, AlertTriangle, Fingerprint } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, appUser } = useAuth();
  const { t } = useLanguage();

  const info = [
    { labelKey: 'account.email', value: currentUser?.email || '', icon: Mail },
    { labelKey: 'account.role', value: appUser?.role || 'client', icon: Shield },
    { labelKey: 'account.userId', value: currentUser?.uid?.slice(0, 16) + '...', icon: Fingerprint },
  ];

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      <Reveal>
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            {t('account.settings')}
          </h1>
          <p className="text-lg text-[var(--text-3)]">Керуйте своїм акаунтом та налаштуваннями безпеки</p>
        </div>
      </Reveal>

      <div className="space-y-8">
        {/* Account Info */}
        <Reveal delay={80}>
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <h3 className="text-xl font-bold text-[var(--text)] mb-6 border-b border-[var(--border)] pb-4">
              Інформація акаунта
            </h3>

            <div className="space-y-2">
              {info.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl hover:bg-[var(--surface-2)] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--surface-2)] text-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-colors">
                        <Icon size={18} />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-3)]">
                        {t(item.labelKey as any)}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[var(--text)] bg-[var(--surface)] px-3 py-1.5 rounded-lg border border-[var(--border)] truncate max-w-[200px]">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Danger Zone */}
        <Reveal delay={160}>
          <div className="glass-card rounded-[2rem] p-8 md:p-10 border-red-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[50px] pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 bg-red-500/10">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-xl font-bold text-red-500">{t('account.dangerZone')}</h3>
            </div>
            
            <p className="text-sm text-[var(--text-3)] leading-relaxed mb-6 relative z-10 max-w-lg">
              {t('account.dangerDesc')}
            </p>
            
            <button className="relative z-10 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all btn-tactile">
              Видалити акаунт
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
