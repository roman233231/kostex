'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getPaymentLink } from '@/services/paymentLink';
import { PaymentLink } from '@/types/paymentLink';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Check, Copy, CreditCard, Bitcoin, Wallet, MoreHorizontal, AlertCircle, Loader2, ShieldCheck, XCircle, Clock } from 'lucide-react';

const methodLabels: Record<string, { label: string; icon: any }> = {
  card: { label: 'Банківська картка', icon: CreditCard },
  crypto: { label: 'Криптовалюта', icon: Bitcoin },
  paypal: { label: 'PayPal', icon: Wallet },
  other: { label: 'Інший спосіб', icon: MoreHorizontal },
};

export default function PaymentPage() {
  const params = useParams();
  const token = params?.token as string;
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const load = async () => {
    if (!token) return;
    try {
      const data = await getPaymentLink(token);
      setLink(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token]);

  const copyDetails = () => {
    if (!link?.paymentDetails) return;
    navigator.clipboard.writeText(link.paymentDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimPaid = async () => {
    if (!link?.id) return;
    if (!confirm(`Ви впевнені, що оплатили ${link.amount.toLocaleString('uk-UA')} ₴?`)) return;
    setClaiming(true);
    try {
      const now = new Date().toISOString();
      const batch = writeBatch(db);

      // Оновлюємо статус paymentLink
      batch.update(doc(db, 'paymentLinks', link.id), {
        status: 'pending_confirmation',
        claimedAt: now,
      });

      // Якщо є прив'язка до замовлення — оновлюємо і його
      if (link.orderId) {
        batch.update(doc(db, 'orders', link.orderId), {
          paymentStatus: 'pending_confirmation',
          paymentClaimedAt: now,
          updatedAt: now,
        });
      }

      await batch.commit();
      setClaimed(true);
      await load();
    } catch (err) {
      console.error(err);
      alert('Помилка. Спробуйте ще раз.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return (<><Navbar /><main className="container py-32 min-h-screen flex items-center justify-center"><Loader2 size={40} className="animate-spin text-[var(--accent)]" /></main><Footer /></>);

  if (!link) {
    return (
      <>
        <Navbar />
        <main className="container py-32 min-h-screen flex items-center justify-center">
          <div className="glass-card rounded-[2rem] p-10 text-center max-w-md">
            <AlertCircle size={56} className="text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[var(--text)] mb-3">Посилання недійсне</h1>
            <p className="text-[var(--text-3)] mb-6">Можливо, воно застаріло або неправильне.</p>
            <Link href="/"><Button>На головну</Button></Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const method = methodLabels[link.paymentMethod] || methodLabels.other;
  const Icon = method.icon;

  if (link.status === 'confirmed') {
    return (
      <>
        <Navbar />
        <main className="container py-32 min-h-screen flex items-center justify-center">
          <div className="glass-card rounded-[2rem] p-10 text-center max-w-md border-green-500/30">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Оплату підтверджено!</h2>
            <p className="text-[var(--text-3)]">Дякуємо! Ми зв'яжемося з вами найближчим часом.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (link.status === 'pending_confirmation' || claimed) {
    return (
      <>
        <Navbar />
        <main className="container py-32 min-h-screen flex items-center justify-center">
          <div className="glass-card rounded-[2rem] p-10 text-center max-w-md border-yellow-500/30">
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-yellow-500 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Дякуємо!</h2>
            <p className="text-[var(--text-3)] mb-4">Ми отримали вашу заявку про оплату {link.amount.toLocaleString('uk-UA')} ₴.</p>
            <p className="text-sm text-[var(--text-4)]">Менеджер перевірить надходження коштів і підтвердить оплату.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (link.status === 'rejected' || link.status === 'superseded') {
    return (
      <>
        <Navbar />
        <main className="container py-32 min-h-screen flex items-center justify-center">
          <div className="glass-card rounded-[2rem] p-10 text-center max-w-md border-red-500/30">
            <XCircle size={56} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Це посилання неактивне</h2>
            <p className="text-[var(--text-3)] mb-6">Зв'яжіться з менеджером, щоб отримати актуальне посилання на оплату.</p>
            <Button onClick={() => window.dispatchEvent(new Event('open-support-chat'))}>Зв'язатися з підтримкою</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 max-w-3xl min-h-screen">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} /> Рахунок на оплату
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-2">{link.productTitle}</h1>
          {link.customerName && <p className="text-sm text-[var(--text-3)]">Для: {link.customerName}</p>}
        </div>

        <div className="glass-card rounded-[2rem] p-8 md:p-10 mb-6">
          <div className="text-center mb-8">
            <div className="text-sm text-[var(--text-3)] uppercase tracking-wider mb-1">До сплати</div>
            <div className="text-5xl md:text-6xl font-bold text-gradient-animated">{link.amount.toLocaleString('uk-UA')} ₴</div>
            {link.invoiceType === 'prepayment' && (
              <div className="text-xs text-[var(--text-3)] mt-2">Передоплата (50% від {link.totalPrice.toLocaleString('uk-UA')} ₴)</div>
            )}
            {link.invoiceType === 'final' && (
              <div className="text-xs text-[var(--text-3)] mt-2">Залишок (загальна вартість {link.totalPrice.toLocaleString('uk-UA')} ₴)</div>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
              <Icon size={20} />
            </div>
            <div>
              <div className="text-xs text-[var(--text-4)] uppercase tracking-wider">Спосіб оплати</div>
              <div className="font-bold text-[var(--text)]">{method.label}</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg)] border-2 border-dashed border-[var(--accent)]/30 relative">
            <button onClick={copyDetails} className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all" title="Скопіювати">
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
            <div className="text-xs font-bold text-[var(--text-4)] uppercase tracking-wider mb-2">Реквізити</div>
            <pre className="font-mono text-sm md:text-base text-[var(--text)] whitespace-pre-wrap break-words leading-relaxed pr-10">
{link.paymentDetails}
            </pre>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-yellow-500/20 bg-yellow-500/[0.03] mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[var(--text)] mb-1 text-sm">Після оплати натисніть кнопку нижче</div>
              <p className="text-xs text-[var(--text-3)] leading-relaxed">Ми отримаємо сповіщення і перевіримо платіж. Зазвичай це займає до 1 години в робочий час.</p>
            </div>
          </div>
        </div>

        <Button onClick={handleClaimPaid} disabled={claiming} className="w-full py-4 text-lg rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)] bg-green-500 hover:bg-green-600 border-none">
          {claiming ? <Loader2 size={20} className="animate-spin mr-2" /> : <Check size={20} className="mr-2" />}
          {claiming ? 'Надсилаємо...' : 'Я оплатив'}
        </Button>
      </main>
      <Footer />
    </>
  );
}
