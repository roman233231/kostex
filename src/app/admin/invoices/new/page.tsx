'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Reveal from '@/components/ui/Reveal';
import { createPaymentLink } from '@/services/paymentLink';
import { useAuth } from '@/context/AuthContext';
import { Copy, Check, Link2, Send, MessageCircle, Loader2, ArrowLeft, Wallet, CreditCard, Bitcoin, MoreHorizontal, Calculator } from 'lucide-react';

const methods = [
  { id: 'card', label: 'Картка', icon: CreditCard, placeholder: '4149 4999 0000 0000\nОтримувач: Іван Іванов' },
  { id: 'crypto', label: 'Крипта', icon: Bitcoin, placeholder: 'USDT (TRC20): TXxx...' },
  { id: 'paypal', label: 'PayPal', icon: Wallet, placeholder: 'paypal.me/kostex' },
  { id: 'other', label: 'Інше', icon: MoreHorizontal, placeholder: 'Посилання на оплату...' },
] as const;

export default function NewInvoicePage() {
  const router = useRouter();
  const { currentUser, appUser } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'card' | 'crypto' | 'paypal' | 'other'>('card');
  const [details, setDetails] = useState('');
  const [creating, setCreating] = useState(false);
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = appUser?.role === 'admin';
  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <main className="container py-32 text-center">
          <p className="text-[var(--text-3)]">Доступ лише для адміна.</p>
        </main>
        <Footer />
      </>
    );
  }

  const handleCreate = async () => {
    setError('');
    const numAmount = Number(amount.replace(/\D/g, ''));
    if (!numAmount || numAmount <= 0) { setError('Введіть коректну суму'); return; }
    if (!details.trim()) { setError('Введіть реквізити'); return; }

    setCreating(true);
    try {
      const token = await createPaymentLink({
        customerName: customerName.trim() || 'Клієнт',
        amount: numAmount,
        totalPrice: numAmount,
        paidAmountBefore: 0,
        invoiceType: 'full',
        paymentMethod: method,
        paymentDetails: details.trim(),
        productTitle: description.trim() || 'Рахунок на оплату',
      });
      const fullUrl = `${window.location.origin}/pay/${token}`;
      setLink(fullUrl);
    } catch (err) {
      console.error(err);
      setError('Помилка створення рахунку');
    } finally {
      setCreating(false);
    }
  };

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Рахунок на оплату: ${description || 'KOSTEX'}\nСума: ${Number(amount).toLocaleString('uk-UA')} ₴\n\nОплатити: ${link}`;

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen max-w-3xl">
        <Reveal>
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Назад
          </button>
        </Reveal>

        <Reveal delay={50}>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-[var(--text)]">Створити рахунок</h1>
            <p className="text-[var(--text-3)]">Згенеруйте посилання, яке можна надіслати будь-кому</p>
          </div>
        </Reveal>

        {link ? (
          <Reveal delay={100}>
            <div className="glass-card rounded-[2rem] p-8 md:p-10 border-green-500/30">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Check size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Посилання готове!</h2>
                <p className="text-sm text-[var(--text-3)]">Надішліть його клієнту в будь-який месенджер</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mb-6">
                <div className="text-xs font-bold text-[var(--text-4)] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Link2 size={14} /> Публічне посилання
                </div>
                <div className="flex items-center gap-2">
                  <input readOnly value={link} className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--text)]" />
                  <Button onClick={copyLink} className="!px-3 !py-2 shrink-0">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <a href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full py-3"><Send size={16} className="mr-2" /> Telegram</Button>
                </a>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full py-3"><MessageCircle size={16} className="mr-2" /> WhatsApp</Button>
                </a>
              </div>

              <Button onClick={() => { setLink(''); setCustomerName(''); setDescription(''); setAmount(''); setDetails(''); }} variant="outline" className="w-full">
                Створити ще один рахунок
              </Button>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={100}>
            <div className="glass-card rounded-[2rem] p-8 md:p-10">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2">
                  <span className="text-lg">⚠</span> {error}
                </div>
              )}

              <div className="space-y-5">
                <Input label="Ім'я клієнта (необов'язково)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Іван Петренко" />
                <Input label="Що оплачується (опис)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Розробка сайту для кав'ярні" />

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Сума (₴)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                    placeholder="5000"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-lg font-bold text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Спосіб оплати</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {methods.map((m) => (
                      <button key={m.id} onClick={() => setMethod(m.id)}
                        className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${method === m.id ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-3)]'}`}
                      >
                        <m.icon size={16} /> {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">Реквізити</label>
                  <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder={methods.find((m) => m.id === method)?.placeholder} className="!bg-[var(--surface)] min-h-[100px] font-mono text-sm" />
                </div>

                <Button onClick={handleCreate} disabled={creating} className="w-full py-4 text-base rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)]">
                  {creating ? <Loader2 size={18} className="animate-spin mr-2" /> : <Calculator size={18} className="mr-2" />}
                  {creating ? 'Створення...' : 'Згенерувати посилання на оплату'}
                </Button>
              </div>
            </div>
          </Reveal>
        )}
      </main>
      <Footer />
    </>
  );
}
