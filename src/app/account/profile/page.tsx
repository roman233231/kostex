'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { updateUserProfile } from '@/services/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import { Save, User } from 'lucide-react';

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
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const initial = (
    appUser?.displayName?.[0] ||
    currentUser?.email?.[0] ||
    'U'
  ).toUpperCase();

  return (
    <div>
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('account.profile')}
          </h1>
          <p className="text-[var(--text-muted)] mt-2">{t('account.profileDesc')}</p>
        </div>
      </Reveal>

      {/* Profile card */}
      <Reveal delay={80}>
        <div
          className="color-card mb-6"
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
              <div className="flex items-center gap-5">
                <div
                  className="w-20 h-20 rounded-3xl text-white font-bold text-3xl flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                    boxShadow: '0 12px 32px -8px rgba(139,92,246,0.6)',
                  }}
                >
                  {initial}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xl md:text-2xl truncate">
                    {appUser?.displayName || 'User'}
                  </div>
                  <div className="text-sm text-[var(--text-muted)] truncate mt-1">
                    {currentUser?.email}
                  </div>
                  <div className="mt-3">
                    <Badge>{appUser?.role || 'client'}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Form */}
      <Reveal delay={160}>
        <div
          className="color-card max-w-lg"
          style={
            {
              '--card-color-1': '#3B82F6',
              '--card-color-2': '#06B6D4',
              '--card-glow': 'rgba(59,130,246,0.5)',
            } as React.CSSProperties
          }
        >
          <div className="color-card-inner">
            <div className="color-card-content">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                  }}
                >
                  <User size={18} />
                </div>
                <div className="font-semibold">{t('account.profile')}</div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    {t('account.email')}
                  </label>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    {currentUser?.email}
                  </p>
                </div>

                <Input
                  label={t('account.displayName')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />

                {message && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading}>
                  <Save size={16} />
                  {loading ? t('account.saving') : t('account.saveChanges')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}