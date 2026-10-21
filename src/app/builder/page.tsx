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
import { 
  Package, Palette, FileText, Zap, PenLine, Check, 
  ArrowLeft, ArrowRight, Loader2, Sparkles, LayoutTemplate, 
  Smartphone, Monitor, ShieldCheck 
} from 'lucide-react';

const designOptions = [
  { id: 'Minimal', label: 'Minimal', icon: Monitor },
  { id: 'Premium', label: 'Premium', icon: Sparkles },
  { id: 'Dark', label: 'Dark', icon: ShieldCheck },
  { id: 'Glass', label: 'Glass', icon: LayoutTemplate },
  { id: 'Futuristic', label: 'Futuristic', icon: Zap },
  { id: 'Corporate', label: 'Corporate', icon: Smartphone },
];

const templateOptions = ['Business', 'Restaurant', 'Auto Service', 'Fitness', 'Portfolio', 'E-commerce', 'Landing'];

const commonPages = [
  { name: 'Home', price: 0 }, { name: 'About', price: 500 }, { name: 'Services', price: 700 },
  { name: 'Contact', price: 0 }, { name: 'Gallery', price: 600 }, { name: 'Blog', price: 900 },
  { name: 'FAQ', price: 400 }, { name: 'Catalog', price: 1200 }, { name: 'Team', price: 500 },
  { name: 'Pricing', price: 800 }, { name: 'Reviews', price: 500 }, { name: 'Booking', price: 1500 },
  { name: 'Dashboard', price: 2000 }, { name: 'Profile', price: 600 },
];

const steps = [
  { titleKey: 'builder.step.product', title: 'Продукт', icon: Package },
  { titleKey: 'builder.step.style', title: 'Стиль', icon: Palette },
  { titleKey: 'builder.step.pages', title: 'Сторінки', icon: FileText },
  { titleKey: 'builder.step.features', title: 'Фічі', icon: Zap },
  { titleKey: 'builder.step.details', title: 'Деталі', icon: PenLine },
  { titleKey: 'builder.step.review', title: 'Огляд', icon: Check },
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
    if (step === 0 && !selectedProduct) { setError('Будь ласка, оберіть продукт'); return; }
    if (step === 1 && (!template || !design)) { setError('Оберіть шаблон та стиль дизайну'); return; }
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
          <div className="animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.chooseStart')}</h2>
            <p className="text-[var(--text-3)] mb-8">{t('builder.chooseStartDesc')}</p>
            
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="glass-card p-6 h-48 animate-pulse rounded-3xl" />))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {availableProducts.map((p) => {
                  const isSelected = selectedProduct === p.id;
                  return (
                    <button key={p.id} onClick={() => setSelectedProduct(p.id)}
                      className={`text-left rounded-3xl border p-6 transition-all duration-300 relative overflow-hidden group flex flex-col ${
                        isSelected ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-[0_0_30px_rgba(139,92,246,0.15)] ring-1 ring-[var(--accent)]' 
                        : 'glass-card border-[var(--border)] hover:border-[var(--accent)]/50 hover:-translate-y-1'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shadow-lg animate-zoom-in">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                      <div className="text-3xl mb-4 bg-[var(--surface-2)] w-14 h-14 rounded-2xl flex items-center justify-center border border-[var(--border)]">
                        {p.category === 'websites' ? '🌐' : p.category === 'web-apps' ? '⚡' : p.category === 'software' ? '💻' : p.category === 'bots' ? '🤖' : '📦'}
                      </div>
                      <div className="inline-flex text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--accent)] mb-2">{p.category.replace('-', ' ')}</div>
                      <h3 className="text-lg font-bold mb-2 text-[var(--text)]">{tProduct(p.slug, 'title', p.title)}</h3>
                      <p className="text-sm text-[var(--text-3)] mb-6 line-clamp-2 flex-1">{tProduct(p.slug, 'shortDescription', p.shortDescription)}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] w-full mt-auto">
                        <div className="text-base font-bold text-[var(--text)]">{p.startingPrice.toLocaleString('uk-UA')} ₴</div>
                        <div className="text-xs font-medium text-[var(--text-4)] bg-[var(--surface-2)] px-2 py-1 rounded-md">{p.estimatedTime}</div>
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
          <div className="animate-slide-up space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.designStyle')}</h2>
              <p className="text-[var(--text-3)]">{t('builder.designStyleDesc')}</p>
            </div>

            <div className="glass-card rounded-3xl p-6 md:p-8">
              <label className="text-sm font-bold uppercase tracking-wider text-[var(--text)] mb-4 block">1. {t('builder.template')}</label>
              <div className="flex flex-wrap gap-2.5">
                {templateOptions.map((tp) => (
                  <button key={tp} onClick={() => setTemplate(tp)}
                    className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                      template === tp ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_15px_var(--accent)] btn-tactile' 
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)]/50 hover:text-[var(--text)]'
                    }`}
                  >{tp}</button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 md:p-8">
              <label className="text-sm font-bold uppercase tracking-wider text-[var(--text)] mb-4 block">2. {t('builder.design')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {designOptions.map((d) => {
                  const Icon = d.icon;
                  const isSel = design === d.id;
                  return (
                    <button key={d.id} onClick={() => setDesign(d.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-3 ${
                        isSel ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_15px_var(--accent)] btn-tactile' 
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)]/50 hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                      }`}
                    >
                      <Icon size={24} className={isSel ? 'text-white' : 'text-[var(--accent)]'} />
                      <span className="text-sm font-semibold">{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.pagesQ')}</h2>
            <p className="text-[var(--text-3)] mb-8">{t('builder.pagesDesc')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonPages.map((page) => {
                const isSelected = selectedPages.includes(page.name);
                const isRequired = page.name === 'Home';
                return (
                  <button key={page.name} onClick={() => !isRequired && toggleSelection(selectedPages, setSelectedPages, page.name)} disabled={isRequired}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      isSelected ? 'border-[var(--accent)] bg-[var(--accent)]/5 ring-1 ring-[var(--accent)]' 
                      : 'glass-card border-[var(--border)] hover:border-[var(--accent)]/40'
                    } ${isRequired ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--border-strong)] bg-[var(--surface)]'}`}>
                        {isSelected && <Check size={14} strokeWidth={3} className="text-white" />}
                      </div>
                      <span className={`text-sm font-semibold ${isSelected ? 'text-[var(--text)]' : 'text-[var(--text-2)]'}`}>{page.name}</span>
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-md ${isSelected ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--surface-2)] text-[var(--text-4)]'}`}>
                      {page.price === 0 ? 'Free' : `+${page.price} ₴`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.featuresQ')}</h2>
            <p className="text-[var(--text-3)] mb-8">{t('builder.featuresDesc')}</p>
            {featuresLoading ? (<div className="animate-pulse h-32 glass-card rounded-3xl" />) 
            : availableFeatures.length === 0 ? (<div className="glass-card text-center py-12"><p className="text-[var(--text-3)]">{t('builder.noFeatures')}</p></div>) 
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableFeatures.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id!);
                  return (
                    <button key={feature.id} onClick={() => toggleSelection(selectedFeatures, setSelectedFeatures, feature.id!)}
                      className={`text-left p-5 rounded-3xl border transition-all duration-300 ${
                        isSelected ? 'border-[var(--accent)] bg-[var(--accent)]/5 ring-1 ring-[var(--accent)] shadow-[0_0_20px_rgba(139,92,246,0.1)]' 
                        : 'glass-card border-[var(--border)] hover:border-[var(--accent)]/40 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className={`text-base font-bold leading-tight ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}>{feature.name}</h3>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--border-strong)] bg-[var(--surface)]'}`}>
                          {isSelected && <Check size={12} strokeWidth={3} className="text-white" />}
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-3)] mb-4 leading-relaxed line-clamp-2">{feature.description}</p>
                      <div className="flex items-center gap-3 text-xs font-medium">
                        <span className="text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded-md">+{feature.price} ₴</span>
                        <span className="text-[var(--text-4)]">{feature.estimatedTime}</span>
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
          <div className="animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.tellMore')}</h2>
            <p className="text-[var(--text-3)] mb-8">{t('builder.tellMoreDesc')}</p>
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6">
                <label className="text-sm font-bold uppercase tracking-wider mb-3 block text-[var(--text)]">{t('builder.requirements')}</label>
                <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder={t('builder.requirementsPlaceholder')} className="!bg-[var(--surface)] !border-[var(--border)] min-h-[140px] text-base" />
              </div>
              <div className="glass-card rounded-3xl p-6">
                <label className="text-sm font-bold uppercase tracking-wider mb-3 block text-[var(--text)]">{t('builder.references')}</label>
                <Textarea value={references} onChange={(e) => setReferences(e.target.value)} placeholder={t('builder.referencesPlaceholder')} className="!bg-[var(--surface)] !border-[var(--border)] min-h-[140px] text-base" />
                <p className="text-xs text-[var(--text-4)] mt-3">{t('builder.referencesNote')}</p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-slide-up space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">{t('builder.reviewQ')}</h2>
              <p className="text-[var(--text-3)]">{t('builder.reviewDesc')}</p>
            </div>
            
            <div className="glass-card rounded-3xl p-6 md:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-4)] mb-6 pb-4 border-b border-[var(--border)]">Деталі проєкту</div>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Продукт</div><div className="font-semibold text-[var(--text)]">{product ? tProduct(product.slug, 'title', product.title) : '—'}</div></div>
                <div><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Термін</div><div className="font-semibold text-[var(--text)]">{product?.estimatedTime || '—'}</div></div>
                <div><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Шаблон</div><div className="font-semibold text-[var(--text)]">{template}</div></div>
                <div><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Дизайн</div><div className="font-semibold text-[var(--text)]">{design}</div></div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-4)] mb-4">Обрані сторінки ({selectedPages.length})</div>
              <div className="flex flex-wrap gap-2">
                {selectedPages.map((p) => (<span key={p} className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs font-medium text-[var(--text-2)]">{p}</span>))}
              </div>
            </div>

            {selectedFeatures.length > 0 && (
              <div className="glass-card rounded-3xl p-6">
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-4)] mb-4">Додаткові фічі ({selectedFeatures.length})</div>
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.filter((f) => selectedFeatures.includes(f.id!)).map((f) => (
                    <span key={f.id} className="px-3 py-1.5 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-xs font-medium text-[var(--accent)]">{f.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen pb-40 lg:pb-24">
        {/* Заголовок сторінки */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4 text-[var(--text)]">
              {t('builder.title')} <span className="text-gradient-animated">{t('builder.title2')}</span>
            </h1>
            <p className="text-lg text-[var(--text-3)]">{t('builder.subtitle')}</p>
          </div>
        </Reveal>

        {/* Новий Stepper (Капсули) */}
        <div className="mb-12 max-w-5xl mx-auto overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex items-center gap-2 min-w-max px-2">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const active = i === step;
              const done = i < step;
              return (
                <button 
                  key={i} 
                  onClick={() => i <= step && setStep(i)} 
                  disabled={i > step} 
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-full transition-all duration-300 border ${
                    active 
                      ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white border-transparent shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-105 z-10' 
                      : done 
                        ? 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]/50' 
                        : 'bg-[var(--surface)]/50 border-transparent text-[var(--text-4)] opacity-70'
                  } ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    active ? 'bg-white/20' : done ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-[var(--surface-2)]'
                  }`}>
                    {done ? <Check size={14} strokeWidth={3} /> : <Icon size={14} />}
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap pr-1">{s.title}</span>
                  {active && <div className="absolute inset-0 rounded-full animate-pulse bg-white/10 pointer-events-none" />}
                </button>
              );
            })}
          </div>
        </div>

        {error && (<div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-3 animate-slide-up max-w-4xl mx-auto"><span className="text-lg">⚠</span><span>{error}</span></div>)}

        {/* Основна сітка: Контент + Сайдбар */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Ліва частина - Кроки */}
          <div className="lg:col-span-8">
            {renderStep()}
          </div>

          {/* Права частина - Панель підсумку (Sticky для ПК) */}
          <div className="lg:col-span-4 hidden lg:block sticky top-28">
            <div className="glass-card rounded-[2rem] p-8 border-[var(--accent)]/20 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/10 rounded-full blur-[60px]" />
              
              <h3 className="text-lg font-bold text-[var(--text)] mb-6">Ваше замовлення</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-3)]">Базовий продукт</span>
                  <span className="font-semibold text-[var(--text)]">{(product?.startingPrice || 0).toLocaleString('uk-UA')} ₴</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-3)]">Сторінки ({selectedPages.length})</span>
                  <span className="font-semibold text-[var(--text)]">+{pagesPrice.toLocaleString('uk-UA')} ₴</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-3)]">Фічі ({selectedFeatures.length})</span>
                  <span className="font-semibold text-[var(--text)]">+{featuresPrice.toLocaleString('uk-UA')} ₴</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border)] mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-[var(--text)] uppercase tracking-wider mb-1">Разом</span>
                  <span className="text-3xl font-bold text-gradient-animated leading-none">{totalPrice.toLocaleString('uk-UA')} ₴</span>
                </div>
                <p className="text-[10px] text-[var(--text-4)] mt-3 leading-relaxed">Фінальна ціна може відрізнятися в залежності від складності та вимог.</p>
              </div>

              <div className="space-y-3 relative z-10">
                {step < steps.length - 1 ? (
                  <Button onClick={handleNext} className="w-full py-4 text-base rounded-xl shadow-[0_0_20px_var(--accent)] btn-tactile">
                    Продовжити <ArrowRight size={18} className="ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading} className="w-full py-4 text-base rounded-xl shadow-[0_0_20px_var(--accent)] btn-tactile bg-green-500 hover:bg-green-600 border-none">
                    {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Check size={18} className="mr-2" />}
                    {loading ? 'Створення...' : 'Створити проєкт'}
                  </Button>
                )}
                
                {step > 0 && (
                  <Button variant="outline" onClick={handleBack} className="w-full py-3 rounded-xl border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text-2)]">
                    <ArrowLeft size={16} className="mr-2" /> Назад
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Мобільна / Планшетна панель знизу */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-[var(--bg)]/90 backdrop-blur-xl border-t border-[var(--border)] pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
            <div>
              <div className="text-[10px] text-[var(--text-4)] uppercase font-bold tracking-wider mb-0.5">Разом</div>
              <div className="text-xl font-bold text-gradient-animated">{totalPrice.toLocaleString('uk-UA')} ₴</div>
            </div>
            <div className="flex gap-2">
              {step > 0 && (<Button variant="outline" onClick={handleBack} className="px-4 py-3 rounded-xl"><ArrowLeft size={18} /></Button>)}
              {step < steps.length - 1 ? (
                <Button onClick={handleNext} className="px-6 py-3 rounded-xl shadow-[0_0_15px_var(--accent)]">Далі <ArrowRight size={18} className="ml-2" /></Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="px-6 py-3 rounded-xl shadow-[0_0_15px_var(--accent)] bg-green-500 hover:bg-green-600 border-none">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Створити'}
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
