'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { Link2, Palette, Sparkles, ArrowRight } from 'lucide-react';

export default function InspirationPage() {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [likes, setLikes] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const steps = [
    { icon: Link2, color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
    { icon: Palette, color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
    { icon: Sparkles, color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  ];

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 max-w-5xl min-h-screen">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge>{t('nav.inspiration')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6 tracking-tight text-gradient-animated">
              {t('insp.title')}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)]">
              {t('insp.subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Reveal delay={100} className="lg:col-span-3">
            <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px] pointer-events-none" />
              
              {submitted ? (
                <div className="text-center py-12 relative z-10">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6 animate-zoom-in">
                    <span className="text-4xl">✨</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-[var(--text)]">{t('insp.thanks')}</h2>
                  <p className="text-[var(--text-3)] mb-8">{t('insp.thanksDesc')}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/builder">
                      <Button className="btn-tactile rounded-full px-8 shadow-[0_0_20px_var(--accent)] w-full sm:w-auto">
                        {t('about.startProject')} <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={() => setSubmitted(false)} className="btn-tactile rounded-full px-8 w-full sm:w-auto">
                      {t('insp.addAnother')}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <Input label={t('insp.url')} type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" required className="!bg-[var(--surface)]" />
                  <Textarea label={t('insp.whatLike')} value={likes} onChange={(e) => setLikes(e.target.value)} placeholder="I like the navigation and hero section..." required className="!bg-[var(--surface)] min-h-[120px]" />
                  <Textarea label={t('insp.notes')} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any other details..." className="!bg-[var(--surface)] min-h-[100px]" />
                  <Button type="submit" className="w-full btn-tactile rounded-xl py-4 text-lg shadow-[0_0_20px_var(--accent)]">
                    {t('insp.submit')} <ArrowRight size={18} className="ml-2" />
                  </Button>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 text-[var(--text)]">{t('insp.howItWorks')}</h3>
              <ol className="space-y-6">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <li key={i} className="flex gap-4 items-start group">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ background: `linear-gradient(135deg, ${step.color1}, ${step.color2})`, boxShadow: `0 8px 20px -8px ${step.glow}` }}>
                        <Icon size={20} />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-2)] leading-relaxed pt-3">
                        {t(`insp.step${i + 1}` as any)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="glass-card rounded-3xl p-8 border-[var(--accent)]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-[50px]" />
              <p className="text-sm font-medium text-[var(--text-3)] leading-relaxed relative z-10">
                {t('insp.note')}
              </p>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
