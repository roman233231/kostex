'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
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
import { Package, Palette, FileText, Zap, PenLine, Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const designOptions = ['Minimal', 'Premium', 'Dark', 'Glass', 'Futuristic', 'Corporate'];
const templateOptions = ['Business', 'Restaurant', 'Auto Service', 'Fitness', 'Portfolio', 'E-commerce', 'Landing'];

const commonPages = [
  { name: 'Home', price: 0 }, { name: 'About', price: 500 }, { name: 'Services', price: 700 },
  { name: 'Contact', price: 0 }, { name: 'Gallery', price: 600 }, { name: 'Blog', price: 900 },
  { name: 'FAQ', price: 400 }, { name: 'Catalog', price: 1200 }, { name: 'Team', price: 500 },
  { name: 'Pricing', price: 800 }, { name: 'Reviews', price: 500 }, { name: 'Booking', price: 1500 },
  { name: 'Dashboard', price: 2000 }, { name: 'Profile', price: 600 },
];

const steps = [
  { titleKey: 'builder.step.product', icon: Package, color1: '#8B5CF6', color2: '#A855F7' },
  { titleKey: 'builder.step.style', icon: Palette, color1: '#3B82F6', color2: '#06B6D4' },
  { titleKey: 'builder.step.pages', icon: FileText, color1: '#EC4899', color2: '#F43F5E' },
  { titleKey: 'builder.step.features', icon: Zap, color1: '#10B981', color2: '#14B8A6' },
  { titleKey: 'builder.step.details', icon: PenLine, color1: '#F59E0B', color2: '#F97316' },
  { titleKey: 'builder.step.review', icon: Check, color1: '#D946EF', color2: '#A855F7' },
] as const;

export default function BuilderPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { t, tProduct } = useLanguage();

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
      try { const data = await getPublishedProducts(); setAvailableProducts(data); } 
      catch (err) { console.error(err); } finally { setProductsLoading(false); }
    };
    const fetchFeatures = async () => {
      try { const data = await getActiveFeatures(); setAvailableFeatures(data); } 
      catch (err) { console.error(err); } finally { setFeaturesLoading(false); }
    };
    fetchProducts(); fetchFeatures();
  }, []);

  const product = availableProducts.find((p) => p.id === selectedProduct);

  const pagesPrice = selectedPages.reduce((sum, pageName) => {
    const p = commonPages.find((cp) => cp.name === pageName); return sum + (p?.price || 0);
  }, 0);

  const featuresPrice = selectedFeatures.reduce((sum, featureId) => {
    const feature = availableFeatures.find((f) => f.id === featureId); return sum + (feature?.price || 0);
  }, 0);

  const totalPrice = (product?.startingPrice || 0) + pagesPrice + featuresPrice;

  const toggleSelection = (list: string[], setList: (val: string[]) => void, value: string) => {
    if (list.includes(value)) { setList(list.filter((v) => v !== value)); } 
    else { setList([...list, value]); }
  };

  const handleNext = () => {
    if (step === 0 && !selectedProduct) { setError(t('builder.chooseStartDesc')); return; }
    if (step === 1 && (!template || !design)) { setError(t('builder.designStyleDesc')); return; }
    setError(''); setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => { setError(''); setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSubmit = async () => {
    if (!currentUser) { router.push('/login'); return; }
    setLoading(true); setError('');
    try {
      const featureNames = availableFeatures.filter((f) => selectedFeatures.includes(f.id!)).map((f) => f.name);
      const orderId = await createOrder({
        userId: currentUser.uid, productId: selectedProduct,
        productTitle: product ? tProduct(product.slug, 'title', product.title) : undefined,
        template, design, pages: selectedPages, features: featureNames, requirements,
        references: references ? references.split('\n').filter((r) => r.trim()) : [],
        estimatedPrice: totalPrice, estimatedTime: product?.estimatedTime || 'TBD', status: 'NEW',
      });
      await notifyAllAdmins('New order received', `New order: ${product?.title || 'Project'}`, `/admin/orders/${orderId}`);
      router.push('/account/orders');
    } catch (err: any) {
      console.error(err); setError(err.message || 'Failed to create order');
    } finally { setLoading(false); }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.chooseStart')}</h2>
            <p className="text-sm md:text-lg text-[var(--text-3)] mb-8">{t('builder.chooseStartDesc')}</p>
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="glass-card p-5 h-40 animate-pulse" />))}
              </div>
            ) : availableProducts.length === 0 ? (
              <div className="glass-card text-center py-12"><p className="text-[var(--text-3)]">{t('builder.noProducts')}</p></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {availableProducts.map((p) => {
                  const isSelected = selectedProduct === p.id;
                  return (
                    <button key={p.id} onClick={() => setSelectedProduct(p.id)}
                      className={`text-left rounded-3xl border p-6 transition-all duration-300 relative overflow-hidden group ${
                        isSelected ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_30px_rgba(139,92,246,0.2)]' 
                        : 'glass-card border-[var(--border)] hover:border-[var(--accent)]/50 hover:-translate-y-1'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-white shadow-lg animate-zoom-in">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      )}
                      <div className="text-4xl mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6">
                        {p.category === 'websites' ? '🌐' : p.category === 'web-apps' ? '⚡' : p.category === 'software' ? '💻' : p.category === 'bots' ? '🤖' : '📦'}
                      </div>
                      <div className="inline-flex text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--accent)] mb-2 bg-[var(--accent)]/10 px-2 py-1 rounded-md">{p.category.replace('-', ' ')}</div>
                      <h3 className="text-xl font-bold mb-2 text-[var(--text)]">{tProduct(p.slug, 'title', p.title)}</h3>
                      <p className="text-sm text-[var(--text-3)] mb-6 line-clamp-2">{tProduct(p.slug, 'shortDescription', p.shortDescription)}</p>
                      <div className="flex items-end justify-between pt-4 border-t border-[var(--border)]">
                        <div><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider">{t('common.from')}</div><div className="text-lg font-bold text-[var(--accent)]">{p.startingPrice.toLocaleString('uk-UA')} ₴</div></div>
                        <div className="text-right"><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider">{t('common.estimated')}</div><div className="text-sm font-medium text-[var(--text)]">{p.estimatedTime}</div></div>
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
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.designStyle')}</h2>
              <p className="text-sm md:text-lg text-[var(--text-3)] mb-6">{t('builder.designStyleDesc')}</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-5"><div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)] flex items-center justify-center text-sm font-bold text-[var(--accent)]">1</div><label className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">{t('builder.template')}</label></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {templateOptions.map((tp) => (
                  <button key={tp} onClick={() => setTemplate(tp)}
                    className={`px-4 py-4 rounded-2xl border text-sm font-semibold transition-all duration-300 ${
                      template === tp ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_20px_var(--accent)] btn-tactile' 
                      : 'glass-card border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)]/50 hover:text-[var(--text)]'
                    }`}
                  >{tp}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-5"><div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)] flex items-center justify-center text-sm font-bold text-[var(--accent)]">2</div><label className="text-sm font-bold uppercase tracking-wider text-[var(--text)]">{t('builder.design')}</label></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {designOptions.map((d) => (
                  <button key={d} onClick={() => setDesign(d)}
                    className={`px-4 py-4 rounded-2xl border text-sm font-semibold transition-all duration-300 ${
                      design === d ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_20px_var(--accent)] btn-tactile' 
                      : 'glass-card border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)]/50 hover:text-[var(--text)]'
                    }`}
                  >{d}</button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.pagesQ')}</h2>
            <p className="text-sm md:text-lg text-[var(--text-3)] mb-8">{t('builder.pagesDesc')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {commonPages.map((page) => {
                const isSelected = selectedPages.includes(page.name);
                const isRequired = page.name === 'Home';
                return (
                  <button key={page.name} onClick={() => !isRequired && toggleSelection(selectedPages, setSelectedPages, page.name)} disabled={isRequired}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                      isSelected ? 'border-[var(--accent)] bg-[var(--accent)]/10' 
                      : 'glass-card border-[var(--border)] hover:border-[var(--accent)]/40'
                    } ${isRequired ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer btn-tactile'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--border-strong)] bg-[var(--surface)]'}`}>
                        {isSelected && <Check size={14} strokeWidth={3} className="text-white" />}
                      </div>
                      <span className={`text-sm font-semibold ${isSelected ? 'text-[var(--text)]' : 'text-[var(--text-2)]'}`}>{page.name}</span>
                    </div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-4)]'}`}>
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
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.featuresQ')}</h2>
            <p className="text-sm md:text-lg text-[var(--text-3)] mb-8">{t('builder.featuresDesc')}</p>
            {featuresLoading ? (<p className="text-[var(--text-3)]">{t('builder.loadingFeatures')}</p>) 
            : availableFeatures.length === 0 ? (<div className="glass-card text-center py-12"><p className="text-[var(--text-3)]">{t('builder.noFeatures')}</p></div>) 
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableFeatures.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id!);
                  return (
                    <button key={feature.id} onClick={() => toggleSelection(selectedFeatures, setSelectedFeatures, feature.id!)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                        isSelected ? 'border-[var(--accent)] bg-[var(--accent)]/10' 
                        : 'glass-card border-[var(--border)] hover:border-[var(--accent)]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className={`text-base font-bold leading-tight ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}>{feature.name}</h3>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--border-strong)] bg-[var(--surface)]'}`}>
                          {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-3)] mb-4 leading-relaxed">{feature.description}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-bold text-[var(--accent)]">+{feature.price} ₴</span>
                        <span className="text-[var(--text-4)]">·</span>
                        <span className="text-[var(--text-3)]">{feature.estimatedTime}</span>
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
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.tellMore')}</h2>
            <p className="text-sm md:text-lg text-[var(--text-3)] mb-8">{t('builder.tellMoreDesc')}</p>
            <div className="space-y-8">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider mb-3 block text-[var(--text)]">{t('builder.requirements')}</label>
                <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder={t('builder.requirementsPlaceholder')} className="!bg-[var(--surface)] !border-[var(--border)] min-h-[120px]" />
              </div>
              <div>
                <label className="text-sm font-bold uppercase tracking-wider mb-3 block text-[var(--text)]">{t('builder.references')}</label>
                <Textarea value={references} onChange={(e) => setReferences(e.target.value)} placeholder={t('builder.referencesPlaceholder')} className="!bg-[var(--surface)] !border-[var(--border)] min-h-[120px]" />
                <p className="text-xs text-[var(--text-4)] mt-2">{t('builder.referencesNote')}</p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.reviewQ')}</h2>
            <p className="text-sm md:text-lg text-[var(--text-3)] mb-8">{t('builder.reviewDesc')}</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                <div className="glass-card rounded-3xl p-6">
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-4)] mb-5">{t('builder.projectSummary')}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <ReviewRow label={t('builder.step.product')} value={product ? tProduct(product.slug, 'title', product.title) : '—'} />
                    <ReviewRow label={t('builder.template')} value={template || '—'} />
                    <ReviewRow label={t('builder.design')} value={design || '—'} />
                    <ReviewRow label={t('common.estimated')} value={product?.estimatedTime || '—'} />
                  </div>
                </div>
                <div className="glass-card rounded-3xl p-6">
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-4)] mb-4">{t('builder.step.pages')} ({selectedPages.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPages.map((p) => (<span key={p} className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs font-medium text-[var(--text-2)]">{p}</span>))}
                  </div>
                </div>
                {selectedFeatures.length > 0 && (
                  <div className="glass-card rounded-3xl p-6">
                    <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-4)] mb-4">{t('builder.step.features')} ({selectedFeatures.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {availableFeatures.filter((f) => selectedFeatures.includes(f.id!)).map((f) => (
                        <span key={f.id} className="px-3 py-1.5 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-xs font-medium text-[var(--accent)]">{f.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:col-span-1">
                <div className="glass-card rounded-3xl p-8 lg:sticky lg:top-24 border-[var(--accent)]/30 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-4)] mb-6">{t('builder.totalEstimate')}</div>
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between text-[var(--text-3)]"><span>{t('builder.baseProduct')}</span><span className="font-medium text-[var(--text)]">{(product?.startingPrice || 0).toLocaleString('uk-UA')} ₴</span></div>
                    <div className="flex justify-between text-[var(--text-3)]"><span>{t('builder.step.pages')} ({selectedPages.length})</span><span className="font-medium text-[var(--text)]">+{pagesPrice.toLocaleString('uk-UA')} ₴</span></div>
                    <div className="flex justify-between text-[var(--text-3)]"><span>{t('builder.step.features')} ({selectedFeatures.length})</span><span className="font-medium text-[var(--text)]">+{featuresPrice.toLocaleString('uk-UA')} ₴</span></div>
                  </div>
                  <div className="pt-6 border-t border-[var(--border)]">
                    <div className="text-[10px] text-[var(--text-4)] uppercase tracking-widest mb-1 font-bold">{t('builder.total')}</div>
                    <div className="text-4xl font-bold text-gradient-animated mb-3">{totalPrice.toLocaleString('uk-UA')} ₴</div>
                    <p className="text-xs text-[var(--text-4)] leading-relaxed">{t('product.finalNote')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const progressPercent = ((step + 1) / steps.length) * 100;
  const currentStep = steps[step];
  const CurrentIcon = currentStep.icon;

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 pb-40 md:pb-32 min-h-screen">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${currentStep.color1}, ${currentStep.color2})`, boxShadow: `0 8px 24px -8px ${currentStep.color1}88` }}>
                <CurrentIcon size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--accent)]">Крок {step + 1} з {steps.length}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-4 text-[var(--text)]">
              {t('builder.title')} <span className="text-gradient-animated">{t('builder.title2')}</span>
            </h1>
            <p className="text-lg text-[var(--text-3)]">{t('builder.subtitle')}</p>
          </div>
        </Reveal>

        {/* Desktop Progress */}
        <div className="hidden md:block mb-16 max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute top-6 left-0 right-0 h-1 bg-[var(--surface-2)] rounded-full" />
            <div className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            <div className="relative grid grid-cols-6 gap-4">
              {steps.map((s, i) => {
                const Icon = s.icon; const active = i === step; const done = i < step;
                return (
                  <button key={s.titleKey} onClick={() => i <= step && setStep(i)} disabled={i > step} className={`flex flex-col items-center ${i <= step ? 'cursor-pointer group' : 'cursor-default'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${active ? 'text-white shadow-[0_0_30px_var(--accent)] scale-110' : done ? 'text-white' : 'bg-[var(--surface)] text-[var(--text-4)] border border-[var(--border)]'}`} style={active || done ? { background: `linear-gradient(135deg, ${s.color1}, ${s.color2})` } : {}}>
                      {done ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                    </div>
                    <div className={`mt-4 text-xs font-bold uppercase tracking-wider text-center transition-colors ${active ? 'text-[var(--text)]' : done ? 'text-[var(--text-2)]' : 'text-[var(--text-4)]'}`}>{t(s.titleKey)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Progress */}
        <div className="md:hidden mb-8 glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">{step + 1} / {steps.length}</span>
            <span className="text-xs font-medium text-[var(--text-3)]">{t(currentStep.titleKey)}</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%`, background: `linear-gradient(90deg, ${currentStep.color1}, ${currentStep.color2})` }} />
          </div>
        </div>

        {error && (<div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-start gap-3 animate-slide-up"><span className="text-lg leading-none">⚠</span><span>{error}</span></div>)}

        <div key={step} className="mb-12 animate-slide-up">{renderStep()}</div>

        {/* Sticky Bottom Bar */}
        <div className="fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:left-auto md:right-auto z-40 px-4 pb-4 md:px-0 md:pb-0 pointer-events-none">
          <div className="container max-w-4xl pointer-events-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:p-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between gap-6 w-full sm:w-auto">
                <div>
                  <div className="text-[10px] text-[var(--text-4)] uppercase tracking-widest font-bold mb-1">{t('builder.total')}</div>
                  <div className="text-2xl font-bold text-gradient-animated leading-none">{totalPrice.toLocaleString('uk-UA')} ₴</div>
                </div>
                <div className="w-px h-10 bg-[var(--border)]" />
                <div>
                  <div className="text-[10px] text-[var(--text-4)] uppercase tracking-widest font-bold mb-1">Крок</div>
                  <div className="text-sm font-bold text-[var(--text)]">{step + 1} <span className="text-[var(--text-4)]">/ {steps.length}</span></div>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                {step > 0 && (<Button variant="outline" onClick={handleBack} className="flex-1 sm:flex-none btn-tactile rounded-xl px-6"><ArrowLeft size={18} /><span className="hidden md:inline ml-2">{t('common.back')}</span></Button>)}
                {step < steps.length - 1 ? (
                  <Button onClick={handleNext} className="flex-1 sm:flex-none btn-tactile rounded-xl px-8 shadow-[0_0_20px_var(--accent)]">{t('common.continue')} <ArrowRight size={18} className="ml-2" /></Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading} className="flex-1 sm:flex-none btn-tactile rounded-xl px-8 shadow-[0_0_20px_var(--accent)]">{loading ? (<><Loader2 size={18} className="animate-spin mr-2" />{t('common.loading')}</>) : (<><Check size={18} className="mr-2" />{t('common.create')}</>)}</Button>
                )}
              </div>
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
      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-4)] mb-1">{label}</div>
      <div className="text-sm font-semibold text-[var(--text)]">{value}</div>
    </div>
  );
}
