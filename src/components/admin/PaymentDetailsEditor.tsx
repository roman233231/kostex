'use client';

import { useState } from 'react';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types/order';
import { createPaymentLink, supersedeOldLink } from '@/services/paymentLink';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Wallet, CreditCard, Bitcoin, MoreHorizontal, Save, Loader2, Check, AlertCircle, XCircle, Landmark, Copy, ExternalLink, Send, MessageCircle, Link2 } from 'lucide-react';

const methods = [
  { id: 'card', label: 'Картка', icon: CreditCard, placeholder: '4149 4999 0000 0000\nОтримувач: Іван Іванов' },
  { id: 'crypto', label: 'Крипта', icon: Bitcoin, placeholder: 'USDT (TRC20): TXxx...' },
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
  const [copied, setCopied] = useState(false);

  const total = Number(totalPrice) || 0;
  const paid = order.paidAmount || 0;
  const remaining = total - paid;
  const progress = total > 0 ? Math.min((paid / total) * 100, 100) : 0;

  const paymentUrl = order.paymentToken
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://kostex.vercel.app'}/pay/${order.paymentToken}`
    : '';

  const copyLink = () => {
    if (!paymentUrl) return;
    navigator.clipboard.writeText(paymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateInvoice = async () => {
    if (!order.id) return;
    const numTotal = Number(totalPrice);
    let numInvoice = Number(invoiceAmount);

    if (invoiceType === 'prepayment') numInvoice = Math.round(numTotal / 2);
    if (invoiceType === 'final') numInvoice = remaining;
    if (invoiceType === 'full') numInvoice = remaining;

    if (!numTotal || numTotal <= 0) { alert('Введіть коректну загальну вартість'); return; }
    if (!numInvoice || numInvoice <= 0) { alert('Сума до сплати має бути більше 0'); return; }
    if (!details.trim()) { alert('Введіть реквізити для оплати'); return; }

    setSaving(true);
    try {
      await supersedeOldLink(order.paymentToken);
      const token = await createPaymentLink({
        orderId: order.id,
        userId: order.userId,
        amount: numInvoice,
        totalPrice: numTotal,
        paidAmountBefore: paid,
        invoiceType,
        paymentMethod: method,
        paymentDetails: details.trim(),
        productTitle: order.productTitle || 'Замовлення',
      });

      await updateDoc(doc(db, 'orders', order.id), {
        finalPrice: numTotal,
        currentInvoiceAmount: numInvoice,
        invoiceType,
        paymentMethod: method,
        paymentDetails: details.trim(),
        paymentStatus: 'awaiting_manual',
        paymentToken: token,
        updatedAt: new Date().toISOString(),
      });
      setInvoiceAmount(String(numInvoice));
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Помилка створення посилання');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (!order.id || !order.currentInvoiceAmount) return;
    if (!confirm(`Підтвердити отримання ${order.currentInvoiceAmount.toLocaleString('uk-UA')} ₴?`)) return;
    
    const newPaid = paid + order.currentInvoiceAmount;
    const isFullyPaid = newPaid >= total;
    const now = new Date().toISOString();
    const batch = writeBatch(db);

    batch.update(doc(db, 'orders', order.id), {
      paidAmount: newPaid,
      paymentStatus: isFullyPaid ? 'fully_paid' : 'partially_paid',
      currentInvoiceAmount: 0,
      paymentToken: null,
      paidAt: now,
      updatedAt: now,
    });

    if (order.paymentToken) {
      batch.update(doc(db, 'paymentLinks', order.paymentToken), { status: 'confirmed', confirmedAt: now });
    }
    await batch.commit();
    onUpdate();
  };

  const handleReject = async () => {
    if (!order.id) return;
    if (!confirm('Скасувати цей рахунок?')) return;
    const batch = writeBatch(db);
    batch.update(doc(db, 'orders', order.id), {
      paymentStatus: 'cancelled',
      currentInvoiceAmount: 0,
      paymentToken: null,
      updatedAt: new Date().toISOString(),
    });
    if (order.paymentToken) {
      batch.update(doc(db, 'paymentLinks', order.paymentToken), { status: 'rejected' });
    }
    await batch.commit();
    onUpdate();
  };

  const shareText = `Оплата замовлення: ${order.productTitle}\nСума: ${(order.currentInvoiceAmount || 0).toLocaleString('uk-UA')} ₴\n\nОплатити: ${paymentUrl}`;

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
          <Landmark size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text)]">Фінанси проєкту</h3>
          <p className="text-xs text-[var(--text-3)]">Створіть посилання і надішліть будь-кому</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--text-3)]">Сплачено: <strong className="text-[var(--text)]">{paid.toLocaleString('uk-UA')} ₴</strong></span>
          <span className="text-[var(--text-3)]">Всього: <strong className="text-[var(--text)]">{total.toLocaleString('uk-UA')} ₴</strong></span>
        </div>
        <div className="h-3 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        {remaining > 0 && (
          <div className="text-right text-xs font-bold text-[var(--accent)] mt-2">Залишилось: {remaining.toLocaleString('uk-UA')} ₴</div>
        )}
      </div>

      {order.paymentStatus === 'pending_confirmation' && order.currentInvoiceAmount && (
        <div className="mb-6 p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
          <div className="font-bold text-yellow-500 mb-3 flex items-center gap-2">
            <AlertCircle size={20} /> Клієнт каже, що сплатив {order.currentInvoiceAmount.toLocaleString('uk-UA')} ₴
          </div>
          <div className="flex gap-2">
            <Button onClick={handleConfirm} className="flex-1 !py-3 bg-green-500 hover:bg-green-600 border-none">
              <Check size={18} className="mr-2" /> Підтвердити
            </Button>
            <Button onClick={handleReject} variant="outline" className="flex-1 !py-3 border-red-500/30 text-red-500 hover:bg-red-500/10">
              <XCircle size={18} className="mr-2" /> Скасувати
            </Button>
          </div>
        </div>
      )}

      {paymentUrl && (order.paymentStatus === 'awaiting_manual' || order.paymentStatus === 'pending_confirmation') && (
        <div className="mb-6 p-5 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent-border)]">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-2 flex items-center gap-1">
            <Link2 size={14} /> Публічне посилання на оплату
          </div>
          <div className="flex items-center gap-2 mb-3">
            <input readOnly value={paymentUrl} className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text)]" />
            <Button onClick={copyLink} className="!px-3 !py-2 shrink-0">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a href={`https://t.me/share/url?url=${encodeURIComponent(paymentUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full !py-2 !text-xs"><Send size={14} className="mr-1" /> Telegram</Button>
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full !py-2 !text-xs"><MessageCircle size={14} className="mr-1" /> WhatsApp</Button>
            </a>
          </div>
        </div>
      )}

      {order.paymentStatus !== 'fully_paid' && order.paymentStatus !== 'pending_confirmation' && (
        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Загальна вартість (₴)</label>
            <input type="text" inputMode="numeric" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-lg font-bold text-[var(--text)] focus:outline-none focus:border-[var(--accent)]" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Тип рахунку</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => { setInvoiceType('prepayment'); setInvoiceAmount(String(Math.round(total / 2))); }} className={`py-2.5 rounded-xl border text-xs font-bold ${invoiceType === 'prepayment' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-3)]'}`}>50%</button>
              <button onClick={() => { setInvoiceType('final'); setInvoiceAmount(String(remaining)); }} className={`py-2.5 rounded-xl border text-xs font-bold ${invoiceType === 'final' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-3)]'}`}>Залишок</button>
              <button onClick={() => { setInvoiceType('full'); setInvoiceAmount(String(remaining)); }} className={`py-2.5 rounded-xl border text-xs font-bold ${invoiceType === 'full' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-3)]'}`}>Повна</button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Сума до сплати зараз (₴)</label>
            <input type="text" inputMode="numeric" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xl font-bold text-[var(--accent)] focus:outline-none focus:border-[var(--accent)]" />
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

          <Button onClick={handleCreateInvoice} disabled={saving} className="w-full py-4 text-base rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)]">
            {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
            {saving ? 'Створення...' : 'Згенерувати посилання на оплату'}
          </Button>
        </div>
      )}
    </div>
  );
}
