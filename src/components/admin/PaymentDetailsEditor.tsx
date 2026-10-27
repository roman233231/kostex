'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notifyAllAdmins } from '@/services/notification';
import { Order } from '@/types/order';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Wallet, CreditCard, Bitcoin, MoreHorizontal, Save, Loader2, Check, AlertCircle, XCircle } from 'lucide-react';

const methods = [
  { id: 'card', label: 'Картка', icon: CreditCard, placeholder: '4149 4999 0000 0000\nОтримувач: Іван Іванов\nMonobank / Приват' },
  { id: 'crypto', label: 'Крипта', icon: Bitcoin, placeholder: 'USDT (TRC20): TXxx...\nBTC: bc1...' },
  { id: 'paypal', label: 'PayPal', icon: Wallet, placeholder: 'paypal.me/kostex\nабо paypal@example.com' },
  { id: 'other', label: 'Інше', icon: MoreHorizontal, placeholder: 'Посилання на оплату, реквізити тощо...' },
] as const;

export default function PaymentDetailsEditor({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [price, setPrice] = useState<string>(String(order.finalPrice || order.estimatedPrice || ''));
  const [method, setMethod] = useState<'card' | 'crypto' | 'paypal' | 'other'>(order.paymentMethod || 'card');
  const [details, setDetails] = useState(order.paymentDetails || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!order.id) return;
    const numPrice = Number(price.replace(/\D/g, ''));
    if (!numPrice || numPrice <= 0) { alert('Введіть коректну ціну'); return; }
    if (!details.trim()) { alert('Введіть реквізити'); return; }

    setSaving(true);
    try {
      const ref = doc(db, 'orders', order.id);
      await updateDoc(ref, {
        finalPrice: numPrice,
        paymentMethod: method,
        paymentDetails: details.trim(),
        paymentStatus: 'awaiting_manual',
        updatedAt: new Date().toISOString(),
      });
      await notifyAllAdmins(
        'Рахунок виставлено',
        `Замовлення #${order.id.slice(0, 8)} — ${numPrice.toLocaleString('uk-UA')} ₴ (${method})`,
        `/admin/orders/${order.id}`
      );
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (!order.id) return;
    if (!confirm('Підтвердити оплату? Клієнт побачить, що платіж підтверджено.')) return;
    await updateDoc(doc(db, 'orders', order.id), {
      paymentStatus: 'paid',
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onUpdate();
  };

  const handleReject = async () => {
    if (!order.id) return;
    if (!confirm('Клієнт каже, що оплатив, але гроші не надійшли? Повернути в очікування?')) return;
    await updateDoc(doc(db, 'orders', order.id), {
      paymentStatus: 'awaiting_manual',
      updatedAt: new Date().toISOString(),
    });
    onUpdate();
  };

  const handleCancel = async () => {
    if (!order.id) return;
    if (!confirm('Скасувати оплату повністю? Клієнт не зможе оплатити, поки не виставиш рахунок знову.')) return;
    await updateDoc(doc(db, 'orders', order.id), {
      paymentStatus: 'cancelled',
      updatedAt: new Date().toISOString(),
    });
    onUpdate();
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
          <Wallet size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text)]">Рахунок на оплату</h3>
          <p className="text-xs text-[var(--text-3)]">Вистав рахунок, і клієнт побачить його у своєму замовленні</p>
        </div>
      </div>

      {/* Поточний статус */}
      {order.paymentStatus === 'paid' && (
        <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-start gap-3">
          <Check size={20} className="text-green-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-green-500">Оплату підтверджено</div>
            <div className="text-xs text-[var(--text-3)] mt-1">
              {order.paidAt ? new Date(order.paidAt).toLocaleString('uk-UA') : ''} · {order.finalPrice?.toLocaleString('uk-UA')} ₴
            </div>
            <button onClick={handleCancel} className="mt-3 text-xs font-bold text-red-500 hover:underline">
              Скасувати підтвердження
            </button>
          </div>
        </div>
      )}

      {order.paymentStatus === 'pending_confirmation' && (
        <div className="mb-6 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-yellow-500">Клієнт каже, що оплатив</div>
              <div className="text-xs text-[var(--text-3)] mt-1">
                {order.paymentClaimedAt ? `О ${new Date(order.paymentClaimedAt).toLocaleString('uk-UA')}` : ''} — перевір надходження коштів
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleConfirm} className="flex-1 !py-2.5 bg-green-500 hover:bg-green-600 border-none">
              <Check size={16} className="mr-1" /> Підтвердити
            </Button>
            <Button onClick={handleReject} variant="outline" className="flex-1 !py-2.5">
              <XCircle size={16} className="mr-1" /> Не надійшло
            </Button>
          </div>
        </div>
      )}

      {order.paymentStatus === 'awaiting_manual' && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-blue-500">Очікує оплати від клієнта</div>
            <div className="text-xs text-[var(--text-3)] mt-1">Клієнт бачить реквізити у своєму замовленні</div>
          </div>
        </div>
      )}

      {order.paymentStatus === 'cancelled' && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-500">Оплату скасовано</div>
            <div className="text-xs text-[var(--text-3)] mt-1">Вистав новий рахунок нижче</div>
          </div>
        </div>
      )}

      {/* Форма */}
      {order.paymentStatus !== 'paid' && (
        <>
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Сума до оплати (₴)</label>
            <input
              type="text"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
              placeholder="5000"
              className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-lg font-bold text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Спосіб оплати</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {methods.map((m) => {
                const Icon = m.icon;
                const isSel = method === m.id;
                return (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${isSel ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)]/50'}`}
                  >
                    <Icon size={16} /> {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Реквізити / посилання</label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={methods.find((m) => m.id === method)?.placeholder}
              className="!bg-[var(--surface)] min-h-[110px] font-mono text-sm"
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl btn-tactile">
            {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
            {saving ? 'Збереження...' : 'Показати клієнту'}
          </Button>
        </>
      )}
    </div>
  );
}
