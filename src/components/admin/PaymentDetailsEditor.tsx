'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types/order';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Wallet, CreditCard, Bitcoin, MoreHorizontal, Save, Loader2, Check, AlertCircle, XCircle, RotateCcw, Calculator } from 'lucide-react';

const methods = [
  { id: 'card', label: 'Картка', icon: CreditCard, placeholder: '4149 4999 0000 0000\nОтримувач: Іван Іванов' },
  { id: 'crypto', label: 'Крипта', icon: Bitcoin, placeholder: 'USDT (TRC20): TXxx...\nBTC: bc1...' },
  { id: 'paypal', label: 'PayPal', icon: Wallet, placeholder: 'paypal.me/kostex' },
  { id: 'other', label: 'Інше', icon: MoreHorizontal, placeholder: 'Посилання на оплату...' },
] as const;

export default function PaymentDetailsEditor({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [totalPrice, setTotalPrice] = useState<string>(String(order.finalPrice || order.estimatedPrice || ''));
  const [invoiceAmount, setInvoiceAmount] = useState<string>(String(order.currentInvoiceAmount || order.finalPrice || order.estimatedPrice || ''));
  const [invoiceType, setInvoiceType] = useState<'prepayment' | 'final' | 'full'>(order.invoiceType || 'full');
  const [method, setMethod] = useState<'card' | 'crypto' | 'paypal' | 'other'>(order.paymentMethod || 'card');
  const [details, setDetails] = useState(order.paymentDetails || '');
  const [saving, setSaving] = useState(false);

  const paidAmount = order.paidAmount || 0;
  const total = Number(totalPrice) || 0;
  const remaining = total - paidAmount;

  // Автоматичні розрахунки
  const setPrepayment50 = () => {
    const half = Math.round(total / 2);
    setInvoiceAmount(String(half));
    setInvoiceType('prepayment');
  };

  const setRemainingBalance = () => {
    setInvoiceAmount(String(remaining));
    setInvoiceType('final');
  };

  const handleSave = async () => {
    if (!order.id) return;
    const numTotal = Number(totalPrice);
    const numInvoice = Number(invoiceAmount);

    if (!numTotal || numTotal <= 0) { alert('Введіть коректну загальну ціну'); return; }
    if (!numInvoice || numInvoice <= 0) { alert('Введіть коректну суму рахунку'); return; }
    if (numInvoice > remaining) { alert('Сума рахунку не може перевищувати залишок до сплати'); return; }
    if (!details.trim()) { alert('Введіть реквізити'); return; }

    setSaving(true);
    try {
      const ref = doc(db, 'orders', order.id);
      await updateDoc(ref, {
        finalPrice: numTotal,
        currentInvoiceAmount: numInvoice,
        invoiceType: invoiceType,
        paymentMethod: method,
        paymentDetails: details.trim(),
        paymentStatus: 'awaiting_manual',
        updatedAt: new Date().toISOString(),
      });
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (!order.id || !order.currentInvoiceAmount) return;
    if (!confirm(`Підтвердити оплату на суму ${order.currentInvoiceAmount.toLocaleString('uk-UA')} ₴?`)) return;
    
    const newPaidAmount = paidAmount + order.currentInvoiceAmount;
    const isFullyPaid = newPaidAmount >= total;

    await updateDoc(doc(db, 'orders', order.id), {
      paidAmount: newPaidAmount,
      paymentStatus: isFullyPaid ? 'fully_paid' : 'partially_paid',
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onUpdate();
  };

  const handleCancel = async () => {
    if (!order.id) return;
    if (!confirm('Скасувати поточний рахунок?')) return;
    await updateDoc(doc(db, 'orders', order.id), {
      paymentStatus: 'cancelled',
      updatedAt: new Date().toISOString(),
    });
    onUpdate();
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
          <Wallet size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text)]">Фінанси та оплата</h3>
          <p className="text-xs text-[var(--text-3)]">Керування рахунками та передоплатою</p>
        </div>
      </div>

      {/* Інфо панель */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
          <div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Загальна вартість</div>
          <div className="text-lg font-bold text-[var(--text)]">{total.toLocaleString('uk-UA')} ₴</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
          <div className="text-[10px] text-[var(--text-4)] uppercase tracking-wider mb-1">Вже сплачено</div>
          <div className="text-lg font-bold text-green-500">{paidAmount.toLocaleString('uk-UA')} ₴</div>
        </div>
      </div>

      {/* Статус */}
      {order.paymentStatus === 'fully_paid' && (
        <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-500 font-bold flex items-center gap-2">
          <Check size={20} /> Повністю оплачено
        </div>
      )}
      {order.paymentStatus === 'partially_paid' && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-500 font-bold flex items-center gap-2">
          <AlertCircle size={20} /> Частково оплачено. Залишок: {remaining.toLocaleString('uk-UA')} ₴
        </div>
      )}
      {order.paymentStatus === 'pending_confirmation' && (
        <div className="mb-6 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
          <div className="font-bold text-yellow-500 mb-2 flex items-center gap-2"><AlertCircle size={18} /> Клієнт каже, що оплатив {order.currentInvoiceAmount?.toLocaleString('uk-UA')} ₴</div>
          <div className="flex gap-2">
            <Button onClick={handleConfirm} className="flex-1 !py-2 bg-green-500 hover:bg-green-600 border-none"><Check size={16} className="mr-1" /> Підтвердити</Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1 !py-2"><XCircle size={16} className="mr-1" /> Скасувати</Button>
          </div>
        </div>
      )}

      {/* Форма виставлення рахунку */}
      {order.paymentStatus !== 'fully_paid' && (
        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Загальна вартість проєкту (₴)</label>
            <input type="text" inputMode="numeric" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-lg font-bold text-[var(--text)] focus:outline-none focus:border-[var(--accent)]" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Сума до сплати зараз (₴)</label>
            <div className="flex gap-2 mb-2">
              <input type="text" inputMode="numeric" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value.replace(/\D/g, ''))} className="flex-1 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xl font-bold text-[var(--accent)] focus:outline-none focus:border-[var(--accent)]" />
            </div>
            <div className="flex gap-2">
              <button onClick={setPrepayment50} className="flex-1 py-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs font-bold text-[var(--text-2)] hover:border-[var(--accent)] transition-all">50% (Передоплата)</button>
              <button onClick={setRemainingBalance} className="flex-1 py-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs font-bold text-[var(--text-2)] hover:border-[var(--accent)] transition-all">Залишок ({remaining} ₴)</button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Спосіб оплати</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {methods.map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id)} className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${method === m.id ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-3)]'}`}>
                  <m.icon size={16} /> {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Реквізити</label>
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder={methods.find((m) => m.id === method)?.placeholder} className="!bg-[var(--surface)] min-h-[100px] font-mono text-sm" />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full py-3.5 rounded-xl btn-tactile">
            {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
            {saving ? 'Збереження...' : 'Виставити рахунок клієнту'}
          </Button>
        </div>
      )}
    </div>
  );
}
