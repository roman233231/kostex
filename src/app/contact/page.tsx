'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { Mail, Send, Clock, ArrowRight } from 'lucide-react';

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
    setSent(true); setSending(false); setName(''); setEmail(''); setMessage('');
  };

  const contacts = [
    { icon: Mail, label: 'Email', value: 'kostex.official@gmail.com', href: 'mailto:kostex.official@gmail.com', color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
    { icon: Send, label: 'Telegram', value: '@kostex_official', href: 'https://t.me/kostex_official', color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
    { icon: InstagramIcon, label: 'Instagram', value: '@kostex.studio', href: 'https://instagram.com/kostex.studio', color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
    { icon: Clock, label: t('contact.responseTime'), value: t('contact.responseDesc'), href: null, color1: '#10B981', color2: '#14B8A6', glow: 'rgba(16,185,129,0.5)' },
  ];

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 max-w-5xl min-h-screen">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge>{t('nav.contact')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6 tracking-tight text-gradient-animated">
              {t('contact.title')}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)]">
              {t('contact.subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Reveal delay={100} className="lg:col-span-3">
            <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px] pointer-events-none" />
              
              {sent ? (
                <div className="text-center py-12 relative z-10">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6 animate-zoom-in">
                    <span className="text-4xl">✅</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-[var(--text)]">{t('contact.sent')}</h2>
                  <p className="text-[var(--text-3)] mb-8">{t('contact.sentDesc')}</p>
                  <Button variant="outline" onClick={() => setSent(false)} className="btn-tactile rounded-full px-8">
                    {t('contact.sendAnother')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <Input label={t('contact.name')} value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="!bg-[var(--surface)]" />
                  <Input label={t('contact.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required className="!bg-[var(--surface)]" />
                  <Textarea label={t('contact.message')} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your project..." required className="!bg-[var(--surface)] min-h-[150px]" />
                  <Button type="submit" disabled={sending} className="w-full btn-tactile rounded-xl py-4 text-lg shadow-[0_0_20px_var(--accent)]">
                    {sending ? t('contact.sending') : t('contact.send')} <ArrowRight size={20} className="ml-2" />
                  </Button>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-2 space-y-4">
            {contacts.map((c, i) => {
              const Icon = c.icon;
              const card = (
                <div className="glass-card rounded-2xl p-5 flex items-center gap-4 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${c.color1}, ${c.color2})` }} />
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 relative z-10" style={{ background: `linear-gradient(135deg, ${c.color1}, ${c.color2})`, boxShadow: `0 8px 24px -8px ${c.glow}` }}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 relative z-10">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-4)] mb-1">{c.label}</div>
                    <div className="text-sm font-semibold text-[var(--text)] truncate group-hover:text-[var(--accent)] transition-colors">{c.value}</div>
                  </div>
                </div>
              );

              if (c.href) {
                return (<a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="block">{card}</a>);
              }
              return <div key={i}>{card}</div>;
            })}
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
