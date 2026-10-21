'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/components/layout/Logo';
import { registerUser } from '@/services/auth';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Shield, Sparkles, Zap, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(name, email, password);
      router.push('/account');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Zap, text: 'Замовлення за 2 хвилини', color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
    { icon: Shield, text: 'Прозорий процес роботи', color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
    { icon: Sparkles, text: 'Підтримка 24/7', color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  ];

  return (
    <>
      <Navbar />
      <main className="container py-24 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Фонові плями */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[var(--accent)]/15 rounded-full blur-[120px] pointer-events-none animate-float" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

        <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Ліва частина — Переваги */}
          <div className="hidden lg:block animate-slide-up">
            <Logo size={56} className="w-14 h-14 mb-8" />
            <h1 className="text-5xl font-bold tracking-tight leading-[1.1] mb-6 text-[var(--text)]">
              Створіть свій
              <br />
              <span className="text-gradient-animated">цифровий продукт</span>
            </h1>
            <p className="text-lg text-[var(--text-3)] leading-relaxed mb-12">
              Один акаунт — і ви можете замовляти сайти, додатки, боти та кастомні рішення.
            </p>

            <div className="space-y-6">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex items-center gap-5 group">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ background: `linear-gradient(135deg, ${b.color1}, ${b.color2})`, boxShadow: `0 8px 24px -8px ${b.glow}` }}>
                      <Icon size={24} />
                    </div>
                    <span className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{b.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Права частина — Форма */}
          <div className="w-full max-w-md mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="text-center mb-8 lg:hidden">
              <Logo size={56} className="w-14 h-14 mx-auto mb-4" />
              <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">Створити акаунт</h1>
            </div>

            <div className="glass-card rounded-[2rem] p-8 md:p-10 border-[var(--accent)]/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
              <h2 className="hidden lg:block text-2xl font-bold mb-6 text-[var(--text)]">Створити акаунт</h2>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-3">
                  <span className="text-lg">⚠</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Повне ім'я" value={name} onChange={(e) => setName(e.target.value)} placeholder="Іван Петренко" required className="!bg-[var(--surface)]" />
                <Input label={t('contact.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="!bg-[var(--surface)]" />
                <Input label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Мінімум 6 символів" required className="!bg-[var(--surface)]" />
                
                <Button type="submit" disabled={loading} className="w-full py-4 rounded-xl text-lg btn-tactile shadow-[0_0_20px_var(--accent)] mt-2">
                  {loading ? 'Створюємо...' : 'Зареєструватись'} <ArrowRight size={18} className="ml-2" />
                </Button>
              </form>

              <p className="mt-6 pt-6 border-t border-[var(--border)] text-sm text-center text-[var(--text-3)]">
                Вже маєте акаунт?{' '}
                <Link href="/login" className="text-[var(--accent)] hover:text-[var(--text)] font-bold transition-colors">
                  Увійти
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
