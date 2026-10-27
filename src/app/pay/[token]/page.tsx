'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { getOrderByPaymentToken, markOrderAsPaidByClient } from '@/services/order';
import { notifyAllAdmins } from '@/services/notification';
import { Order } from '@/types/order';
import { Check, Copy, CreditCard, Bitcoin, Wallet, MoreHorizontal, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

const methodLabels: Record<string, string> = {
  card: 'Банківська картка',
  crypto: 'Криптовалюта',
  paypal: 'PayPal',
  other: 'Інший спосіб',
};

const methodIcons: Record<string, any> = {
  card: CreditCard,
  crypto: Bitcoin,
  paypal: Wallet,
  other: MoreHorizontal,
};

export default function PaymentPage() {
  const params = useParams();
  const token = params?.token as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const data = await getOrderByPaymentToken(token);
        setOrder(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, [token]);

  const handlePaid = async () => {
    if (!order) return;
    if (!confirm('Ви впевнені, що оплатили? Адміністратор перевірить платіж.')) return;
    setMarking(true);
    try {
      await markOrderAsPaidByClient(order.id!);
      await notifyAllAdmins('Клієнт підтвердив оплату!', `Замовлення #${order.id?.slice(0, 8)} — ${order.productTitle}. Перевірте надходження коштів.`, `/admin/orders/${order.id}`);
      alert('Дякуємо! Адміністратор перевірить оплату найближчим часом.');
      setOrder({ ...order, paymentStatus: 'paid' });
    } catch (err) {
      console.error(err);
      alert('Помилка. Спробуйте ще раз.');
    } finally {
      setMarking(false);
    }
  };

  const copyDetails = () => {
    if (!order?.paymentDetails) return;
    navigator.clipboard.writeText(order.paymentDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container py-32 min-h-screen flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="container py-32 min-h-screen flex items-center justify-center">
          <div className="glass-card rounded-[2rem] p-10 md:p-16 text-center max-w-lg">
            <AlertCircle size={56} className="text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[var(--text)] mb-3">Рахунок не знайдено</h1>
            <p className="text-[var(--text-3)] mb-8">Можливо, посилання застаріло або неправильне.</p>
            <Link href="/"><Button>На головну</Button></Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const Icon = methodIcons[order.paymentMethod || 'other'] || Wallet;
  const amount = order.finalPrice || order.estimatedPrice;

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen max-w-3xl">
        <Reveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} /> Рахунок на оплату
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-2">{order.productTitle}</h1>
            <p className="text-[var(--text-3)]">Замовлення #{order.id?.slice(0, 8)}</p>
          </div>
        </Reveal>

        {order.paymentStatus === 'paid' ? (
          <Reveal delay={100}>
            <div className="glass-card rounded-[2rem] p-10 md:p-16 text-center border-green-500/30">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text)] mb-3">Дякуємо за оплату!</h2>
              <p className="text-[var(--text-3)] mb-8">Ми перевіримо надходження коштів і зв'яжемося з вами.</p>
              <Link href="/account/orders"><Button>До моїх замовлень</Button></Link>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal delay={100}>
              <div className="glass-card rounded-[2rem] p-8 md:p-10 mb-6">
                <div className="text-center mb-8">
                  <div className="text-sm text-[var(--text-3)] uppercase tracking-wider mb-1">До сплати</div>
                  <div className="text-5xl md:text-6xl font-bold text-gradient-animated">{amount.toLocaleString('uk-UA')} ₴</div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-4)] uppercase tracking-wider">Спосіб оплати</div>
                    <div className="font-bold text-[var(--text)]">{methodLabels[order.paymentMethod || 'other']}</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--bg)] border-2 border-dashed border-[var(--accent)]/30 relative">
                  <button onClick={copyDetails} className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all" title="Скопіювати">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                  <div className="text-xs font-bold text-[var(--text-4)] uppercase tracking-wider mb-2">Реквізити</div>
                  <pre className="font-mono text-sm md:text-base text-[var(--text)] whitespace-pre-wrap break-words leading-relaxed pr-10">
{order.paymentDetails}
                  </pre>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="glass-card rounded-2xl p-6 border-yellow-500/20 bg-yellow-500/[0.03]">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[var(--text)] mb-1 text-sm">Після оплати натисніть кнопку нижче</div>
                    <p className="text-xs text-[var(--text-3)] leading-relaxed">Ми отримаємо сповіщення і перевіримо платіж. Зазвичай це займає до 1 години в робочий час.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <Button onClick={handlePaid} disabled={marking} className="w-full mt-6 py-4 text-lg rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)] bg-green-500 hover:bg-green-600 border-none">
                {marking ? <Loader2 size={20} className="animate-spin mr-2" /> : <Check size={20} className="mr-2" />}
                {marking ? 'Надсилаємо...' : 'Я оплатив'}
              </Button>
            </Reveal>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
