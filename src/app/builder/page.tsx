'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Textarea from '@/components/ui/Textarea';
import Reveal from '@/components/ui/Reveal';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { createOrder } from '@/services/order';
import { getPublishedProducts } from '@/services/product';
import { getActiveFeatures } from '@/services/feature';
import { notifyAllAdmins } from '@/services/notification';
import { Product } from '@/types/product';
import { Feature } from '@/types/feature';
import { TranslationKey } from '@/lib/translations';

const designOptions = ['Minimal', 'Premium', 'Dark', 'Glass', 'Futuristic', 'Corporate'];
const templateOptions = ['Business', 'Restaurant', 'Auto Service', 'Fitness', 'Portfolio', 'E-commerce', 'Landing'];

const commonPages = [
  { name: 'Home', price: 0 },
  { name: 'About', price: 500 },
  { name: 'Services', price: 700 },
  { name: 'Contact', price: 0 },
  { name: 'Gallery', price: 600 },
  { name: 'Blog', price: 900 },
  { name: 'FAQ', price: 400 },
  { name: 'Catalog', price: 1200 },
  { name: 'Team', price: 500 },
  { name: 'Pricing', price: 800 },
  { name: 'Reviews', price: 500 },
  { name: 'Booking', price: 1500 },
  { name: 'Dashboard', price: 2000 },
  { name: 'Profile', price: 600 },
];

const steps: { titleKey: TranslationKey; icon: string }[] = [
  { titleKey: 'builder.step.product', icon: '📦' },
  { titleKey: 'builder.step.style', icon: '🎨' },
  { titleKey: 'builder.step.pages', icon: '📄' },
  { titleKey: 'builder.step.features', icon: '⚡' },
  { titleKey: 'builder.step.details', icon: '✍️' },
  { titleKey: 'builder.step.review', icon: '✓' },
];

export default function BuilderPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [template, setTemplate] = useState('');
  const [design, setDesign] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>(['Home']);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [requirements, setRequirements] = useState('');
  const [references, setReferences] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getPublishedProducts();
        setAvailableProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setProductsLoading(false);
      }
    };
    const fetchFeatures = async () => {
      try {
        const data = await getActiveFeatures();
        setAvailableFeatures(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFeaturesLoading(false);
      }
    };
    fetchProducts();
    fetchFeatures();
  }, []);

  const product = availableProducts.find((p) => p.id === selectedProduct);

  const pagesPrice = selectedPages.reduce((sum, pageName) => {
    const p = commonPages.find((cp) => cp.name === pageName);
    return sum + (p?.price || 0);
  }, 0);

  const featuresPrice = selectedFeatures.reduce((sum, featureId) => {
    const feature = availableFeatures.find((f) => f.id === featureId);
    return sum + (feature?.price || 0);
  }, 0);

  const totalPrice = (product?.startingPrice || 0) + pagesPrice + featuresPrice;

  const toggleSelection = (list: string[], setList: (val: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleNext = () => {
    if (step === 0 && !selectedProduct) {
      setError(t('builder.chooseStartDesc'));
      return;
    }
    if (step === 1 && (!template || !design)) {
      setError(t('builder.designStyleDesc'));
      return;
    }
    setError('');
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const featureNames = availableFeatures
        .filter((f) => selectedFeatures.includes(f.id!))
        .map((f) => f.name);

      const orderId = await createOrder({
        userId: currentUser.uid,
        productId: selectedProduct,
        productTitle: product?.title,
        template,
        design,
        pages: selectedPages,
        features: featureNames,
        requirements,
        references: references ? references.split('\n').filter((r) => r.trim()) : [],
        estimatedPrice: totalPrice,
        estimatedTime: product?.estimatedTime || 'TBD',
        status: 'NEW',
      });

      await notifyAllAdmins(
        'New order received',
        `New order: ${product?.title || 'Project'}`,
        `/admin/orders/${orderId}`
      );

      router.push('/account/orders');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {t('builder.chooseStart')}
            </h2>
            <p className="text-[var(--text-muted)] mb-8 text-lg">{t('builder.chooseStartDesc')}</p>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton-card p-6">
                    <div className="skeleton" style={{ height: '60px', width: '60px', borderRadius: '12px' }} />
                    <div className="skeleton skeleton-line mt-4" style={{ width: '40%' }} />
                    <div className="skeleton skeleton-line" style={{ width: '90%' }} />
                  </div>
                ))}
              </div>
            ) : availableProducts.length === 0 ? (
              <Card hover={false} className="text-center py-16">
                <p className="text-[var(--text-muted)]">{t('builder.noProducts')}</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableProducts.map((p) => {
                  const isSelected = selectedProduct === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p.id)}
                      className={`text-left rounded-2xl border p-6 transition-all duration-300 relative overflow-hidden group ${
                        isSelected
                          ? 'border-[var(--purple)] bg-gradient-to-br from-[var(--purple)]/[0.08] to-transparent shadow-[0_0_0_4px_rgba(139,92,246,0.1)]'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--purple)]/40 hover:-translate-y-0.5'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] flex items-center justify-center text-white text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.6)]">
                          ✓
                        </div>
                      )}

                      <div className="text-4xl mb-4 transition-transform group-hover:scale-110">
                        {p.category === 'websites' ? '🌐' :
                         p.category === 'web-apps' ? '⚡' :
                         p.category === 'software' ? '💻' :
                         p.category === 'bots' ? '🤖' : '📦'}
                      </div>

                      <div className="inline-flex text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--purple-bright)] mb-2">
                        {p.category.replace('-', ' ')}
                      </div>

                      <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                      <p className="text-sm text-[var(--text-muted)] mb-5 line-clamp-2 leading-relaxed">
                        {p.shortDescription}
                      </p>

                      <div className="flex items-end justify-between pt-4 border-t border-[var(--border)]">
                        <div>
                          <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-0.5">
                            {t('common.from')}
                          </div>
                          <div className="text-lg font-bold gradient-text">
                            {p.startingPrice.toLocaleString('uk-UA')} ₴
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-0.5">
                            {t('common.estimated')}
                          </div>
                          <div className="text-sm font-medium">{p.estimatedTime}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                {t('builder.designStyle')}
              </h2>
              <p className="text-[var(--text-muted)] text-lg mb-8">{t('builder.designStyleDesc')}</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--purple)]/15 border border-[var(--border-purple)] flex items-center justify-center text-sm font-bold text-[var(--purple-bright)]">
                  1
                </div>
                <label className="text-sm font-semibold uppercase tracking-wider">{t('builder.template')}</label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {templateOptions.map((tp) => (
                  <button
                    key={tp}
                    onClick={() => setTemplate(tp)}
                    className={`px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                      template === tp
                        ? 'bg-[var(--purple)] text-white border-[var(--purple)] shadow-[0_0_24px_rgba(139,92,246,0.4)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface)] hover:border-[var(--purple)]/40 hover:-translate-y-0.5'
                    }`}
                  >
                    {tp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--purple)]/15 border border-[var(--border-purple)] flex items-center justify-center text-sm font-bold text-[var(--purple-bright)]">
                  2
                </div>
                <label className="text-sm font-semibold uppercase tracking-wider">{t('builder.design')}</label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {designOptions.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDesign(d)}
                    className={`px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                      design === d
                        ? 'bg-[var(--purple)] text-white border-[var(--purple)] shadow-[0_0_24px_rgba(139,92,246,0.4)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface)] hover:border-[var(--purple)]/40 hover:-translate-y-0.5'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t('builder.pagesQ')}</h2>
            <p className="text-[var(--text-muted)] text-lg mb-8">{t('builder.pagesDesc')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {commonPages.map((page) => {
                const isSelected = selectedPages.includes(page.name);
                const isRequired = page.name === 'Home';
                return (
                  <button
                    key={page.name}
                    onClick={() => !isRequired && toggleSelection(selectedPages, setSelectedPages, page.name)}
                    disabled={isRequired}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[var(--purple)] bg-[var(--purple)]/[0.06] shadow-[0_0_0_4px_rgba(139,92,246,0.08)]'
                        : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--purple)]/40'
                    } ${isRequired ? 'opacity-90 cursor-default' : 'cursor-pointer hover:-translate-y-0.5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[var(--purple)] border-[var(--purple)]'
                            : 'border-[var(--border-strong)]'
                        }`}
                      >
                        {isSelected && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[15px] font-semibold">{page.name}</span>
                    </div>
                    <div className="text-xs font-medium text-[var(--text-muted)]">
                      {page.price === 0 ? t('builder.free') : `+${page.price} ₴`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t('builder.featuresQ')}</h2>
            <p className="text-[var(--text-muted)] text-lg mb-8">{t('builder.featuresDesc')}</p>

            {featuresLoading ? (
              <p className="text-[var(--text-muted)]">{t('builder.loadingFeatures')}</p>
            ) : availableFeatures.length === 0 ? (
              <Card hover={false} className="text-center py-16">
                <p className="text-[var(--text-muted)]">{t('builder.noFeatures')}</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableFeatures.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id!);
                  return (
                    <button
                      key={feature.id}
                      onClick={() => toggleSelection(selectedFeatures, setSelectedFeatures, feature.id!)}
                      className={`text-left p-5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-[var(--purple)] bg-[var(--purple)]/[0.06] shadow-[0_0_0_4px_rgba(139,92,246,0.08)]'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--purple)]/40 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base font-semibold leading-tight">{feature.name}</h3>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? 'bg-[var(--purple)] border-[var(--purple)]'
                              : 'border-[var(--border-strong)]'
                          }`}
                        >
                          {isSelected && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-[var(--purple-bright)] text-sm">
                          +{feature.price} ₴
                        </span>
                        <span className="text-[var(--text-faint)]">·</span>
                        <span className="text-[var(--text-muted)]">{feature.estimatedTime}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t('builder.tellMore')}</h2>
            <p className="text-[var(--text-muted)] text-lg mb-8">{t('builder.tellMoreDesc')}</p>

            <div className="space-y-7">
              <div>
                <label className="text-sm font-semibold uppercase tracking-wider mb-3 block">
                  {t('builder.requirements')}
                </label>
                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder={t('builder.requirementsPlaceholder')}
                />
              </div>

              <div>
                <label className="text-sm font-semibold uppercase tracking-wider mb-3 block">
                  {t('builder.references')}
                </label>
                <Textarea
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  placeholder={t('builder.referencesPlaceholder')}
                />
                <p className="text-xs text-[var(--text-faint)] mt-2">
                  {t('builder.referencesNote')}
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t('builder.reviewQ')}</h2>
            <p className="text-[var(--text-muted)] text-lg mb-8">{t('builder.reviewDesc')}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card hover={false}>
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-5">
                    {t('builder.projectSummary')}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    <ReviewRow label={t('builder.step.product')} value={product?.title || '—'} />
                    <ReviewRow label={t('builder.template')} value={template || '—'} />
                    <ReviewRow label={t('builder.design')} value={design || '—'} />
                    <ReviewRow label={t('common.estimated')} value={product?.estimatedTime || '—'} />
                  </div>
                </Card>

                <Card hover={false}>
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-5">
                    {t('builder.step.pages')} ({selectedPages.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPages.map((p) => (
                      <span
                        key={p}
                        className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-secondary)]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </Card>

                {selectedFeatures.length > 0 && (
                  <Card hover={false}>
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-5">
                      {t('builder.step.features')} ({selectedFeatures.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableFeatures
                        .filter((f) => selectedFeatures.includes(f.id!))
                        .map((f) => (
                          <span
                            key={f.id}
                            className="px-3 py-1.5 rounded-lg bg-[var(--purple-soft)] border border-[var(--border-purple)] text-xs text-[var(--purple-bright)] font-medium"
                          >
                            {f.name}
                          </span>
                        ))}
                    </div>
                  </Card>
                )}

                {requirements && (
                  <Card hover={false}>
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-4">
                      {t('builder.requirements')}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                      {requirements}
                    </p>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-1">
                <Card hover={false} className="border-[var(--border-purple)] bg-gradient-to-b from-[var(--purple)]/[0.06] to-transparent sticky top-24">
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-5">
                    {t('builder.totalEstimate')}
                  </div>

                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>{t('builder.baseProduct')}</span>
                      <span>{(product?.startingPrice || 0).toLocaleString('uk-UA')} ₴</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>{t('builder.step.pages')} ({selectedPages.length})</span>
                      <span>+{pagesPrice.toLocaleString('uk-UA')} ₴</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>{t('builder.step.features')} ({selectedFeatures.length})</span>
                      <span>+{featuresPrice.toLocaleString('uk-UA')} ₴</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--border)]">
                    <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-1">
                      {t('builder.total')}
                    </div>
                    <div className="text-4xl font-bold gradient-text mb-2">
                      {totalPrice.toLocaleString('uk-UA')} ₴
                    </div>
                    <p className="text-xs text-[var(--text-faint)] leading-relaxed">
                      {t('product.finalNote')}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercent = ((step + 1) / steps.length) * 100;

  return (
    <>
      <Navbar />
      <main className="container py-12 md:py-16">
        <Reveal>
          <div className="max-w-3xl mb-12">
            <Badge>{t('builder.step.product')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-5 tracking-tight leading-[1.05]">
              {t('builder.title')}{' '}
              <span className="gradient-text">{t('builder.title2')}</span>
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4">{t('builder.subtitle')}</p>
          </div>
        </Reveal>

        <div className="hidden md:block mb-12">
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-px bg-[var(--border)]" />
            <div
              className="absolute top-5 left-0 h-px bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
            <div className="relative grid grid-cols-6 gap-4">
              {steps.map((s, i) => {
                const active = i === step;
                const done = i < step;
                return (
                  <button
                    key={s.titleKey}
                    onClick={() => i <= step && setStep(i)}
                    disabled={i > step}
                    className={`flex flex-col items-center text-center ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        active
                          ? 'bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-white shadow-[0_0_24px_rgba(139,92,246,0.5)] scale-110'
                          : done
                          ? 'bg-[var(--purple)]/20 text-[var(--purple-bright)] border border-[var(--border-purple)]'
                          : 'bg-[var(--surface)] text-[var(--text-faint)] border border-[var(--border)]'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </div>
                    <div
                      className={`mt-3 text-xs font-semibold ${
                        active
                          ? 'text-[var(--text)]'
                          : done
                          ? 'text-[var(--text-secondary)]'
                          : 'text-[var(--text-faint)]'
                      }`}
                    >
                      {t(s.titleKey)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:hidden mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--purple-bright)] uppercase tracking-wider">
              {step + 1} / {steps.length}
            </span>
            <span className="text-xs text-[var(--text-muted)]">{t(steps[step].titleKey)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
            <span className="text-lg leading-none">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <div key={step} className="mb-12" style={{ animation: 'fadeUp 0.5s ease' }}>
          {renderStep()}
        </div>

        <div className="sticky bottom-4 z-30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)]/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <div>
                <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
                  {t('builder.total')}
                </div>
                <div className="text-xl font-bold gradient-text">
                  {totalPrice.toLocaleString('uk-UA')} ₴
                </div>
              </div>
              <div className="w-px h-10 bg-[var(--border)]" />
              <div>
                <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
                  {t('builder.step.review')}
                </div>
                <div className="text-sm font-semibold">
                  {step + 1} / {steps.length}
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {step > 0 && (
                <Button variant="outline" onClick={handleBack} className="flex-1 sm:flex-none">
                  ← {t('common.back')}
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button onClick={handleNext} className="flex-1 sm:flex-none">
                  {t('common.continue')} →
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="flex-1 sm:flex-none">
                  {loading ? t('common.loading') : t('common.create')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-1">
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}