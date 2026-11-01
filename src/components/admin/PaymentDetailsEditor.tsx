'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types/order';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Wallet, CreditCard, Bitcoin, MoreHorizontal, Save, Loader2, Check, AlertCircle, XCircle, RotateCcw, Landmark, ArrowRight } from 'lucide-react';

const methods = [
  { id: 'card', label: 'Картка', icon: CreditCard, placeholder: '4149 4999 0000 0000\nОтримувач: Іван Іванов' },
  { id: 'crypto', label: 'Крипта', icon: Bitcoin, placeholder: 'USDT (TRC20): TXxx...\nBTC: bc1...' },
  { id: 'paypal', label: 'PayPal', icon: Wallet, placeholder: 'paypal.me/kostex' },
  { id: 'other', label: 'Інше', icon: MoreHorizontal, placeholder: 'Посилання на оплату...' },
] as const;

export default function PaymentDetailsEditor({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [totalPrice, setTotalPrice] = useState<string>(String(order.finalPrice || order.estimatedPrice || ''));
  const [invoiceAmount, setInvoiceAmount] = useState<string>(String(order.currentInvoiceAmount || ''));
  const [invoiceType, setInvoiceType] = useState<'prepayment' | 'final' | 'full'>(order.invoiceType || 'full');
  const [method, setMethod] = useState<'card' | 'crypto' | 'paypal' | 'other'>(order.paymentMethod || 'card');
  const [details, setDetails] = useState(order.paymentDetails || '');
  const [saving, setSaving] = useState(false);

  const total = Number(totalPrice) || 0;
  const paid = order.paidAmount || 0;
  const remaining = total - paid;
  const progress = total > 0 ? Math.min((paid / total) * 100, 100) : 0;

  const handleSave = async (type: 'prepayment' | 'final' | 'full') => {
    if (!order.id) return;
    const numTotal = Number(totalPrice);
    let numInvoice = Number(invoiceAmount);

    if (type === 'prepayment') numInvoice = Math.round(numTotal / 2);
    if (type === 'final') numInvoice = remaining;
    if (type === 'full') numInvoice = remaining;

    if (!numTotal || numTotal <= 0) { alert('Введіть коректну загальну вартість'); return; }
    if (!numInvoice || numInvoice <= 0) { alert('Сума до сплати має бути більше 0'); return; }
    if (!details.trim()) { alert('Введіть реквізити для оплати'); return; }

    setSaving(true);
    try {
      const ref = doc(db, 'orders', order.id);
      await updateDoc(ref, {
        finalPrice: numTotal,
        currentInvoiceAmount: numInvoice,
        invoiceType: type,
        paymentMethod: method,
        paymentDetails: details.trim(),
        paymentStatus: 'awaiting_manual',
        updatedAt: new Date().toISOString(),
      });
      setInvoiceAmount(String(numInvoice));
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
    if (!confirm(`Підтвердити отримання ${order.currentInvoiceAmount.toLocaleString('uk-UA')} ₴?`)) return;
    
    const newPaid = paid + order.currentInvoiceAmount;
    const isFullyPaid = newPaid >= total;

    await updateDoc(doc(db, 'orders', order.id), {
      paidAmount: newPaid,
      paymentStatus: isFullyPaid ? 'fully_paid' : 'partially_paid',
      currentInvoiceAmount: 0, // Скидаємо поточний рахунок
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onUpdate();
  };

  const handleReject = async () => {
    if (!order.id) return;
    if (!confirm('Скасувати цей рахунок? Клієнт більше не бачитиме реквізитів.')) return;
    await updateDoc(doc(db, 'orders', order.id), {
      paymentStatus: 'cancelled',
      currentInvoiceAmount: 0,
      updatedAt: new Date().toISOString(),
    });
    onUpdate();
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
          <Landmark size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text)]">Фінанси проєкту</h3>
          <p className="text-xs text-[var(--text-3)]">Керування рахунками та оплатою</p>
        </div>
      </div>

      {/* Смуга прогресу */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--text-3)]">Сплачено: <strong className="text-[var(--text)]">{paid.toLocaleString('uk-UA')} ₴</strong></span>
          <span className="text-[var(--text-3)]">Всього: <strong className="text-[var(--text)]">{total.toLocaleString('uk-UA')} ₴</strong></span>
        </div>
        <div className="h-3 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        {remaining > 0 && (
          <div className="text-right text-xs font-bold text-[var(--accent)] mt-2">Залишилось сплатити: {remaining.toLocaleString('uk-UA')} ₴</div>
        )}
      </div>

      {/* Повідомлення про очікування підтвердження */}
      {order.paymentStatus === 'pending_confirmation' && order.currentInvoiceAmount && (
        <div className="mb-6 p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
          <div className="font-bold text-yellow-500 mb-3 flex items-center gap-2">
            <AlertCircle size={20} /> Клієнт каже, що сплатив {order.currentInvoiceAmount.toLocaleString('uk-UA')} ₴
          </div>
          <div className="flex gap-2">
            <Button onClick={handleConfirm} className="flex-1 !py-3 bg-green-500 hover:bg-green-600 border-none shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Check size={18} className="mr-2" /> Підтвердити
            </Button>
            <Button onClick={handleReject} variant="outline" className="flex-1 !py-3 border-red-500/30 text-red-500 hover:bg-red-500/10">
              <XCircle size={18} className="mr-2" /> Не надійшло
            </Button>
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
            <input type="text" inputMode="numeric" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xl font-bold text-[var(--accent)] focus:outline-none focus:border-[var(--accent)]" />
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button onClick={() => handleSave('prepayment')} disabled={saving || remaining <= 0} variant="outline" className="!py-2.5 !text-xs border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 text-[var(--accent)]">
                Виставити 50%
              </Button>
              <Button onClick={() => handleSave('final')} disabled={saving || remaining <= 0} variant="outline" className="!py-2.5 !text-xs border-[var(--border)]">
                Виставити залишок
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Спосіб оплати</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {methods.map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id)} className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${method === m.id ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-3)] hover:border-[var(--accent)]/50'}`}>
                  <m.icon size={16} /> {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Реквізити</label>
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder={methods.find((m) => m.id === method)?.placeholder} className="!bg-[var(--surface)] min-h-[100px] font-mono text-sm" />
          </div>

          <Button onClick={() => handleSave('full')} disabled={saving || remaining <= 0} className="w-full py-4 text-base rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)]">
            {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
            {saving ? 'Збереження...' : 'Показати рахунок клієнту'}
          </Button>
        </div>
      )}
    </div>
  );
}
