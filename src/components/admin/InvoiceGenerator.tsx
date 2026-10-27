'use client';

import { useState } from 'react';
import { generateInvoice } from '@/services/order';
import { notifyAllAdmins } from '@/services/notification';
import { Order } from '@/types/order';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Copy, Check, Wallet, CreditCard, Bitcoin, MoreHorizontal, Link2, Loader2 } from 'lucide-react';

const methods = [
  { id: 'card', label: 'Картка', icon: CreditCard, placeholder: '4149 4999 0000 0000\nОтримувач: Іван Іванов' },
  { id: 'crypto', label: 'Крипта (USDT, BTC)', icon: Bitcoin, placeholder: 'USDT (TRC20): TXxx...\nBTC: bc1...' },
  { id: 'paypal', label: 'PayPal', icon: Wallet, placeholder: 'paypal@example.com' },
  { id: 'other', label: 'Інше', icon: MoreHorizontal, placeholder: 'Опишіть реквізити...' },
] as const;

export default function InvoiceGenerator({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [method, setMethod] = useState<'card' | 'crypto' | 'paypal' | 'other'>('card');
  const [details, setDetails] = useState(order.paymentDetails || '');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState<string>(
    order.paymentToken ? `${typeof window !== 'undefined' ? window.location.origin : 'https://kostex.vercel.app'}/pay/${order.paymentToken}` : ''
  );

  const handleGenerate = async () => {
    if (!details.trim() || !order.id) return;
    setLoading(true);
    try {
      const token = await generateInvoice(order.id, method, details);
      const newLink = `${window.location.origin}/pay/${token}`;
      setLink(newLink);
      await notifyAllAdmins('Рахунок створено', `Для замовлення #${order.id.slice(0, 8)} згенеровано посилання на оплату`, `/admin/orders/${order.id}`);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Помилка генерації рахунку');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const amount = order.finalPrice || order.estimatedPrice;

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
          <Wallet size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text)]">Рахунок на оплату</h3>
          <p className="text-xs text-[var(--text-3)]">Сума: <strong className="text-[var(--text)]">{amount.toLocaleString('uk-UA')} ₴</strong></p>
        </div>
      </div>

      {order.paymentStatus === 'paid' ? (
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-500 font-semibold flex items-center gap-2">
          <Check size={18} /> Оплачено {order.paidAt ? new Date(order.paidAt).toLocaleString('uk-UA') : ''}
        </div>
      ) : (
        <>
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
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Реквізити</label>
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder={methods.find((m) => m.id === method)?.placeholder} className="!bg-[var(--surface)] min-h-[100px]" />
          </div>

          {link ? (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="text-xs font-bold text-green-500 mb-2 flex items-center gap-1"><Link2 size={14} /> Посилання для клієнта</div>
              <div className="flex items-center gap-2">
                <input readOnly value={link} className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text)]" />
                <Button onClick={copyLink} className="!px-3 !py-2 shrink-0">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
              <p className="text-[10px] text-[var(--text-3)] mt-2">Скопіюйте та надішліть клієнту в Telegram/Instagram.</p>
            </div>
          ) : (
            <Button onClick={handleGenerate} disabled={loading || !details.trim()} className="w-full py-3 rounded-xl btn-tactile">
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Wallet size={16} className="mr-2" />}
              {loading ? 'Генерація...' : 'Згенерувати рахунок'}
            </Button>
          )}

          {order.paymentToken && (
            <p className="text-[10px] text-[var(--text-4)] mt-3 text-center">Рахунок вже створено. Можете оновити реквізити та згенерувати нове посилання.</p>
          )}
        </>
      )}
    </div>
  );
}
