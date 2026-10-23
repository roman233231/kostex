'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getPublishedPortfolio } from '@/services/portfolio';
import { PortfolioItem } from '@/types/portfolio';
import { createOrder } from '@/services/order';
import { notifyAllAdmins } from '@/services/notification';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowRight, LayoutTemplate, Loader2, Zap, Clock, BadgeCheck } from 'lucide-react';

export default function ReadySitesPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublishedPortfolio();
        setTemplates(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleBuy = async (item: PortfolioItem) => {
    if (!currentUser) { router.push('/login'); return; }
    setBuyingId(item.id!);
    try {
      const readyPrice = item.price || 5000;
      const orderId = await createOrder({
        userId: currentUser.uid,
        productId: 'ready-template',
        productTitle: `Готовий сайт: ${item.title}`,
        template: item.category,
        design: 'Premium',
        pages: ['Home'],
        features: [],
        requirements: `Клієнт купує готовий сайт "${item.title}". Потрібно лише замінити контент (тексти, фото) та налаштувати під клієнта.`,
        references: [],
        estimatedPrice: readyPrice,
        estimatedTime: '1–2 дні',
        status: 'NEW',
      });
      await notifyAllAdmins('New ready-site order', `Ready site: ${item.title}`, `/admin/orders/${orderId}`);
      router.push(`/account/orders/${orderId}/payment`);
    } catch (err) {
      console.error(err);
      alert('Помилка створення замовлення');
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4">Готові рішення</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gradient-animated">
              Купіть готовий сайт
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)]">
              Це вже розроблені сайти, які можна купити одразу. Вони <strong className="text-[var(--text)]">дешевші</strong> та <strong className="text-[var(--text)]">готові за 1–2 дні</strong>, ніж розробка з нуля.
            </p>
          </div>
        </Reveal>

        <Reveal delay={50}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
            <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                <Zap size={22} />
              </div>
              <div>
                <div className="font-bold text-[var(--text)] text-sm">Дешевше</div>
                <div className="text-xs text-[var(--text-3)]">Економія до 40%</div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <div className="font-bold text-[var(--text)] text-sm">Швидше</div>
                <div className="text-xs text-[var(--text-3)]">Запуск за 1–2 дні</div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                <BadgeCheck size={22} />
              </div>
              <div>
                <div className="font-bold text-[var(--text)] text-sm">Перевірено</div>
                <div className="text-xs text-[var(--text-3)]">Вже працює</div>
              </div>
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 h-80 animate-pulse">
                <div className="h-40 bg-[var(--surface-2)] rounded-xl mb-4" />
                <div className="h-6 bg-[var(--surface-2)] rounded w-2/3 mb-2" />
                <div className="h-4 bg-[var(--surface-2)] rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <Reveal delay={150}>
            <div className="glass-card rounded-[2rem] text-center py-20 max-w-2xl mx-auto">
              <LayoutTemplate size={56} className="text-[var(--text-4)] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[var(--text)] mb-3">Поки немає готових сайтів</h3>
              <p className="text-[var(--text-3)] mb-8">Слідкуйте за оновленнями!</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 group">
                  <div className="relative h-48 overflow-hidden bg-[var(--surface-2)]">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text-4)]"><LayoutTemplate size={48} /></div>
                    )}
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                      <Zap size={12} /> Готовий
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] mb-2">{item.category}</div>
                    <h3 className="text-lg font-bold text-[var(--text)] mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--text-3)] line-clamp-2 mb-4 flex-1">{item.description}</p>
                    
                    <div className="flex items-end justify-between pt-4 border-t border-[var(--border)] mb-4">
                      <div>
                        <div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Ціна</div>
                        <div className="text-2xl font-bold text-gradient-animated">{(item.price || 5000).toLocaleString('uk-UA')} ₴</div>
                      </div>
                      <div className="text-xs text-[var(--text-4)] bg-[var(--surface-2)] px-2 py-1 rounded-md">1–2 дні</div>
                    </div>

                    <Button onClick={() => handleBuy(item)} disabled={buyingId === item.id} className="w-full rounded-xl btn-tactile shadow-[0_0_15px_var(--accent)]">
                      {buyingId === item.id ? <Loader2 size={18} className="animate-spin mr-2" /> : <ShoppingCart size={18} className="mr-2" />}
                      {buyingId === item.id ? 'Створення...' : 'Купити одразу'}
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
