'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setSending(false);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-5xl">
        <Reveal>
          <div className="mb-12">
            <Badge>{t('nav.contact')}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4 max-w-2xl">
              {t('contact.subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Reveal delay={100} className="lg:col-span-3">
            <Card hover={false}>
              {sent ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">✅</div>
                  <h2 className="text-xl font-semibold mb-2">{t('contact.sent')}</h2>
                  <p className="text-[var(--text-muted)] mb-6">{t('contact.sentDesc')}</p>
                  <Button variant="outline" onClick={() => setSent(false)}>
                    {t('contact.sendAnother')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label={t('contact.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                  <Input
                    label={t('contact.email')}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                  <Textarea
                    label={t('contact.message')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project..."
                    required
                  />
                  <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                    {sending ? t('contact.sending') : t('contact.send')}
                  </Button>
                </form>
              )}
            </Card>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-2 space-y-5">
            <Card hover={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-3">
                {t('contact.emailLabel')}
              </h3>
              <p className="text-[var(--text-secondary)]">hello@kostex.com</p>
            </Card>
            <Card hover={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-3">
                {t('contact.telegram')}
              </h3>
              <p className="text-[var(--text-secondary)]">@kostex</p>
            </Card>
            <Card hover={false}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-3">
                {t('contact.responseTime')}
              </h3>
              <p className="text-[var(--text-secondary)]">{t('contact.responseDesc')}</p>
            </Card>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}