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
import { ArrowRight, ShieldCheck } from 'lucide-react';

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
      setError('Невірний email або пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-24 min-h-[85vh] flex items-center justify-center relative">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <Logo size={64} className="w-16 h-16 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]" />
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">З поверненням</h1>
            <p className="text-[var(--text-3)] mt-2">Увійдіть у свій акаунт KOSTEX</p>
          </div>

          <div className="glass-card rounded-[2rem] p-8 md:p-10 border-[var(--accent)]/20 shadow-2xl">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium flex items-center gap-2">
                <span className="text-lg">⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label={t('contact.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              <Input label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              
              <Button type="submit" disabled={loading} className="w-full py-4 rounded-xl text-lg btn-tactile shadow-[0_0_20px_var(--accent)] mt-2">
                {loading ? 'Входимо...' : 'Увійти'} <ArrowRight size={18} className="ml-2" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between text-sm">
              <Link href="/register" className="text-[var(--accent)] hover:text-[var(--text)] font-bold transition-colors">
                Створити акаунт
              </Link>
              <Link href="/forgot-password" className="text-[var(--text-3)] hover:text-[var(--accent)] font-medium transition-colors">
                Забули пароль?
              </Link>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[var(--text-4)]">
            <ShieldCheck size={16} className="text-green-500" />
            <span>Безпечний вхід через Firebase</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
