'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/components/layout/Logo';
import { loginUser, getUserData } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Sparkles } from 'lucide-react';

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
      setError('Невірний email або пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
        {/* Ambient glows */}
        <div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.15), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="w-full max-w-md relative">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(139,92,246,0.5), transparent 70%)',
                    filter: 'blur(30px)',
                    animation: 'pulse 4s ease-in-out infinite',
                  }}
                />
                <Logo size={64} className="relative w-16 h-16" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              З поверненням
            </h1>
            <p className="text-[var(--text-muted)] mt-2">
              Увійдіть у свій акаунт KOSTEX
            </p>
          </div>

          {/* Colorful glass card */}
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
                    {loading ? 'Входимо...' : 'Увійти'}
                    <ArrowRight size={18} />
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-[var(--border)] flex justify-between text-sm">
                  <Link
                    href="/register"
                    className="text-[var(--purple-bright)] hover:underline font-medium"
                  >
                    Створити акаунт
                  </Link>
                  <Link
                    href="/forgot-password"
                    className="text-[var(--purple-bright)] hover:underline font-medium"
                  >
                    Забули пароль?
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Hint */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--text-faint)]">
            <Sparkles size={14} className="text-[var(--purple)]" />
            <span>Безпечний вхід через Firebase</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}