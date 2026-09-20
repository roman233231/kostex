'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Textarea from '@/components/ui/Textarea';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/services/order';
import { getPublishedProducts } from '@/services/product';
import { getActiveFeatures } from '@/services/feature';
import { notifyAllAdmins } from '@/services/notification';
import { Product } from '@/types/product';
import { Feature } from '@/types/feature';

const designOptions = ['Minimal', 'Premium', 'Dark', 'Glass', 'Futuristic', 'Corporate'];
const commonPages = ['Home', 'About', 'Services', 'Contact', 'Gallery', 'Blog', 'FAQ', 'Catalog', 'Team', 'Pricing', 'Reviews', 'Booking', 'Dashboard', 'Profile'];

const steps = ['Product', 'Template & Design', 'Pages', 'Features', 'Requirements', 'Review'];

export default function BuilderPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [template, setTemplate] = useState('');
  const [design, setDesign] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
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

  const totalPrice =
    (product?.startingPrice || 0) +
    selectedPages.length * 500 +
    selectedFeatures.reduce((sum, featureId) => {
      const feature = availableFeatures.find((f) => f.id === featureId);
      return sum + (feature?.price || 0);
    }, 0);

  const toggleSelection = (list: string[], setList: (val: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleNext = () => {
    if (step === 0 && !selectedProduct) {
      setError('Please select a product.');
      return;
    }
    if (step === 1 && (!template || !design)) {
      setError('Please select template and design.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
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
            <h2 className="text-2xl font-semibold mb-6">Choose a Product</h2>
            {productsLoading ? (
              <p className="text-[var(--text-muted)]">Loading products...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProducts.map((p) => {
                  const isSelected = selectedProduct === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p.id)}
                      className={`text-left rounded-xl border p-5 transition-all duration-200 ${
                        isSelected
                          ? 'border-[var(--purple)] bg-[var(--purple)]/5 shadow-[var(--shadow-purple)]'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--purple)]/40'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-[var(--purple)]/10 border border-[var(--purple)]/20 text-[var(--purple-bright)] text-[10px] font-medium uppercase tracking-wider">
                          {p.category.replace('-', ' ')}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[var(--purple)] flex items-center justify-center text-white text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold mt-1">{p.title}</h3>
                      <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
                        {p.shortDescription}
                      </p>
                      <div className="mt-3 text-sm font-medium text-[var(--purple-bright)]">
                        From {p.startingPrice.toLocaleString('uk-UA')} ₴
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
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Template</h3>
              <div className="flex flex-wrap gap-2">
                {['Business', 'Restaurant', 'Auto Service', 'Fitness', 'Portfolio', 'E-commerce', 'Landing'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      template === t
                        ? 'bg-[var(--purple)] text-white border-[var(--purple)]'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Design Style</h3>
              <div className="flex flex-wrap gap-2">
                {designOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDesign(d)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      design === d
                        ? 'bg-[var(--purple)] text-white border-[var(--purple)]'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)]'
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
            <h3 className="text-xl font-semibold mb-4">Select Pages</h3>
            <div className="flex flex-wrap gap-2">
              {commonPages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => toggleSelection(selectedPages, setSelectedPages, page)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    selectedPages.includes(page)
                      ? 'bg-[var(--purple)] text-white border-[var(--purple)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-6">
              Selected: <strong className="text-[var(--text)]">{selectedPages.length}</strong> pages
              {selectedPages.length > 0 && <span> · +{selectedPages.length * 500} ₴</span>}
            </p>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Select Features</h3>
            {featuresLoading ? (
              <p className="text-[var(--text-muted)]">Loading features...</p>
            ) : availableFeatures.length === 0 ? (
              <p className="text-[var(--text-muted)]">No features available.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableFeatures.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id!);
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => toggleSelection(selectedFeatures, setSelectedFeatures, feature.id!)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all ${
                        isSelected
                          ? 'bg-[var(--purple)] text-white border-[var(--purple)]'
                          : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)]'
                      }`}
                    >
                      {feature.name}{' '}
                      <span className={isSelected ? 'text-white/80' : 'text-[var(--text-faint)]'}>
                        +{feature.price} ₴
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            <p className="text-sm text-[var(--text-muted)] mt-6">
              Selected: <strong className="text-[var(--text)]">{selectedFeatures.length}</strong> features
            </p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <Textarea
              label="Custom Requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Tell us any specific requirements for your project..."
            />
            <Textarea
              label="References (one URL per line)"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder="https://example.com&#10;https://another-reference.com"
            />
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Review Your Project</h2>
            <Card hover={false} className="border-[var(--purple)]/30">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Product:</span>
                  <span className="font-medium">{product?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Template:</span>
                  <span className="font-medium">{template}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Design:</span>
                  <span className="font-medium">{design}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Pages:</span>
                  <span className="font-medium text-right">{selectedPages.length} pages</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Features:</span>
                  <span className="font-medium text-right">
                    {selectedFeatures.length > 0
                      ? availableFeatures
                          .filter((f) => selectedFeatures.includes(f.id!))
                          .map((f) => f.name)
                          .join(', ')
                      : 'None'}
                  </span>
                </div>
                {requirements && (
                  <div className="pt-3 border-t border-[var(--border)]">
                    <div className="text-[var(--text-muted)] mb-1">Requirements:</div>
                    <div className="text-[var(--text-secondary)]">{requirements}</div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <div className="flex justify-between items-end">
                  <span className="text-[var(--text-muted)]">Estimated Price:</span>
                  <span className="text-3xl font-bold text-[var(--purple-bright)]">
                    {totalPrice.toLocaleString('uk-UA')} ₴
                  </span>
                </div>
                <p className="text-xs text-[var(--text-faint)] mt-2">
                  Final price and timeline will be confirmed after project review.
                </p>
              </div>
            </Card>
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
      <main className="container py-12 md:py-16 max-w-5xl">
        <div className="mb-8">
          <Badge>Order Builder</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">Build Your Project</h1>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs text-[var(--text-faint)]">
            <span>
              Step {step + 1} of {steps.length}
            </span>
            <span className="text-[var(--text-muted)]">{steps[step]}</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="hidden md:flex flex-wrap gap-2 mb-8">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === step
                  ? 'bg-[var(--purple)] text-white'
                  : i < step
                  ? 'bg-[var(--purple)]/15 text-[var(--purple-bright)]'
                  : 'bg-[var(--surface-2)] text-[var(--text-faint)]'
              }`}
            >
              {i + 1}. {s}
            </span>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="min-h-[300px]">{renderStep()}</div>

        {/* Footer with total + actions */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            <span className="text-[var(--text-muted)]">Estimated total: </span>
            <span className="text-lg font-bold text-[var(--purple-bright)]">
              {totalPrice.toLocaleString('uk-UA')} ₴
            </span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {step > 0 && (
              <Button variant="outline" onClick={handleBack} className="flex-1 sm:flex-none">
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={handleNext} className="flex-1 sm:flex-none">
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="flex-1 sm:flex-none">
                {loading ? 'Creating...' : 'Create Order'}
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}