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
      <main className="container py-16 max-w-5xl">
        <Reveal>
          <div className="mb-12">
            <Badge>{t('nav.inspiration')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 tracking-tight leading-[1.05]">
              {t('insp.title')}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-5 max-w-2xl">
              {t('insp.subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Reveal delay={100} className="lg:col-span-3">
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
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">✨</div>
                      <h2 className="text-xl font-semibold mb-2">{t('insp.thanks')}</h2>
                      <p className="text-[var(--text-muted)] mb-6">{t('insp.thanksDesc')}</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/builder">
                          <Button>
                            {t('about.startProject')} <ArrowRight size={18} />
                          </Button>
                        </Link>
                        <Button variant="outline" onClick={() => setSubmitted(false)}>
                          {t('insp.addAnother')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <Input
                        label={t('insp.url')}
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        required
                      />
                      <Textarea
                        label={t('insp.whatLike')}
                        value={likes}
                        onChange={(e) => setLikes(e.target.value)}
                        placeholder="I like the navigation and hero section..."
                        required
                      />
                      <Textarea
                        label={t('insp.notes')}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any other details..."
                      />
                      <Button type="submit" className="w-full sm:w-auto">
                        {t('insp.submit')} <ArrowRight size={18} />
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-2 space-y-4">
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
                  <h3 className="text-lg font-semibold mb-4">{t('insp.howItWorks')}</h3>
                  <ol className="space-y-4">
                    {steps.map((step, i) => {
                      const Icon = step.icon;
                      return (
                        <li key={i} className="flex gap-3 items-start">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${step.color1}, ${step.color2})`,
                              boxShadow: `0 8px 20px -8px ${step.glow}`,
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <span className="text-sm text-[var(--text-muted)] leading-relaxed pt-1.5">
                            {t(`insp.step${i + 1}` as any)}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>

            <div
              className="color-card"
              style={
                {
                  '--card-color-1': '#10B981',
                  '--card-color-2': '#14B8A6',
                  '--card-glow': 'rgba(16,185,129,0.5)',
                } as React.CSSProperties
              }
            >
              <div className="color-card-inner">
                <div className="color-card-content">
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {t('insp.note')}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}