'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';

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

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-5xl">
        <Reveal>
          <div className="mb-12">
            <Badge>{t('nav.inspiration')}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              {t('insp.title')}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4 max-w-2xl">
              {t('insp.subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Reveal delay={100} className="lg:col-span-3">
            <Card hover={false}>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">✨</div>
                  <h2 className="text-xl font-semibold mb-2">{t('insp.thanks')}</h2>
                  <p className="text-[var(--text-muted)] mb-6">{t('insp.thanksDesc')}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/builder"><Button>{t('about.startProject')}</Button></Link>
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
                    {t('insp.submit')}
                  </Button>
                </form>
              )}
            </Card>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-2 space-y-5">
            <Card hover={false}>
              <h3 className="text-lg font-semibold mb-4">{t('insp.howItWorks')}</h3>
              <ol className="space-y-3 text-sm text-[var(--text-muted)]">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--purple-soft)] text-[var(--purple-bright)] flex items-center justify-center text-xs font-semibold flex-shrink-0">1</span>
                  {t('insp.step1')}
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--purple-soft)] text-[var(--purple-bright)] flex items-center justify-center text-xs font-semibold flex-shrink-0">2</span>
                  {t('insp.step2')}
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--purple-soft)] text-[var(--purple-bright)] flex items-center justify-center text-xs font-semibold flex-shrink-0">3</span>
                  {t('insp.step3')}
                </li>
              </ol>
            </Card>
            <Card hover={false} className="border-[var(--border-purple)]">
              <p className="text-sm text-[var(--text-muted)]">{t('insp.note')}</p>
            </Card>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}