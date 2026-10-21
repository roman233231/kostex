'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { getProductBySlug } from '@/services/product';
import { Product } from '@/types/product';
import { ArrowLeft, Check, Sparkles, LayoutTemplate } from 'lucide-react';

export default function ProductPage() {
  const { t, tProduct } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
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

  if (!product) notFound();

  const title = tProduct(product.slug, 'title', product.title);
  const description = tProduct(product.slug, 'description', product.description);

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen pb-32">
        <Reveal>
          <Link href="/catalog" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('product.back')}
          </Link>
        </Reveal>

        <Reveal delay={50}>
          <div className="mb-12 max-w-4xl">
            <Badge className="mb-4">{product.category.replace('-', ' ')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-gradient-animated mb-6">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)] leading-relaxed">
              {description}
            </p>
          </div>
        </Reveal>

        {/* Фейкове вікно браузера (Preview) */}
        <Reveal delay={100}>
          <div className="relative w-full aspect-[16/9] max-h-[600px] rounded-[2rem] overflow-hidden border border-[var(--border)] bg-[var(--surface)] mb-16 shadow-[0_20px_80px_-20px_rgba(139,92,246,0.15)] group">
            <div className="absolute top-0 w-full h-10 bg-[var(--surface-2)] flex items-center px-4 gap-2 border-b border-[var(--border)] z-20">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            <div className="absolute inset-0 pt-10 bg-[var(--bg)] overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                <LayoutTemplate size={64} className="text-[var(--accent)] mb-4 opacity-50" />
                <span className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text)]/20 uppercase">
                  {product.category.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Ліва частина: Фічі */}
          <div className="lg:col-span-2 space-y-6">
            {product.features && product.features.length > 0 && (
              <Reveal>
                <div className="glass-card rounded-3xl p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Sparkles className="text-[var(--accent)]" /> {t('product.features')}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.features.map((f, i) => (
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

            {product.pages && product.pages.length > 0 && (
              <Reveal delay={100}>
                <div className="glass-card rounded-3xl p-8">
                  <h2 className="text-2xl font-bold mb-6">{t('product.pages')}</h2>
                  <div className="flex flex-wrap gap-2.5">
                    {product.pages.map((page, i) => (
                      <span key={i} className="px-4 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium text-[var(--text-2)]">
                        {page}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {product.tags && product.tags.length > 0 && (
              <Reveal delay={200}>
                <div className="flex flex-wrap gap-3">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="text-sm font-medium text-[var(--text-4)] bg-[var(--surface)] px-3 py-1 rounded-md border border-[var(--border)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Права частина: Ціна (Sticky) */}
          <div className="lg:col-span-1 sticky top-28">
            <Reveal delay={150}>
              <div className="glass-card rounded-[2rem] p-8 border-[var(--accent)]/30 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.2)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent)]/20 rounded-full blur-[60px]" />
                
                <div className="text-xs font-bold text-[var(--text-4)] uppercase tracking-widest mb-2 relative z-10">
                  {t('product.startingFrom')}
                </div>
                <div className="text-5xl font-bold text-gradient-animated mb-4 relative z-10">
                  {product.startingPrice.toLocaleString('uk-UA')} ₴
                </div>
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text-3)] mb-8 relative z-10">
                  {t('product.estimated')}: <strong className="text-[var(--text)]">{product.estimatedTime}</strong>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                  <Button href={`/builder?product=${product.slug}`} className="w-full py-4 text-lg rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)]">
                    {t('product.customize')}
                  </Button>
                  {product.demoUrl && (
                    <Button variant="outline" href={product.demoUrl} className="w-full py-4 rounded-xl border-[var(--border)] hover:bg-[var(--surface-2)]">
                      {t('product.viewDemo')}
                    </Button>
                  )}
                </div>

                <p className="text-xs text-[var(--text-4)] mt-6 text-center relative z-10">
                  {t('product.finalNote')}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="glass-card rounded-3xl p-8 mt-6">
                <h3 className="font-bold text-[var(--text)] mb-2">
                  {t('product.needCustom')}
                </h3>
                <p className="text-sm text-[var(--text-3)] mb-5 leading-relaxed">
                  {t('product.needCustomDesc')}
                </p>
                <Button variant="outline" href="/contact" className="w-full rounded-xl">
                  {t('product.contactUs')}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
