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
import { Mail, Send, Clock } from 'lucide-react';

// Іконка Instagram — вставляється ПІСЛЯ імпортів
// і ПЕРЕД функцією ContactPage (на верхньому рівні файлу)
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

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

  const contacts = [
    {
      icon: Mail,
      label: 'Email',
      value: 'kostex.official@gmail.com',
      href: 'mailto:kostex.official@gmail.com',
    },
    {
      icon: Send,
      label: 'Telegram',
      value: '@kostex_official',
      href: 'https://t.me/kostex_official',
    },
    {
      icon: InstagramIcon,
      label: 'Instagram',
      value: '@kostex.studio',
      href: 'https://instagram.com/kostex.studio',
    },
    {
      icon: Clock,
      label: t('contact.responseTime'),
      value: t('contact.responseDesc'),
      href: null,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-5xl">
        <Reveal>
          <div className="mb-12">
            <Badge>{t('nav.contact')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 tracking-tight">
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

          <Reveal delay={200} className="lg:col-span-2 space-y-4">
            {contacts.map((c, i) => {
              const Icon = c.icon;
              const content = (
                <Card hover={false} className="group hover:border-[var(--border-purple)] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--purple-soft)] border border-[var(--border-purple)] flex items-center justify-center text-[var(--purple-bright)] shrink-0 group-hover:scale-110 transition-transform">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-0.5">
                        {c.label}
                      </div>
                      <div className="text-sm font-medium truncate">{c.value}</div>
                    </div>
                  </div>
                </Card>
              );

              if (c.href) {
                return (
                  <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="block">
                    {content}
                  </a>
                );
              }
              return <div key={i}>{content}</div>;
            })}
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}