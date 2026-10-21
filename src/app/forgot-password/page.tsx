'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/components/layout/Logo';
import { resetPassword } from '@/services/auth';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Лист для скидання пароля надіслано. Перевірте пошту.');
    } catch (err) {
      setError('Не вдалося надіслати лист. Перевірте email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="w-full max-w-md relative">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-white"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                  boxShadow: '0 12px 32px -8px rgba(59,130,246,0.6)',
                }}
              >
                <Mail size={28} />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Скидання пароля
            </h1>
            <p className="text-[var(--text-muted)] mt-2">
              Ми надішлемо посилання для відновлення
            </p>
          </div>

          <div
            className="color-card"
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
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                    {message}
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
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Надсилаємо...' : 'Надіслати посилання'}
                    <ArrowRight size={18} />
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-[var(--purple-bright)] hover:underline font-medium"
                  >
                    <ArrowLeft size={14} />
                    Назад до входу
                  </Link>
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