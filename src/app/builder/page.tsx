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
import { Product } from '@/types/product';
import { Feature } from '@/types/feature';
import { notifyAllAdmins } from '@/services/notification';

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
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]); // id функцій
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

  const product = availableProducts.find(p => p.id === selectedProduct);

  const totalPrice =
    (product?.startingPrice || 0) +
    selectedPages.length * 500 +
    selectedFeatures.reduce((sum, featureId) => {
      const feature = availableFeatures.find(f => f.id === featureId);
      return sum + (feature?.price || 0);
    }, 0);

  const toggleSelection = (list: string[], setList: (val: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value));
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
      .filter(f => selectedFeatures.includes(f.id!))
      .map(f => f.name);

    const orderId = await createOrder({
      userId: currentUser.uid,
      productId: selectedProduct,
      productTitle: product?.title,
      template,
      design,
      pages: selectedPages,
      features: featureNames,
      requirements,
      references: references ? references.split('\n').filter(r => r.trim()) : [],
      estimatedPrice: totalPrice,
      estimatedTime: product?.estimatedTime || 'TBD',
      status: 'NEW',
    });

    await notifyAllAdmins(
      'New order received',
      `New order: ${product?.title || 'Project'}`,
      `/admin/orders/${orderId}`
    );

    router.push(`/account/orders`);
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
            <h2 className="text-2xl font-bold mb-4">Choose Product</h2>
            {productsLoading ? (
              <p className="text-white/60">Loading products...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProducts.map(p => (
                  <Card key={p.id} className={`cursor-pointer ${selectedProduct === p.id ? 'border-purple-bright' : ''}`} hover={false}>
                    <div onClick={() => setSelectedProduct(p.id)}>
                      <Badge>{p.category}</Badge>
                      <h3 className="text-lg font-semibold mt-2">{p.title}</h3>
                      <p className="text-sm text-white/60 mt-1">{p.shortDescription}</p>
                      <div className="mt-2 text-sm text-white/50">From {p.startingPrice.toLocaleString('uk-UA')} ₴</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Template</h3>
              <div className="flex flex-wrap gap-2">
                {['Business', 'Restaurant', 'Auto Service', 'Fitness', 'Portfolio', 'E-commerce', 'Landing'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={`px-4 py-2 rounded-full border ${template === t ? 'bg-purple-bright text-white border-purple-bright' : 'border-white/10 text-white/70 hover:border-purple-bright'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Design</h3>
              <div className="flex flex-wrap gap-2">
                {designOptions.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDesign(d)}
                    className={`px-4 py-2 rounded-full border ${design === d ? 'bg-purple-bright text-white border-purple-bright' : 'border-white/10 text-white/70 hover:border-purple-bright'}`}
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
              {commonPages.map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => toggleSelection(selectedPages, setSelectedPages, page)}
                  className={`px-4 py-2 rounded-full border ${selectedPages.includes(page) ? 'bg-purple-bright text-white border-purple-bright' : 'border-white/10 text-white/70 hover:border-purple-bright'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <p className="text-sm text-white/50 mt-4">Selected: {selectedPages.length} pages</p>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Select Features</h3>
            {featuresLoading ? (
              <p className="text-white/60">Loading features...</p>
            ) : availableFeatures.length === 0 ? (
              <p className="text-white/60">No features available.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableFeatures.map(feature => (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => toggleSelection(selectedFeatures, setSelectedFeatures, feature.id!)}
                    className={`px-4 py-2 rounded-full border ${selectedFeatures.includes(feature.id!) ? 'bg-purple-bright text-white border-purple-bright' : 'border-white/10 text-white/70 hover:border-purple-bright'}`}
                  >
                    {feature.name} (+{feature.price} ₴)
                  </button>
                ))}
              </div>
            )}
            <p className="text-sm text-white/50 mt-4">Selected: {selectedFeatures.length} features</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <Textarea
              label="Custom Requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Tell us any specific requirements..."
            />
            <Textarea
              label="References (one URL per line)"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Review Your Project</h2>
            <Card>
              <div className="space-y-3">
                <div><span className="text-white/50">Product:</span> {product?.title}</div>
                <div><span className="text-white/50">Template:</span> {template}</div>
                <div><span className="text-white/50">Design:</span> {design}</div>
                <div><span className="text-white/50">Pages:</span> {selectedPages.join(', ') || 'None'}</div>
                <div>
                  <span className="text-white/50">Features:</span>{' '}
                  {selectedFeatures.length > 0
                    ? availableFeatures.filter(f => selectedFeatures.includes(f.id!)).map(f => f.name).join(', ')
                    : 'None'}
                </div>
                <div><span className="text-white/50">Requirements:</span> {requirements || 'None'}</div>
                <div><span className="text-white/50">References:</span> {references || 'None'}</div>
                <div className="pt-4 border-t border-white/5">
                  <span className="text-white/50">Estimated Price:</span>{' '}
                  <span className="text-2xl font-bold text-purple-bright">{totalPrice.toLocaleString('uk-UA')} ₴</span>
                  <p className="text-xs text-white/40 mt-1">Final price and timeline will be confirmed after project review.</p>
                </div>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Badge>Order Builder</Badge>
        <h1 className="text-5xl font-bold mt-4 mb-8">Build Your Project</h1>

        {/* Step indicator */}
        <div className="flex flex-wrap gap-2 mb-8">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`px-3 py-1 rounded-full text-sm ${
                i === step ? 'bg-purple-bright text-white' : i < step ? 'bg-white/10 text-white/60' : 'bg-white/5 text-white/30'
              }`}
            >
              {i + 1}. {s}
            </span>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {renderStep()}

        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <Button variant="outline" onClick={handleBack}>Back</Button>
          ) : <div></div>}
          {step < steps.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating order...' : 'Create Order'}
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}