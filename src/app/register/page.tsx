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
    { icon: Zap, text: 'Замовлення за 2 хвилини' },
    { icon: Shield, text: 'Прозорий процес роботи' },
    { icon: Sparkles, text: 'Підтримка 24/7' },
  ];

  return (
    <>
      <Navbar />
      <main className="container py-16 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
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
            background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="w-full max-w-5xl relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — benefits */}
          <div className="hidden lg:block">
            <div className="mb-8">
              <Logo size={48} className="w-12 h-12 mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
                Створіть свій
                <br />
                <span className="gradient-text">цифровий продукт</span>
              </h1>
              <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                Один акаунт — і ви можете замовляти сайти, додатки, боти та кастомні рішення.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex items-center gap-4 group">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        background:
                          i === 0
                            ? 'linear-gradient(135deg, #8B5CF6, #A855F7)'
                            : i === 1
                            ? 'linear-gradient(135deg, #3B82F6, #06B6D4)'
                            : 'linear-gradient(135deg, #EC4899, #F43F5E)',
                        boxShadow:
                          i === 0
                            ? '0 8px 24px -8px rgba(139,92,246,0.5)'
                            : i === 1
                            ? '0 8px 24px -8px rgba(59,130,246,0.5)'
                            : '0 8px 24px -8px rgba(236,72,153,0.5)',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-base font-medium">{b.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="text-center lg:text-left mb-8 lg:hidden">
              <div className="flex justify-center lg:justify-start mb-5">
                <Logo size={56} className="w-14 h-14" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Створити акаунт</h1>
              <p className="text-[var(--text-muted)] mt-2">
                Почніть створювати свій цифровий продукт
              </p>
            </div>

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
                  <h2 className="hidden lg:block text-2xl font-bold mb-6">
                    Створити акаунт
                  </h2>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                      label="Повне ім'я"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Іван Петренко"
                      required
                    />
                    <Input
                      label={t('contact.email')}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                    <Input
                      label="Пароль"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Мінімум 6 символів"
                      required
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Створюємо...' : 'Зареєструватись'}
                      <ArrowRight size={18} />
                    </Button>
                  </form>

                  <p className="mt-5 pt-5 border-t border-[var(--border)] text-sm text-center">
                    Вже маєте акаунт?{' '}
                    <Link
                      href="/login"
                      className="text-[var(--purple-bright)] hover:underline font-medium"
                    >
                      Увійти
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}