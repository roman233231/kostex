'use client';

import { useState } from 'react';
import { generateInvoice } from '@/services/order';
import { notifyAllAdmins } from '@/services/notification';
import { Order } from '@/types/order';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import {
  Copy, Check, Wallet, CreditCard, Bitcoin, MoreHorizontal,
  Link2, Loader2, Send, ExternalLink, MessageSquare, RefreshCw
} from 'lucide-react';

const methods = [
  { id: 'card', label: 'Картка', icon: CreditCard, placeholder: '4149 4999 0000 0000\nОтримувач: Іван Іванов' },
  { id: 'crypto', label: 'Крипта (NOWPayments)', icon: Bitcoin, placeholder: '' },
  { id: 'paypal', label: 'PayPal', icon: Wallet, placeholder: 'paypal@example.com' },
  { id: 'other', label: 'Інше', icon: MoreHorizontal, placeholder: 'Опишіть реквізити...' },
] as const;

export default function InvoiceGenerator({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [method, setMethod] = useState<'card' | 'crypto' | 'paypal' | 'other'>(order.paymentMethod as any || 'card');
  const [details, setDetails] = useState(order.paymentDetails || '');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState<string>(
    order.paymentToken ? `${typeof window !== 'undefined' ? window.location.origin : 'https://kostex.vercel.app'}/pay/${order.paymentToken}` : ''
  );
  const [nowpaymentsLink, setNowpaymentsLink] = useState<string>(order.paymentInvoiceUrl || '');

  const handleGenerateManual = async () => {
    if (!details.trim() || !order.id) return;
    setLoading(true);
    try {
      const token = await generateInvoice(order.id, method as any, details);
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

  const handleGenerateCrypto = async () => {
    if (!order.id) return;
    setLoading(true);
    try {
      const res = await fetch('/api/payments/nowpayments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.finalPrice || order.estimatedPrice,
          currency: 'usd',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'NOWPayments error');
      setNowpaymentsLink(data.invoice_url);
      await notifyAllAdmins('Крипто-рахунок створено', `Для замовлення #${order.id.slice(0, 8)} створено NOWPayments invoice`, `/admin/orders/${order.id}`);
      onUpdate();
    } catch (err: any) {
      console.error(err);
      alert('Помилка створення крипто-рахунку: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendToChat = async (paymentLink: string) => {
    if (!order.id || !paymentLink) return;
    try {
      await fetch('/api/chat/send-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, paymentLink, amount: order.finalPrice || order.estimatedPrice }),
      });
      alert('Посилання на оплату надіслано клієнту в чат замовлення!');
    } catch (err) {
      console.error(err);
      alert('Помилка надсилання в чат');
    }
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

          {method === 'crypto' ? (
            <div className="space-y-3">
              {nowpaymentsLink ? (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="text-xs font-bold text-green-500 mb-2 flex items-center gap-1"><Bitcoin size={14} /> NOWPayments Invoice</div>
                  <div className="flex items-center gap-2">
                    <input readOnly value={nowpaymentsLink} className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text)]" />
                    <Button onClick={() => copyLink(nowpaymentsLink)} className="!px-3 !py-2 shrink-0">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <a href={nowpaymentsLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full text-xs !py-2"><ExternalLink size={14} className="mr-1" /> Відкрити</Button>
                    </a>
                    <Button onClick={() => sendToChat(nowpaymentsLink)} className="flex-1 text-xs !py-2"><MessageSquare size={14} className="mr-1" /> В чат</Button>
                  </div>
                </div>
              ) : (
                <Button onClick={handleGenerateCrypto} disabled={loading} className="w-full py-3 rounded-xl btn-tactile">
                  {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Bitcoin size={16} className="mr-2" />}
                  {loading ? 'Створення...' : 'Згенерувати крипто-рахунок'}
                </Button>
              )}
              {nowpaymentsLink && (
                <Button variant="outline" onClick={handleGenerateCrypto} disabled={loading} className="w-full text-xs">
                  <RefreshCw size={14} className="mr-2" /> Створити новий invoice
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Реквізити</label>
                <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder={methods.find((m) => m.id === method)?.placeholder} className="!bg-[var(--surface)] min-h-[100px]" />
              </div>

              {link ? (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <div className="text-xs font-bold text-green-500 mb-2 flex items-center gap-1"><Link2 size={14} /> Посилання для клієнта</div>
                  <div className="flex items-center gap-2">
                    <input readOnly value={link} className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text)]" />
                    <Button onClick={() => copyLink(link)} className="!px-3 !py-2 shrink-0">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full text-xs !py-2"><ExternalLink size={14} className="mr-1" /> Відкрити</Button>
                    </a>
                    <Button onClick={() => sendToChat(link)} className="flex-1 text-xs !py-2"><MessageSquare size={14} className="mr-1" /> В чат</Button>
                  </div>
                </div>
              ) : (
                <Button onClick={handleGenerateManual} disabled={loading || !details.trim()} className="w-full py-3 rounded-xl btn-tactile">
                  {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Wallet size={16} className="mr-2" />}
                  {loading ? 'Генерація...' : 'Згенерувати рахунок'}
                </Button>
              )}
            </>
          )}

          {order.paymentToken && (
            <p className="text-[10px] text-[var(--text-4)] mt-3 text-center">Рахунок вже створено. Можете оновити реквізити та згенерувати нове посилання.</p>
          )}
        </>
      )}
    </div>
  );
}
