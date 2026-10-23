'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useAuth } from '@/context/AuthContext';
import { getPortfolioBySlug } from '@/services/portfolio';
import { PortfolioItem } from '@/types/portfolio';
import { createOrder } from '@/services/order';
import { notifyAllAdmins } from '@/services/notification';
import {
  ArrowLeft, ShoppingCart, ExternalLink, Check, Zap, Clock,
  LayoutTemplate, Loader2, ShieldCheck, Smartphone, Search,
  Link2, HelpCircle, MessageCircle
} from 'lucide-react';

const includedItems = [
  { icon: LayoutTemplate, title: 'Готовий дизайн', desc: 'Адаптивний під мобільні, планшети та ПК' },
  { icon: Smartphone, title: 'Заміна контенту', desc: 'Ваші тексти, фото, логотип та кольори' },
  { icon: Search, title: 'Базове SEO', desc: 'Мета-теги, title, description, sitemap' },
  { icon: Link2, title: 'Підключення домену', desc: 'Налаштуємо ваш домен та хостинг' },
  { icon: MessageCircle, title: 'Форми зв’язку', desc: 'Контактні форми, кнопки месенджерів' },
  { icon: HelpCircle, title: '7 днів підтримки', desc: 'Виправлення дрібних помилок після запуску' },
];

export default function ReadySiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const slug = params?.slug as string;
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

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

  const handleBuy = async () => {
    if (!item) return;
    if (!currentUser) { router.push('/login'); return; }
    setBuying(true);
    try {
      const readyPrice = item.price || 5000;
      const orderId = await createOrder({
        userId: currentUser.uid,
        productId: 'ready-template',
        productTitle: `Готовий сайт: ${item.title}`,
        template: item.category,
        design: 'Premium',
        pages: ['Home'],
        features: item.features || [],
        requirements: `Клієнт купує готовий сайт "${item.title}". Потрібно замінити контент (тексти, фото) та налаштувати під клієнта.`,
        references: [],
        estimatedPrice: readyPrice,
        estimatedTime: '3–5 днів',
        status: 'NEW',
      });
      await notifyAllAdmins('New ready-site order', `Ready site: ${item.title}`, `/admin/orders/${orderId}`);
      router.push(`/account/orders/${orderId}/payment`);
    } catch (err) {
      console.error(err);
      alert('Помилка створення замовлення');
    } finally {
      setBuying(false);
    }
  };

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

  const price = item.price || 5000;
  const features = item.features || [];
  const technologies = item.technologies || [];

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen pb-32">
        <Reveal>
          <Link href="/ready-sites" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Назад до готових сайтів
          </Link>
        </Reveal>

        <Reveal delay={50}>
          <div className="mb-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider border border-green-500/20 flex items-center gap-1.5">
                <Zap size={12} /> Готовий до запуску
              </span>
              <Badge>{item.category.replace('-', ' ')}</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-gradient-animated mb-4">
              {item.title}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)] leading-relaxed">
              {item.description}
            </p>
          </div>
        </Reveal>

        {/* Велике прев'ю */}
        {item.image && (
          <Reveal delay={100}>
            <div className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden border border-[var(--border)] mb-10 shadow-[0_20px_80px_-20px_rgba(139,92,246,0.2)] group">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              {item.demoUrl && (
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/95 text-black font-bold text-sm hover:bg-white transition-all shadow-lg"
                >
                  <ExternalLink size={16} /> Дивитися живий сайт
                </a>
              )}
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Ліва частина */}
          <div className="lg:col-span-2 space-y-6">
            {/* Що ви отримаєте */}
            <Reveal>
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--text)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                    <Check size={18} strokeWidth={3} />
                  </div>
                  Що ви отримаєте
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {includedItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[var(--text)] mb-0.5">{item.title}</div>
                          <div className="text-xs text-[var(--text-3)] leading-relaxed">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            {/* Фічі проєкту */}
            {features.length > 0 && (
              <Reveal delay={100}>
                <div className="glass-card rounded-3xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[var(--text)]">Функції</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--text-2)] text-sm">
                        <Check size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {/* Технології */}
            {technologies.length > 0 && (
              <Reveal delay={150}>
                <div className="glass-card rounded-3xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[var(--text)]">Технології</h2>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs font-semibold text-[var(--text-2)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Процес */}
            <Reveal delay={200}>
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-[var(--text)]">Як це працює</h2>
                <div className="space-y-5">
                  {[
                    { step: 1, title: 'Оплата', desc: 'Ви оплачуєте замовлення зручним способом' },
                    { step: 2, title: 'Матеріали', desc: 'Ви надсилаєте тексти, фото, логотип та побажання' },
                    { step: 3, title: 'Адаптація', desc: 'Ми замінюємо контент, кольори та налаштовуємо під вас (1–3 дні)' },
                    { step: 4, title: 'Перевірка', desc: 'Ви переглядаєте результат та вносите правки (1 день)' },
                    { step: 5, title: 'Запуск', desc: 'Підключаємо домен і сайт готовий до роботи (1 день)' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white font-bold flex items-center justify-center shrink-0 shadow-lg">
                        {item.step}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="text-sm font-bold text-[var(--text)] mb-0.5">{item.title}</div>
                        <div className="text-sm text-[var(--text-3)]">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Права частина - Sticky з ціною */}
          <div className="lg:col-span-1 sticky top-28">
            <Reveal delay={150}>
              <div className="glass-card rounded-[2rem] p-8 border-[var(--accent)]/30 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.2)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent)]/20 rounded-full blur-[60px]" />

                <div className="text-xs font-bold text-[var(--text-4)] uppercase tracking-widest mb-2 relative z-10">Ціна</div>
                <div className="text-5xl font-bold text-gradient-animated mb-4 relative z-10">{price.toLocaleString('uk-UA')} ₴</div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text-3)] mb-6 relative z-10">
                  <Clock size={16} /> Запуск за <strong className="text-[var(--text)]">3–5 днів</strong>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                  <Button onClick={handleBuy} disabled={buying} className="w-full py-4 text-lg rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)]">
                    {buying ? <Loader2 size={20} className="animate-spin mr-2" /> : <ShoppingCart size={20} className="mr-2" />}
                    {buying ? 'Створення...' : 'Купити цей сайт'}
                  </Button>
                  {item.demoUrl && (
                    <a href={item.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full py-3 rounded-xl">
                        <ExternalLink size={18} className="mr-2" /> Подивитися демо
                      </Button>
                    </a>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--border)] relative z-10 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
                    <ShieldCheck size={14} className="text-green-500 shrink-0" />
                    <span>Безпечна оплата</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
                    <Check size={14} className="text-green-500 shrink-0" />
                    <span>Фіксована ціна без доплат</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
                    <Check size={14} className="text-green-500 shrink-0" />
                    <span>7 днів підтримки після запуску</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="glass-card rounded-3xl p-6 mt-6">
                <h3 className="font-bold text-[var(--text)] mb-2 text-sm">Хочете щось унікальне?</h3>
                <p className="text-xs text-[var(--text-3)] mb-4 leading-relaxed">
                  Не знайшли підходящий сайт? Створіть індивідуальний проєкт з нуля.
                </p>
                <Link href="/builder">
                  <Button variant="outline" className="w-full rounded-xl text-sm">
                    Відкрити конструктор <ArrowLeft size={16} className="ml-2 rotate-180" />
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
