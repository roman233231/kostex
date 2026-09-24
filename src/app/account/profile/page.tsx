'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { updateUserProfile } from '@/services/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

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

  const initial = (appUser?.displayName?.[0] || currentUser?.email?.[0] || 'U').toUpperCase();

  return (
    <div>
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t('account.profile')}</h1>
          <p className="text-[var(--text-muted)] mt-1">{t('account.profileDesc')}</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Card hover={false} className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-white font-bold text-2xl flex items-center justify-center shrink-0">
              {initial}
            </div>
            <div>
              <div className="font-semibold text-lg">{appUser?.displayName || 'User'}</div>
              <div className="text-sm text-[var(--text-muted)]">{currentUser?.email}</div>
              <div className="mt-2">
                <Badge>{appUser?.role || 'client'}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={160}>
        <Card hover={false} className="max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                {t('account.email')}
              </label>
              <p className="text-sm text-[var(--text-muted)] mt-1">{currentUser?.email}</p>
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
              {loading ? t('account.saving') : t('account.saveChanges')}
            </Button>
          </form>
        </Card>
      </Reveal>
    </div>
  );
}