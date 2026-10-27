'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notifyAllAdmins } from '@/services/notification';
import { Order } from '@/types/order';
import Button from '@/components/ui/Button';
import { Wallet, CreditCard, Bitcoin, MoreHorizontal, Copy, Check, Loader2, AlertCircle, XCircle, Clock } from 'lucide-react';

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

  const amount = order.finalPrice || order.estimatedPrice;
  const method = methodLabels[order.paymentMethod || 'other'] || methodLabels.other;
  const Icon = method.icon;

  const copyDetails = () => {
    if (!order.paymentDetails) return;
    navigator.clipboard.writeText(order.paymentDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimPaid = async () => {
    if (!order.id) return;
    if (!confirm('Ви впевнені, що оплатили? Адміністратор перевірить надходження коштів.')) return;
    setClaiming(true);
    try {
      const ref = doc(db, 'orders', order.id);
      await updateDoc(ref, {
        paymentStatus: 'pending_confirmation',
        paymentClaimedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await notifyAllAdmins(
        'Клієнт каже, що оплатив',
        `Замовлення #${order.id.slice(0, 8)} — ${amount.toLocaleString('uk-UA')} ₴. Перевір!`,
        `/admin/orders/${order.id}`
      );
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Помилка. Спробуйте ще раз.');
    } finally {
      setClaiming(false);
    }
  };

  // Скасовано
  if (order.paymentStatus === 'cancelled') {
    return (
      <div className="glass-card rounded-3xl p-6 md:p-8 border-red-500/30 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
          <XCircle size={24} />
        </div>
        <div>
          <div className="font-bold text-lg text-red-500 mb-1">Оплату скасовано</div>
          <p className="text-sm text-[var(--text-3)]">Зв'яжіться з нами в чаті, щоб отримати новий рахунок на оплату.</p>
        </div>
      </div>
    );
  }

  // Оплачено
  if (order.paymentStatus === 'paid') {
    return (
      <div className="glass-card rounded-3xl p-6 md:p-8 border-green-500/30 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
          <Check size={24} />
        </div>
        <div>
          <div className="font-bold text-lg text-green-500 mb-1">Оплату підтверджено</div>
          <p className="text-sm text-[var(--text-3)]">
            Сума: <strong className="text-[var(--text)]">{amount.toLocaleString('uk-UA')} ₴</strong>
            {order.paidAt && ` · ${new Date(order.paidAt).toLocaleString('uk-UA')}`}
          </p>
        </div>
      </div>
    );
  }

  // Очікує підтвердження
  if (order.paymentStatus === 'pending_confirmation') {
    return (
      <div className="glass-card rounded-3xl p-6 md:p-8 border-yellow-500/30 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 animate-pulse">
          <Clock size={24} />
        </div>
        <div>
          <div className="font-bold text-lg text-yellow-500 mb-1">Очікуємо підтвердження</div>
          <p className="text-sm text-[var(--text-3)]">Ми перевіримо надходження коштів і підтвердимо оплату найближчим часом.</p>
        </div>
      </div>
    );
  }

  // awaiting_manual - показуємо реквізити
  return (
    <div className="glass-card rounded-[2rem] p-6 md:p-8 border-[var(--accent)]/30 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/10 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
          <Wallet size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--text)]">Оплата замовлення</h3>
          <p className="text-sm text-[var(--text-3)]">Перекажіть суму та натисніть «Я оплатив»</p>
        </div>
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className="text-xs font-bold text-[var(--text-4)] uppercase tracking-widest mb-1">До сплати</div>
        <div className="text-5xl md:text-6xl font-bold text-gradient-animated">{amount.toLocaleString('uk-UA')} ₴</div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
            <Icon size={20} />
          </div>
          <div className="text-base font-bold text-[var(--text)]">{method.label}</div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[var(--bg)] border-2 border-dashed border-[var(--accent)]/40 relative mb-6 z-10">
        <button onClick={copyDetails} className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all" title="Скопіювати">
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        </button>
        <div className="text-xs font-bold text-[var(--text-4)] uppercase tracking-wider mb-3">Реквізити для оплати</div>
        <pre className="font-mono text-sm text-[var(--text)] whitespace-pre-wrap break-words leading-relaxed pr-12">
{order.paymentDetails || 'Реквізити ще не вказані'}
        </pre>
      </div>

      <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-6 flex items-start gap-3 relative z-10">
        <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--text-2)] leading-relaxed">
          Після переказу коштів натисніть кнопку нижче. Ми перевіримо надходження і підтвердимо оплату.
        </p>
      </div>

      <Button onClick={handleClaimPaid} disabled={claiming} className="w-full py-4 rounded-xl btn-tactile shadow-[0_0_20px_rgba(16,185,129,0.4)] bg-green-500 hover:bg-green-600 border-none text-lg relative z-10">
        {claiming ? <Loader2 size={20} className="animate-spin mr-2" /> : <Check size={20} className="mr-2" />}
        {claiming ? 'Надсилаємо...' : 'Я оплатив'}
      </Button>
    </div>
  );
}
