'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';
import Reveal from '@/components/ui/Reveal';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { createOrder } from '@/services/order';
import { getActiveFeatures } from '@/services/feature';
import { notifyAllAdmins } from '@/services/notification';
import { Feature } from '@/types/feature';
import {
  Package, Palette, FileText, Zap, PenLine, Check,
  ArrowLeft, ArrowRight, Loader2, Sparkles, LayoutTemplate,
  Smartphone, Monitor, ShieldCheck, Globe, Bot, Code,
  ShoppingCart, BarChart3, Settings, HelpCircle, GraduationCap,
  HeartPulse, Building2, Send, Instagram, Phone, Mail, MessageCircle
} from 'lucide-react';

const baseCategories = [
  { id: 'website', name: 'Сайт / Корпоративний', icon: Globe, price: 5000, time: '7–14 днів', desc: 'Багатосторінковий сайт для бізнесу' },
  { id: 'landing', name: 'Лендінг', icon: LayoutTemplate, price: 3500, time: '3–7 днів', desc: 'Односторінковий сайт для продажу послуги' },
  { id: 'webapp', name: 'Веб-додаток', icon: Zap, price: 12000, time: '2–4 тижні', desc: 'Додаток з авторизацією, базою даних та логікою' },
  { id: 'bot', name: 'Telegram-бот', icon: Bot, price: 4000, time: '3–7 днів', desc: 'Бот для продажів, запису або підтримки' },
  { id: 'software', name: 'Софт / Десктоп', icon: Code, price: 15000, time: '3–5 тижнів', desc: 'Крос-платформний софт або утиліта' },
  { id: 'crm', name: 'CRM-система', icon: BarChart3, price: 20000, time: '4–6 тижнів', desc: 'Управління клієнтами та замовленнями' },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart, price: 15000, time: '2–4 тижні', desc: 'Онлайн-магазин з каталогом та оплатою' },
  { id: 'mobile', name: 'Мобільний додаток', icon: Smartphone, price: 25000, time: '4–8 тижнів', desc: 'iOS / Android додаток під ваш бізнес' },
  { id: 'automation', name: 'Автоматизація', icon: Settings, price: 8000, time: '1–2 тижні', desc: 'Інтеграції, парсери, скрипти' },
  { id: 'other', name: 'Інше / Кастом', icon: HelpCircle, price: 0, time: 'Узгоджується', desc: 'Нестандартний проєкт — обговоримо' },
];

const sphereOptions = [
  { id: 'Business', label: 'Бізнес / Послуги', icon: Building2 },
  { id: 'Restaurant', label: 'Ресторан / Кафе', icon: Sparkles },
  { id: 'Auto Service', label: 'Автосервіс', icon: Settings },
  { id: 'Fitness', label: 'Фітнес / Спорт', icon: HeartPulse },
  { id: 'Portfolio', label: 'Портфоліо / Бренд', icon: LayoutTemplate },
  { id: 'E-commerce', label: 'Магазин / Товари', icon: ShoppingCart },
  { id: 'Education', label: 'Освіта / Курси', icon: GraduationCap },
  { id: 'Medicine', label: 'Медицина / Клініка', icon: HeartPulse },
  { id: 'Real Estate', label: 'Нерухомість', icon: Building2 },
  { id: 'Landing', label: 'Інше', icon: Globe },
];

const designOptions = [
  { id: 'Minimal', label: 'Minimal', icon: Monitor },
  { id: 'Premium', label: 'Premium', icon: Sparkles },
  { id: 'Dark', label: 'Dark', icon: ShieldCheck },
  { id: 'Glass', label: 'Glass', icon: LayoutTemplate },
  { id: 'Futuristic', label: 'Futuristic', icon: Zap },
  { id: 'Corporate', label: 'Corporate', icon: Smartphone },
];

const contactOptions = [
  { id: 'telegram', label: 'Telegram', icon: Send, placeholder: '@username' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@username' },
  { id: 'phone', label: 'Телефон', icon: Phone, placeholder: '+380...' },
  { id: 'email', label: 'Email', icon: Mail, placeholder: 'you@example.com' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, placeholder: '+380...' },
  { id: 'viber', label: 'Viber', icon: MessageCircle, placeholder: '+380...' },
  { id: 'site', label: 'Чат на сайті', icon: MessageCircle, placeholder: '' },
];

const commonPages = [
  { name: 'Home', price: 0 }, { name: 'About', price: 500 }, { name: 'Services', price: 700 },
  { name: 'Contact', price: 0 }, { name: 'Gallery', price: 600 }, { name: 'Blog', price: 900 },
  { name: 'FAQ', price: 400 }, { name: 'Catalog', price: 1200 }, { name: 'Team', price: 500 },
  { name: 'Pricing', price: 800 }, { name: 'Reviews', price: 500 }, { name: 'Booking', price: 1500 },
  { name: 'Dashboard', price: 2000 }, { name: 'Profile', price: 600 },
];

const steps = [
  { title: 'Тип', icon: Package },
  { title: 'Стиль', icon: Palette },
  { title: 'Сторінки', icon: FileText },
  { title: 'Фічі', icon: Zap },
  { title: 'Контакт', icon: PenLine },
  { title: 'Огляд', icon: Check },
] as const;

export default function BuilderPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [sphere, setSphere] = useState('');
  const [design, setDesign] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>(['Home']);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [requirements, setRequirements] = useState('');
  const [references, setReferences] = useState('');
  const [contactPreference, setContactPreference] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try { const data = await getActiveFeatures(); setAvailableFeatures(data); }
      catch (err) { console.error(err); } finally { setFeaturesLoading(false); }
    };
    fetchFeatures();
  }, []);

  const selectedCategory = baseCategories.find((c) => c.id === selectedCategoryId);
  const pagesPrice = selectedPages.reduce((sum, pageName) => {
    const p = commonPages.find((cp) => cp.name === pageName); return sum + (p?.price || 0);
  }, 0);
  const featuresPrice = selectedFeatures.reduce((sum, featureId) => {
    const feature = availableFeatures.find((f) => f.id === featureId); return sum + (feature?.price || 0);
  }, 0);
  const totalPrice = (selectedCategory?.price || 0) + pagesPrice + featuresPrice;

  const toggleSelection = (list: string[], setList: (val: string[]) => void, value: string) => {
    if (list.includes(value)) { setList(list.filter((v) => v !== value)); }
    else { setList([...list, value]); }
  };

  const handleNext = () => {
    if (step === 0 && !selectedCategoryId) { setError('Оберіть тип проєкту'); return; }
    if (step === 1 && (!sphere || !design)) { setError('Оберіть сферу та стиль дизайну'); return; }
    if (step === 4 && !contactPreference) { setError('Оберіть, де вам зручніше спілкуватися'); return; }
    if (step === 4 && contactPreference !== 'site' && !contactValue.trim()) { setError('Вкажіть ваш контакт'); return; }
    setError(''); setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => { setError(''); setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSubmit = async () => {
    if (!currentUser) { router.push('/login'); return; }
    setLoading(true); setError('');
    try {
      const featureNames = availableFeatures.filter((f) => selectedFeatures.includes(f.id!)).map((f) => f.name);
      const orderId = await createOrder({
        userId: currentUser.uid,
        productId: selectedCategoryId,
        productTitle: selectedCategory?.name || 'Індивідуальний проєкт',
        template: sphere,
        design,
        pages: selectedPages,
        features: featureNames,
        requirements,
        references: references ? references.split('\n').filter((r) => r.trim()) : [],
        estimatedPrice: totalPrice,
        estimatedTime: selectedCategory?.time || 'TBD',
        status: 'NEW',
        contactPreference: contactPreference as any,
        contactValue: contactValue.trim(),
      });
      await notifyAllAdmins(
        'Нове замовлення!',
        `${selectedCategory?.name || 'Проєкт'} від ${contactPreference}: ${contactValue || 'сайт'}`,
        `/admin/orders/${orderId}`
      );
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
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">Що ви хочете створити?</h2>
            <p className="text-[var(--text-3)] mb-6">Оберіть тип проєкту.</p>
            <Link href="/ready-sites" className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 hover:border-[var(--accent)] transition-all mb-8 group">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0"><ShoppingCart size={18} /></div>
              <div className="flex-1">
                <div className="font-bold text-[var(--text)] text-sm group-hover:text-[var(--accent)] transition-colors">Або купіть готовий сайт</div>
                <div className="text-xs text-[var(--text-3)]">Дешевше та швидше — запуск за 3–5 днів</div>
              </div>
              <ArrowRight size={16} className="text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {baseCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button key={cat.id} onClick={() => setSelectedCategoryId(cat.id)}
                    className={`text-left rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden group flex flex-col ${isSelected ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-[0_0_25px_rgba(139,92,246,0.15)] ring-1 ring-[var(--accent)]' : 'glass-card border-[var(--border)] hover:border-[var(--accent)]/50 hover:-translate-y-1'}`}
                  >
                    {isSelected && (<div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shadow-lg animate-zoom-in"><Check size={12} strokeWidth={3} /></div>)}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"><Icon size={22} /></div>
                    <h3 className="text-base font-bold mb-1 text-[var(--text)]">{cat.name}</h3>
                    <p className="text-xs text-[var(--text-3)] mb-4 line-clamp-2 flex-1">{cat.desc}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] w-full mt-auto">
                      <div className="text-sm font-bold text-[var(--text)]">{cat.price > 0 ? `від ${cat.price.toLocaleString('uk-UA')} ₴` : 'Ціна за запитом'}</div>
                      <div className="text-[10px] font-medium text-[var(--text-4)] bg-[var(--surface-2)] px-2 py-1 rounded-md">{cat.time}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="animate-slide-up space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">Стиль та сфера</h2>
              <p className="text-[var(--text-3)]">Для якого бізнесу робимо та який настрій дизайну хочете.</p>
            </div>
            <div className="glass-card rounded-3xl p-6 md:p-8">
              <label className="text-sm font-bold uppercase tracking-wider text-[var(--text)] mb-4 block">1. Для якої сфери?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {sphereOptions.map((s) => {
                  const Icon = s.icon; const isSel = sphere === s.id;
                  return (
                    <button key={s.id} onClick={() => setSphere(s.id)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-xs font-semibold transition-all duration-300 text-left ${isSel ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_15px_var(--accent)] btn-tactile' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)]/50 hover:text-[var(--text)]'}`}
                    >
                      <Icon size={16} className={isSel ? 'text-white' : 'text-[var(--accent)]'} /> {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="glass-card rounded-3xl p-6 md:p-8">
              <label className="text-sm font-bold uppercase tracking-wider text-[var(--text)] mb-4 block">2. Стиль дизайну</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {designOptions.map((d) => {
                  const Icon = d.icon; const isSel = design === d.id;
                  return (
                    <button key={d.id} onClick={() => setDesign(d.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-2 ${isSel ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_15px_var(--accent)] btn-tactile' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)]/50 hover:text-[var(--text)]'}`}
                    >
                      <Icon size={22} className={isSel ? 'text-white' : 'text-[var(--accent)]'} />
                      <span className="text-xs font-semibold">{d.label}</span>
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
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">Які сторінки потрібні?</h2>
            <p className="text-[var(--text-3)] mb-8">Головна — обов'язкова.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonPages.map((page) => {
                const isSelected = selectedPages.includes(page.name);
                const isRequired = page.name === 'Home';
                return (
                  <button key={page.name} onClick={() => !isRequired && toggleSelection(selectedPages, setSelectedPages, page.name)} disabled={isRequired}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isSelected ? 'border-[var(--accent)] bg-[var(--accent)]/5 ring-1 ring-[var(--accent)]' : 'glass-card border-[var(--border)] hover:border-[var(--accent)]/40'} ${isRequired ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--border-strong)] bg-[var(--surface)]'}`}>
                        {isSelected && <Check size={14} strokeWidth={3} className="text-white" />}
                      </div>
                      <span className={`text-sm font-semibold ${isSelected ? 'text-[var(--text)]' : 'text-[var(--text-2)]'}`}>{page.name}</span>
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-md ${isSelected ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--surface-2)] text-[var(--text-4)]'}`}>{page.price === 0 ? 'Free' : `+${page.price} ₴`}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">Додаткові функції</h2>
            <p className="text-[var(--text-3)] mb-8">Оберіть фічі.</p>
            {featuresLoading ? (<div className="animate-pulse h-32 glass-card rounded-3xl" />)
            : availableFeatures.length === 0 ? (<div className="glass-card text-center py-12"><p className="text-[var(--text-3)]">Поки немає фіч.</p></div>)
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableFeatures.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id!);
                  return (
                    <button key={feature.id} onClick={() => toggleSelection(selectedFeatures, setSelectedFeatures, feature.id!)}
                      className={`text-left p-5 rounded-3xl border transition-all duration-300 ${isSelected ? 'border-[var(--accent)] bg-[var(--accent)]/5 ring-1 ring-[var(--accent)]' : 'glass-card border-[var(--border)] hover:border-[var(--accent)]/40 hover:-translate-y-0.5'}`}
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
        const selectedContact = contactOptions.find((c) => c.id === contactPreference);
        return (
          <div className="animate-slide-up space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">Як з вами зв'язатися?</h2>
              <p className="text-[var(--text-3)]">Оберіть найзручніший спосіб — ми напишемо вам для узгодження деталей.</p>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <label className="text-sm font-bold uppercase tracking-wider text-[var(--text)] mb-4 block">Де вам зручніше?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {contactOptions.map((c) => {
                  const Icon = c.icon; const isSel = contactPreference === c.id;
                  return (
                    <button key={c.id} onClick={() => setContactPreference(c.id)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-xs font-semibold transition-all duration-300 text-left ${isSel ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_15px_var(--accent)] btn-tactile' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)]/50 hover:text-[var(--text)]'}`}
                    >
                      <Icon size={16} className={isSel ? 'text-white' : 'text-[var(--accent)]'} /> {c.label}
                    </button>
                  );
                })}
              </div>

              {selectedContact && selectedContact.placeholder && (
                <div className="mt-4 animate-slide-up">
                  <Input label="Ваш контакт" value={contactValue} onChange={(e) => setContactValue(e.target.value)} placeholder={selectedContact.placeholder} className="!bg-[var(--surface)]" />
                </div>
              )}
            </div>

            <div className="glass-card rounded-3xl p-6">
              <label className="text-sm font-bold uppercase tracking-wider mb-3 block text-[var(--text)]">Що важливо врахувати?</label>
              <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Опишіть, що саме потрібно..." className="!bg-[var(--surface)] !border-[var(--border)] min-h-[120px]" />
            </div>
            <div className="glass-card rounded-3xl p-6">
              <label className="text-sm font-bold uppercase tracking-wider mb-3 block text-[var(--text)]">Посилання на референси</label>
              <Textarea value={references} onChange={(e) => setReferences(e.target.value)} placeholder="https://example.com — подобається..." className="!bg-[var(--surface)] !border-[var(--border)] min-h-[100px]" />
            </div>
          </div>
        );

      case 5:
        const selectedContactFinal = contactOptions.find((c) => c.id === contactPreference);
        return (
          <div className="animate-slide-up space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[var(--text)]">Перевірте замовлення</h2>
              <p className="text-[var(--text-3)]">Все вірно? Тоді створюємо.</p>
            </div>
            <div className="glass-card rounded-3xl p-6 md:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-4)] mb-6 pb-4 border-b border-[var(--border)]">Деталі</div>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Тип</div><div className="font-semibold text-[var(--text)]">{selectedCategory?.name || '—'}</div></div>
                <div><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Термін</div><div className="font-semibold text-[var(--text)]">{selectedCategory?.time || '—'}</div></div>
                <div><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Сфера</div><div className="font-semibold text-[var(--text)]">{sphere}</div></div>
                <div><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Дизайн</div><div className="font-semibold text-[var(--text)]">{design}</div></div>
                <div className="col-span-2"><div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Зв'язок</div><div className="font-semibold text-[var(--text)]">{selectedContactFinal?.label}{contactValue ? ` · ${contactValue}` : ''}</div></div>
              </div>
            </div>
            <div className="glass-card rounded-3xl p-6">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-4)] mb-4">Сторінки ({selectedPages.length})</div>
              <div className="flex flex-wrap gap-2">{selectedPages.map((p) => (<span key={p} className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs font-medium text-[var(--text-2)]">{p}</span>))}</div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen pb-32 md:pb-24">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4 text-[var(--text)]">Створіть свій <span className="text-gradient-animated">проєкт</span></h1>
            <p className="text-lg text-[var(--text-3)]">Налаштуйте продукт крок за кроком. Ціна оновлюється в реальному часі.</p>
          </div>
        </Reveal>

        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--surface-2)] rounded-full -z-10" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--accent)] rounded-full transition-all duration-500 -z-10" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
            {steps.map((s, i) => {
              const Icon = s.icon; const active = i === step; const done = i < step;
              return (
                <button key={i} onClick={() => i <= step && setStep(i)} disabled={i > step} className={`flex flex-col items-center gap-2 ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${active ? 'bg-[var(--bg)] border-[var(--accent)] text-[var(--accent)] shadow-[0_0_20px_var(--accent)] scale-110' : done ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-4)]'}`}>
                    {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:block ${active ? 'text-[var(--accent)]' : done ? 'text-[var(--text-2)]' : 'text-[var(--text-4)]'}`}>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (<div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-3 animate-slide-up max-w-4xl mx-auto"><span className="text-lg">⚠</span><span>{error}</span></div>)}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
          <div className="lg:col-span-8">{renderStep()}</div>

          <div className="lg:col-span-4 hidden lg:block sticky top-28">
            <div className="glass-card rounded-[2rem] p-8 border-[var(--accent)]/20 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/10 rounded-full blur-[60px]" />
              <h3 className="text-lg font-bold text-[var(--text)] mb-6">Ваше замовлення</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm"><span className="text-[var(--text-3)]">Базовий тип</span><span className="font-semibold text-[var(--text)]">{(selectedCategory?.price || 0).toLocaleString('uk-UA')} ₴</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-[var(--text-3)]">Сторінки ({selectedPages.length})</span><span className="font-semibold text-[var(--text)]">+{pagesPrice.toLocaleString('uk-UA')} ₴</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-[var(--text-3)]">Фічі ({selectedFeatures.length})</span><span className="font-semibold text-[var(--text)]">+{featuresPrice.toLocaleString('uk-UA')} ₴</span></div>
              </div>
              <div className="pt-6 border-t border-[var(--border)] mb-8">
                <div className="flex justify-between items-end"><span className="text-sm font-bold text-[var(--text)] uppercase tracking-wider mb-1">Разом</span><span className="text-3xl font-bold text-gradient-animated leading-none">{totalPrice.toLocaleString('uk-UA')} ₴</span></div>
                <p className="text-[10px] text-[var(--text-4)] mt-3 leading-relaxed">Фінальна ціна може відрізнятися.</p>
              </div>
              <div className="space-y-3 relative z-10">
                {step < steps.length - 1 ? (
                  <Button onClick={handleNext} className="w-full py-4 text-base rounded-xl shadow-[0_0_20px_var(--accent)] btn-tactile">Продовжити <ArrowRight size={18} className="ml-2" /></Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading} className="w-full py-4 text-base rounded-xl shadow-[0_0_20px_var(--accent)] btn-tactile bg-green-500 hover:bg-green-600 border-none">
                    {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Check size={18} className="mr-2" />}
                    {loading ? 'Створення...' : 'Створити проєкт'}
                  </Button>
                )}
                {step > 0 && (<Button variant="outline" onClick={handleBack} className="w-full py-3 rounded-xl"><ArrowLeft size={16} className="mr-2" /> Назад</Button>)}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-[var(--bg)]/90 backdrop-blur-xl border-t border-[var(--border)] pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
            <div><div className="text-[10px] text-[var(--text-4)] uppercase font-bold tracking-wider mb-0.5">Разом</div><div className="text-xl font-bold text-gradient-animated">{totalPrice.toLocaleString('uk-UA')} ₴</div></div>
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
