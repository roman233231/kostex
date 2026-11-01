'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notifyAllAdmins } from '@/services/notification';
import { Order } from '@/types/order';
import Button from '@/components/ui/Button';
import { Wallet, CreditCard, Bitcoin, MoreHorizontal, Copy, Check, Loader2, AlertCircle, XCircle, Clock, Info, CheckCircle2 } from 'lucide-react';

const methodLabels: Record<string, { label: string; icon: any }> = {
  card: { label: 'Банківська картка', icon: CreditCard },
  crypto: { label: 'Криптовалюта', icon: Bitcoin },
  paypal: { label: 'PayPal', icon: Wallet },
  other: { label: 'Інший спосіб', icon: MoreHorizontal },
};

export default function ClientPaymentBlock({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState(false);

  if (!order.paymentStatus || order.paymentStatus === 'pending') return null;

  const total = order.finalPrice || order.estimatedPrice || 0;
  const paid = order.paidAmount || 0;
  const currentAmount = order.currentInvoiceAmount || 0;
  const remaining = total - paid;
  const progress = total > 0 ? Math.min((paid / total) * 100, 100) : 0;

  const method = methodLabels[order.paymentMethod || 'other'] || methodLabels.other;
  const Icon = method.icon;

  const copyDetails = () => {
    if (!order.paymentDetails) return;
    navigator.clipboard.writeText(order.paymentDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimPaid = async () => {
    if (!order.id || !currentAmount) return;
    if (!confirm(`Ви впевнені, що оплатили ${currentAmount.toLocaleString('uk-UA')} ₴?`)) return;
    setClaiming(true);
    try {
      const ref = doc(db, 'orders', order.id);
      await updateDoc(ref, {
        paymentStatus: 'pending_confirmation',
        paymentClaimedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await notifyAllAdmins('Клієнт каже, що оплатив', `Замовлення #${order.id.slice(0, 8)} — ${currentAmount.toLocaleString('uk-UA')} ₴. Перевір!`, `/admin/orders/${order.id}`);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Помилка. Спробуйте ще раз.');
    } finally {
      setClaiming(false);
    }
  };

  // Повністю оплачено
  if (order.paymentStatus === 'fully_paid') {
    return (
      <div className="glass-card rounded-[2rem] p-6 border-green-500/30 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0"><CheckCircle2 size={24} /></div>
        <div>
          <div className="font-bold text-lg text-green-500 mb-1">Проєкт повністю оплачено</div>
          <p className="text-sm text-[var(--text-3)]">Дякуємо за довіру! Сума: <strong>{total.toLocaleString('uk-UA')} ₴</strong></p>
        </div>
      </div>
    );
  }

  // Очікує підтвердження
  if (order.paymentStatus === 'pending_confirmation') {
    return (
      <div className="glass-card rounded-[2rem] p-6 border-yellow-500/30 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 animate-pulse"><Clock size={24} /></div>
        <div>
          <div className="font-bold text-lg text-yellow-500 mb-1">Очікуємо підтвердження</div>
          <p className="text-sm text-[var(--text-3)]">Ми перевіримо надходження {currentAmount.toLocaleString('uk-UA')} ₴ найближчим часом.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[2rem] p-6 md:p-8 border-[var(--accent)]/30 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/10 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0"><Wallet size={24} /></div>
        <div>
          <h3 className="text-xl font-bold text-[var(--text)]">
            {currentAmount > 0 ? (order.invoiceType === 'prepayment' ? 'Передоплата' : 'Сплата залишку') : 'Фінанси замовлення'}
          </h3>
          <p className="text-sm text-[var(--text-3)]">Загальна вартість: {total.toLocaleString('uk-UA')} ₴</p>
        </div>
      </div>

      {/* Смуга прогресу для клієнта */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[var(--text-3)]">Сплачено: <strong className="text-green-500">{paid.toLocaleString('uk-UA')} ₴</strong></span>
          <span className="text-[var(--text-3)]">Залишок: <strong className="text-[var(--accent)]">{remaining.toLocaleString('uk-UA')} ₴</strong></span>
        </div>
        <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {currentAmount > 0 ? (
        <>
          <div className="text-center mb-6 relative z-10">
            <div className="text-xs font-bold text-[var(--text-4)] uppercase tracking-widest mb-1">До сплати зараз</div>
            <div className="text-5xl md:text-6xl font-bold text-gradient-animated">{currentAmount.toLocaleString('uk-UA')} ₴</div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0"><Icon size={20} /></div>
              <div className="text-base font-bold text-[var(--text)]">{method.label}</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg)] border-2 border-dashed border-[var(--accent)]/40 relative mb-6 z-10">
            <button onClick={copyDetails} className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all" title="Скопіювати">
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
            <div className="text-xs font-bold text-[var(--text-4)] uppercase tracking-wider mb-3">Реквізити</div>
            <pre className="font-mono text-sm text-[var(--text)] whitespace-pre-wrap break-words leading-relaxed pr-12">
{order.paymentDetails}
            </pre>
          </div>

          <Button onClick={handleClaimPaid} disabled={claiming} className="w-full py-4 rounded-xl btn-tactile shadow-[0_0_20px_rgba(16,185,129,0.4)] bg-green-500 hover:bg-green-600 border-none text-lg relative z-10">
            {claiming ? <Loader2 size={20} className="animate-spin mr-2" /> : <Check size={20} className="mr-2" />}
            {claiming ? 'Надсилаємо...' : 'Я оплатив'}
          </Button>
        </>
      ) : (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 relative z-10">
          <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            {paid > 0 
              ? `Ви вже сплатили ${paid.toLocaleString('uk-UA')} ₴. Очікуйте, поки менеджер виставить рахунок на залишок.`
              : `Рахунок ще не виставлено. Менеджер зв'яжеться з вами найближчим часом.`}
          </p>
        </div>
      )}
    </div>
  );
}
