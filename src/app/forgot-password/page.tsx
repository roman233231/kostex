'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { resetPassword } from '@/services/auth';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

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
      <main className="container py-24 min-h-[85vh] flex items-center justify-center relative overflow-hidden">
        {/* Фонові плями */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

        <Reveal>
          <div className="w-full max-w-md relative z-10">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)] animate-float" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
                  <Mail size={32} />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
                Скидання пароля
              </h1>
              <p className="text-[var(--text-3)] mt-2">
                Введіть email, і ми надішлемо посилання для відновлення
              </p>
            </div>

            <div className="glass-card rounded-[2rem] p-8 md:p-10 border-[var(--border)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2 animate-slide-up">
                  <span className="text-lg">⚠</span> {error}
                </div>
              )}
              {message && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm flex items-center gap-2 animate-slide-up">
                  <CheckCircle2 size={18} /> {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label={t('contact.email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="!bg-[var(--surface-2)] !py-4 !text-lg"
                />
                <Button type="submit" disabled={loading} className="w-full py-4 rounded-xl text-lg btn-tactile shadow-[0_0_20px_var(--accent)]">
                  {loading ? 'Надсилаємо...' : 'Надіслати посилання'}
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-3)] hover:text-[var(--accent)] transition-colors"
                >
                  <ArrowLeft size={16} />
                  Назад до входу
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
