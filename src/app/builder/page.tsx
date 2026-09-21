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
import { createOrder } from '@/services/order';
import { getPublishedProducts } from '@/services/product';
import { getActiveFeatures } from '@/services/feature';
import { notifyAllAdmins } from '@/services/notification';
import { Product } from '@/types/product';
import { Feature } from '@/types/feature';

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

const steps = [
  { title: 'Product', icon: '📦' },
  { title: 'Style', icon: '🎨' },
  { title: 'Pages', icon: '📄' },
  { title: 'Features', icon: '⚡' },
  { title: 'Details', icon: '✍️' },
  { title: 'Review', icon: '✓' },
];

export default function BuilderPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

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

  const toggleSelection = (
    list: string[],
    setList: (val: string[]) => void,
    value: string
  ) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleNext = () => {
    if (step === 0 && !selectedProduct) {
      setError('Please select a product to continue.');
      return;
    }
    if (step === 1 && (!template || !design)) {
      setError('Please select both template and design style.');
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
      // ========== STEP 0: PRODUCT ==========
      case 0:
        return (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Choose a starting point
            </h2>
            <p className="text-[var(--text-muted)] mb-8 text-lg">
              Select a base product. You'll customize everything in the next steps.
            </p>

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
                <p className="text-[var(--text-muted)]">No products available yet.</p>
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

                      <h3 className="text-xl font-bold mb-2">
                        {p.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] mb-5 line-clamp-2 leading-relaxed">
                        {p.shortDescription}
                      </p>

                      <div className="flex items-end justify-between pt-4 border-t border-[var(--border)]">
                        <div>
                          <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-0.5">Starting from</div>
                          <div className="text-lg font-bold gradient-text">{p.startingPrice.toLocaleString('uk-UA')} ₴</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-0.5">Timeline</div>
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

      // ========== STEP 1: STYLE ==========
      case 1:
        return (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Design & style
              </h2>
              <p className="text-[var(--text-muted)] text-lg mb-8">
                Choose a base template and visual style that matches your vision.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--purple)]/15 border border-[var(--purple)]/30 flex items-center justify-center text-sm font-bold text-[var(--purple-bright)]">
                  1
                </div>
                <label className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider">
                  Template
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {templateOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                      template === t
                        ? 'bg-[var(--purple)] text-white border-[var(--purple)] shadow-[0_0_24px_rgba(139,92,246,0.4)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface)] hover:border-[var(--purple)]/40 hover:text-[var(--text)] hover:-translate-y-0.5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--purple)]/15 border border-[var(--purple)]/30 flex items-center justify-center text-sm font-bold text-[var(--purple-bright)]">
                  2
                </div>
                <label className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider">
                  Design Style
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {designOptions.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDesign(d)}
                    className={`px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                      design === d
                        ? 'bg-[var(--purple)] text-white border-[var(--purple)] shadow-[0_0_24px_rgba(139,92,246,0.4)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface)] hover:border-[var(--purple)]/40 hover:text-[var(--text)] hover:-translate-y-0.5'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // ========== STEP 2: PAGES ==========
      case 2:
        return (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              What pages do you need?
            </h2>
            <p className="text-[var(--text-muted)] text-lg mb-8">
              Select the pages for your product. You can add or remove later.
            </p>

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
                      <div>
                        <div className="text-[15px] font-semibold">{page.name}</div>
                        {isRequired && (
                          <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mt-0.5">Included</div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-[var(--text-muted)]">
                      {page.price === 0 ? 'Free' : `+${page.price} ₴`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      // ========== STEP 3: FEATURES ==========
      case 3:
        return (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Add powerful features
            </h2>
            <p className="text-[var(--text-muted)] text-lg mb-8">
              Optional extras that make your product stand out.
            </p>

            {featuresLoading ? (
              <p className="text-[var(--text-muted)]">Loading features...</p>
            ) : availableFeatures.length === 0 ? (
              <Card hover={false} className="text-center py-16">
                <p className="text-[var(--text-muted)]">No features available.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableFeatures.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id!);
                  return (
                    <button
                      key={feature.id}
                      onClick={() =>
                        toggleSelection(selectedFeatures, setSelectedFeatures, feature.id!)
                      }
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
                        <span className="text-[var(--text-muted)]">
                          {feature.estimatedTime}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );

      // ========== STEP 4: REQUIREMENTS ==========
      case 4:
        return (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Tell us more
            </h2>
            <p className="text-[var(--text-muted)] text-lg mb-8">
              Any specific requirements, references or notes for the project.
            </p>

            <div className="space-y-7">
              <div>
                <label className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider mb-3 block">
                  Custom requirements
                </label>
                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Tell us any specific requirements, features or ideas for your project..."
                />
                <p className="text-xs text-[var(--text-faint)] mt-2">
                  Optional. The more details you share, the better we can plan.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-[var(--text)] uppercase tracking-wider mb-3 block">
                  References
                </label>
                <Textarea
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  placeholder="Paste links to websites you like — one URL per line&#10;https://example.com&#10;https://another.com"
                />
                <p className="text-xs text-[var(--text-faint)] mt-2">
                  We use references for inspiration only — never copy.
                </p>
              </div>
            </div>
          </div>
        );

      // ========== STEP 5: REVIEW ==========
      case 5:
        return (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Review your project
            </h2>
            <p className="text-[var(--text-muted)] text-lg mb-8">
              Check everything is correct before placing your order.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — details */}
              <div className="lg:col-span-2 space-y-4">
                <Card hover={false} className="border-[var(--border)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-5">
                    Project Summary
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    <ReviewRow label="Product" value={product?.title || '—'} />
                    <ReviewRow label="Template" value={template || '—'} />
                    <ReviewRow label="Design" value={design || '—'} />
                    <ReviewRow label="Estimated time" value={product?.estimatedTime || '—'} />
                  </div>
                </Card>

                <Card hover={false} className="border-[var(--border)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-5">
                    Pages ({selectedPages.length})
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
                  <Card hover={false} className="border-[var(--border)]">
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-5">
                      Features ({selectedFeatures.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableFeatures
                        .filter((f) => selectedFeatures.includes(f.id!))
                        .map((f) => (
                          <span
                            key={f.id}
                            className="px-3 py-1.5 rounded-lg bg-[var(--purple)]/10 border border-[var(--purple)]/30 text-xs text-[var(--purple-bright)] font-medium"
                          >
                            {f.name}
                          </span>
                        ))}
                    </div>
                  </Card>
                )}

                {requirements && (
                  <Card hover={false} className="border-[var(--border)]">
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-4">
                      Requirements
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                      {requirements}
                    </p>
                  </Card>
                )}
              </div>

              {/* Right — price card */}
              <div className="lg:col-span-1">
                <Card hover={false} className="border-[var(--purple)]/30 bg-gradient-to-b from-[var(--purple)]/[0.06] to-transparent sticky top-24">
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-5">
                    Total Estimate
                  </div>

                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>Base product</span>
                      <span>{(product?.startingPrice || 0).toLocaleString('uk-UA')} ₴</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>Pages ({selectedPages.length})</span>
                      <span>+{pagesPrice.toLocaleString('uk-UA')} ₴</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>Features ({selectedFeatures.length})</span>
                      <span>+{featuresPrice.toLocaleString('uk-UA')} ₴</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--border)]">
                    <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-1">
                      Total
                    </div>
                    <div className="text-4xl font-bold gradient-text mb-2">
                      {totalPrice.toLocaleString('uk-UA')} ₴
                    </div>
                    <p className="text-xs text-[var(--text-faint)] leading-relaxed">
                      Final price and timeline will be confirmed after project review.
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
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl mb-12">
            <Badge>Order Builder</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-5 tracking-tight leading-[1.05]">
              Build your <span className="gradient-text">project</span>
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4">
              Configure your product step by step. See the price update in real time.
            </p>
          </div>
        </Reveal>

        {/* Step indicator — desktop */}
        <div className="hidden md:block mb-12">
          <div className="relative">
            {/* Track line */}
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
                    key={s.title}
                    onClick={() => i <= step && setStep(i)}
                    disabled={i > step}
                    className={`flex flex-col items-center text-center transition-all ${
                      i <= step ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        active
                          ? 'bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-white shadow-[0_0_24px_rgba(139,92,246,0.5)] scale-110'
                          : done
                          ? 'bg-[var(--purple)]/20 text-[var(--purple-bright)] border border-[var(--purple)]/40'
                          : 'bg-[var(--surface)] text-[var(--text-faint)] border border-[var(--border)]'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </div>
                    <div
                      className={`mt-3 text-xs font-semibold transition-colors ${
                        active
                          ? 'text-[var(--text)]'
                          : done
                          ? 'text-[var(--text-secondary)]'
                          : 'text-[var(--text-faint)]'
                      }`}
                    >
                      {s.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile progress */}
        <div className="md:hidden mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--purple-bright)] uppercase tracking-wider">
              Step {step + 1} of {steps.length}
            </span>
            <span className="text-xs text-[var(--text-muted)]">{steps[step].title}</span>
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

        {/* Content */}
        <div key={step} className="mb-12" style={{ animation: 'fadeUp 0.5s ease' }}>
          {renderStep()}
        </div>

        {/* Sticky bottom bar */}
        <div className="sticky bottom-4 z-30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)]/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <div>
                <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
                  Total
                </div>
                <div className="text-xl font-bold gradient-text">
                  {totalPrice.toLocaleString('uk-UA')} ₴
                </div>
              </div>
              <div className="w-px h-10 bg-[var(--border)]" />
              <div>
                <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
                  Progress
                </div>
                <div className="text-sm font-semibold">
                  {step + 1} / {steps.length}
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {step > 0 && (
                <Button variant="outline" onClick={handleBack} className="flex-1 sm:flex-none">
                  ← Back
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button onClick={handleNext} className="flex-1 sm:flex-none">
                  Continue →
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="flex-1 sm:flex-none">
                  {loading ? 'Creating...' : 'Create Order'}
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