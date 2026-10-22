'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { updateUserProfile } from '@/services/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import { Save, User, Mail, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { appUser, currentUser } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState(appUser?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await updateUserProfile(name);
      setMessage(t('account.profileUpdated'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const initial = (appUser?.displayName?.[0] || currentUser?.email?.[0] || 'U').toUpperCase();

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      <Reveal>
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            {t('account.profile')}
          </h1>
          <p className="text-lg text-[var(--text-3)]">{t('account.profileDesc')}</p>
        </div>
      </Reveal>

      {/* Profile Header Card */}
      <Reveal delay={80}>
        <div className="glass-card rounded-[2rem] p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--accent)]/30 blur-[30px] rounded-full animate-pulse" />
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full text-white font-bold text-4xl md:text-5xl flex items-center justify-center shrink-0 border-4 border-[var(--surface-2)] shadow-xl relative z-10" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                {initial}
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-2">
                {appUser?.displayName || 'Користувач'}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-[var(--text-3)] mb-4">
                <Mail size={16} />
                <span>{currentUser?.email}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                <ShieldCheck size={14} /> {appUser?.role || 'client'}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Form */}
      <Reveal delay={160}>
        <div className="glass-card rounded-[2rem] p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8 border-b border-[var(--border)] pb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
              <User size={18} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text)]">Особисті дані</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[var(--surface-2)] rounded-xl p-4 border border-[var(--border)]">
              <label className="text-xs font-bold text-[var(--text-4)] uppercase tracking-wider mb-1 block">
                {t('account.email')}
              </label>
              <p className="text-base font-medium text-[var(--text)]">
                {currentUser?.email}
              </p>
            </div>

            <Input
              label={t('account.displayName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше ім'я"
              required
              className="!bg-[var(--surface-2)] !border-[var(--border)] !py-4 !text-lg"
            />

            {message && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm font-medium flex items-center gap-2 animate-slide-up">
                <ShieldCheck size={18} /> {message}
              </div>
            )}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium flex items-center gap-2 animate-slide-up">
                ⚠ {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-4 text-lg rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)] mt-2">
              <Save size={18} className="mr-2" />
              {loading ? t('account.saving') : t('account.saveChanges')}
            </Button>
          </form>
        </div>
      </Reveal>
    </div>
  );
}
