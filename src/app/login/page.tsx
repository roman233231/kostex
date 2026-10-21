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
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

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
      <main className="container py-24 min-h-[85vh] flex items-center justify-center relative overflow-hidden">
        {/* Фонові плями */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--accent)]/15 rounded-full blur-[120px] pointer-events-none animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-[var(--accent)]/30 blur-[40px] rounded-full animate-pulse" />
              <Logo size={72} className="relative w-18 h-18 drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">З поверненням</h1>
            <p className="text-[var(--text-3)] mt-2">Увійдіть у свій акаунт KOSTEX</p>
          </div>

          <div className="glass-card rounded-[2rem] p-8 md:p-10 border-[var(--accent)]/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-3 animate-slide-up">
                <span className="text-lg">⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label={t('contact.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="!bg-[var(--surface)]" />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="!bg-[var(--surface)]" />
              
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
