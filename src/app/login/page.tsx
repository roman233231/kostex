'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/components/layout/Logo';
import { loginUser, getUserData } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, appUser, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && currentUser && appUser) {
      router.push(appUser.role === 'admin' ? '/admin' : '/account');
    }
  }, [currentUser, appUser, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      const userData = await getUserData(user.uid);
      router.push(userData?.role === 'admin' ? '/admin' : '/account');
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size={56} className="w-14 h-14" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t('nav.login')}</h1>
          </div>

          <Card hover={false}>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label={t('contact.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('common.loading') : t('nav.login')}
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t border-[var(--border)] flex justify-between text-sm">
              <Link href="/register" className="text-[var(--purple-bright)] hover:underline">
                {t('nav.register')}
              </Link>
              <Link href="/forgot-password" className="text-[var(--purple-bright)] hover:underline">
                Forgot?
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}