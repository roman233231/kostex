'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { getProductBySlug } from '@/services/product';
import { Product } from '@/types/product';

export default function ProductPage() {
  const { t } = useLanguage();
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container py-16">
          <div className="skeleton skeleton-line" style={{ width: '200px' }} />
          <div className="skeleton mt-6" style={{ height: '60px', maxWidth: '600px' }} />
          <div className="skeleton skeleton-line mt-6" style={{ maxWidth: '400px' }} />
          <div className="skeleton mt-10" style={{ height: '400px' }} />
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Link
          href="/catalog"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors inline-flex items-center gap-1"
        >
          {t('product.back')}
        </Link>

        <Reveal>
          <div className="mt-8 mb-12">
            <Badge>{product.category.replace('-', ' ')}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              {product.title}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4 max-w-3xl">
              {product.description}
            </p>
          </div>
        </Reveal>

        {/* Preview */}
        <Reveal delay={100}>
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[var(--border)] mb-12 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.18) 0%, transparent 70%)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl md:text-8xl font-bold tracking-tight text-[var(--text)]/15 uppercase">
                {product.category.replace('-', ' ')}
              </span>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {product.features && product.features.length > 0 && (
              <Reveal>
                <Card hover={false}>
                  <h2 className="text-2xl font-semibold mb-5">{t('product.features')}</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--purple-bright)] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            )}

            {product.pages && product.pages.length > 0 && (
              <Reveal delay={100}>
                <Card hover={false}>
                  <h2 className="text-2xl font-semibold mb-5">{t('product.pages')}</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.pages.map((page, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text-secondary)]"
                      >
                        {page}
                      </span>
                    ))}
                  </div>
                </Card>
              </Reveal>
            )}

            {product.tags && product.tags.length > 0 && (
              <Reveal delay={200}>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="text-sm text-[var(--text-faint)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-5">
              <Reveal delay={150}>
                <Card hover={false} className="border-[var(--border-purple)]">
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                    {t('product.startingFrom')}
                  </div>
                  <div className="text-4xl font-bold mt-2">
                    {product.startingPrice.toLocaleString('uk-UA')} ₴
                  </div>
                  <div className="text-sm text-[var(--text-muted)] mt-2">
                    {t('product.estimated')}: <strong>{product.estimatedTime}</strong>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-6">
                    <Button href={`/builder?product=${product.slug}`} className="w-full">
                      {t('product.customize')}
                    </Button>
                    {product.demoUrl && (
                      <Button variant="outline" href={product.demoUrl} className="w-full">
                        {t('product.viewDemo')}
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-faint)] mt-4">
                    {t('product.finalNote')}
                  </p>
                </Card>
              </Reveal>

              <Reveal delay={200}>
                <Card hover={false}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-3">
                    {t('product.needCustom')}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">
                    {t('product.needCustomDesc')}
                  </p>
                  <Button variant="outline" href="/contact" className="w-full">
                    {t('product.contactUs')}
                  </Button>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}