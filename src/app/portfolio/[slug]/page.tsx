'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { getPortfolioBySlug } from '@/services/portfolio';
import { PortfolioItem } from '@/types/portfolio';
import { ArrowLeft, Check, ExternalLink, Code2, Layers } from 'lucide-react';

export default function PortfolioDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const data = await getPortfolioBySlug(slug);
        setItem(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container py-24 md:py-32 min-h-screen">
          <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
            <div className="h-6 w-32 bg-[var(--surface-2)] rounded-lg" />
            <div className="h-16 w-3/4 bg-[var(--surface-2)] rounded-2xl" />
            <div className="h-96 w-full bg-[var(--surface-2)] rounded-3xl" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!item || !item.published) notFound();

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen pb-32">
        <Reveal>
          <Link href="/portfolio" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('portfolio.back')}
          </Link>
        </Reveal>

        <Reveal delay={50}>
          <div className="mb-12 max-w-4xl">
            <Badge className="mb-4">{item.category.replace('-', ' ')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-gradient-animated mb-6">
              {item.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)] leading-relaxed">
              {item.description}
            </p>
          </div>
        </Reveal>

        {item.image && (
          <Reveal delay={100}>
            <div className="mb-16 rounded-[2rem] overflow-hidden border border-[var(--border)] relative w-full aspect-[16/9] shadow-[0_20px_80px_-20px_rgba(139,92,246,0.15)] group">
              <div className="absolute inset-0 bg-[var(--accent)]/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {item.features && item.features.length > 0 && (
              <Reveal>
                <div className="glass-card rounded-3xl p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Layers className="text-[var(--accent)]" /> {t('product.features')}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-[var(--text-2)] font-medium">
                        <div className="w-6 h-6 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={14} className="text-[var(--accent)]" strokeWidth={3} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {item.technologies && item.technologies.length > 0 && (
              <Reveal delay={100}>
                <div className="glass-card rounded-3xl p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Code2 className="text-[var(--accent)]" /> Technologies
                  </h2>
                  <div className="flex flex-wrap gap-2.5">
                    {item.technologies.map((tech, i) => (
                      <span key={i} className="px-4 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium text-[var(--text-2)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-1 sticky top-28">
            <Reveal delay={150}>
              <div className="glass-card rounded-[2rem] p-8 border-[var(--accent)]/30 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.2)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent)]/20 rounded-full blur-[60px]" />
                
                <h3 className="text-xl font-bold mb-3 relative z-10">{t('portfolio.getThis')}</h3>
                <p className="text-sm text-[var(--text-3)] mb-8 leading-relaxed relative z-10">
                  {t('portfolio.getThisDesc')}
                </p>
                
                <div className="flex flex-col gap-3 relative z-10">
                  {item.demoUrl && (
                    <Button href={item.demoUrl} className="w-full py-4 text-lg rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)] group">
                      {t('portfolio.viewLive')} <ExternalLink size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  )}
                  <Button variant="outline" href="/builder" className="w-full py-4 rounded-xl border-[var(--border)] hover:bg-[var(--surface-2)]">
                    {t('portfolio.buildSimilar')}
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
