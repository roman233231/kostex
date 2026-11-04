'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { getManualInvoices } from '@/services/paymentLink';
import { PaymentLink } from '@/types/paymentLink';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { Plus, FileText, Check, Clock, XCircle, Copy, ExternalLink, Loader2, RotateCcw, Undo2 } from 'lucide-react';

export default function InvoicesPage() {
  const { appUser, loading } = useAuth();
  const [invoices, setInvoices] = useState<PaymentLink[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await getManualInvoices();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (appUser?.role === 'admin') load();
  }, [appUser]);

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/pay/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirm = async (inv: PaymentLink) => {
    if (!inv.id) return;
    if (!confirm(`Підтвердити оплату на суму ${inv.amount.toLocaleString('uk-UA')} ₴?`)) return;
    setProcessingId(inv.id);
    try {
      const now = new Date().toISOString();
      const batch = writeBatch(db);
      batch.update(doc(db, 'paymentLinks', inv.id), { status: 'confirmed', confirmedAt: now });

      if (inv.orderId) {
        const newPaid = (inv.paidAmountBefore || 0) + inv.amount;
        const isFullyPaid = newPaid >= inv.totalPrice;
        batch.update(doc(db, 'orders', inv.orderId), {
          paidAmount: newPaid,
          paymentStatus: isFullyPaid ? 'fully_paid' : 'partially_paid',
          currentInvoiceAmount: 0,
          paymentToken: null,
          paidAt: now,
          updatedAt: now,
        });
      }
      await batch.commit();
      await load();
    } catch (err) {
      console.error(err);
      alert('Помилка підтвердження');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (inv: PaymentLink) => {
    if (!inv.id) return;
    if (!confirm(`Скасувати рахунок на ${inv.amount.toLocaleString('uk-UA')} ₴?`)) return;
    setProcessingId(inv.id);
    try {
      const now = new Date().toISOString();
      const batch = writeBatch(db);
      batch.update(doc(db, 'paymentLinks', inv.id), { status: 'rejected' });
      if (inv.orderId) {
        batch.update(doc(db, 'orders', inv.orderId), {
          paymentStatus: 'cancelled',
          currentInvoiceAmount: 0,
          paymentToken: null,
          updatedAt: now,
        });
      }
      await batch.commit();
      await load();
    } catch (err) {
      console.error(err);
      alert('Помилка скасування');
    } finally {
      setProcessingId(null);
    }
  };

  // Скасувати підтвердження — повернути рахунок в "Очікує оплати"
  const handleUnconfirm = async (inv: PaymentLink) => {
    if (!inv.id) return;
    if (!confirm('Скасувати підтвердження? Рахунок повернеться в «Очікує оплати». Гроші в замовленні НЕ зміняться.')) return;
    setProcessingId(inv.id);
    try {
      const now = new Date().toISOString();
      const batch = writeBatch(db);
      batch.update(doc(db, 'paymentLinks', inv.id), { status: 'awaiting', confirmedAt: null });

      if (inv.orderId) {
        const newPaid = Math.max((inv.paidAmountBefore || 0), 0);
        const isFullyPaid = newPaid >= inv.totalPrice;
        batch.update(doc(db, 'orders', inv.orderId), {
          paidAmount: newPaid,
          paymentStatus: isFullyPaid ? 'fully_paid' : newPaid > 0 ? 'partially_paid' : 'awaiting_manual',
          currentInvoiceAmount: inv.amount,
          paymentToken: inv.id,
          updatedAt: now,
        });
      }
      await batch.commit();
      await load();
    } catch (err) {
      console.error(err);
      alert('Помилка');
    } finally {
      setProcessingId(null);
    }
  };

  // Повернення коштів — гроші повернено, сума в замовленні зменшується
  const handleRefund = async (inv: PaymentLink) => {
    if (!inv.id) return;
    if (!confirm(`Повернути кошти клієнту на ${inv.amount.toLocaleString('uk-UA')} ₴? Сума сплаченого в замовленні зменшиться.`)) return;
    setProcessingId(inv.id);
    try {
      const now = new Date().toISOString();
      const batch = writeBatch(db);
      batch.update(doc(db, 'paymentLinks', inv.id), { status: 'refunded', refundedAt: now });

      if (inv.orderId) {
        const newPaid = Math.max((inv.paidAmountBefore || 0), 0);
        const isFullyPaid = newPaid >= inv.totalPrice;
        batch.update(doc(db, 'orders', inv.orderId), {
          paidAmount: newPaid,
          paymentStatus: isFullyPaid ? 'fully_paid' : newPaid > 0 ? 'partially_paid' : 'pending',
          currentInvoiceAmount: 0,
          paymentToken: null,
          updatedAt: now,
        });
      }
      await batch.commit();
      await load();
    } catch (err) {
      console.error(err);
      alert('Помилка повернення');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="container py-32 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!appUser || appUser?.role !== 'admin') return null;

  const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
    awaiting: { label: 'Очікує оплати', color: 'text-blue-500', icon: Clock },
    pending_confirmation: { label: 'Очікує підтвердження', color: 'text-yellow-500', icon: Clock },
    confirmed: { label: 'Оплачено', color: 'text-green-500', icon: Check },
    rejected: { label: 'Відхилено', color: 'text-red-500', icon: XCircle },
    superseded: { label: 'Замінено', color: 'text-gray-500', icon: XCircle },
    refunded: { label: 'Повернуто', color: 'text-orange-500', icon: Undo2 },
  };

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-[var(--text)]">Рахунки</h1>
              <p className="text-lg text-[var(--text-3)]">Публічні посилання на оплату</p>
            </div>
            <Link href="/admin/invoices/new">
              <Button className="w-full md:w-auto px-6 py-3 rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)]">
                <Plus size={18} className="mr-2" /> Створити рахунок
              </Button>
            </Link>
          </div>
        </Reveal>

        {invoices.length === 0 ? (
          <Reveal delay={100}>
            <div className="glass-card rounded-[2rem] text-center py-20">
              <FileText size={48} className="text-[var(--text-4)] mx-auto mb-4" />
              <p className="text-[var(--text-3)]">Ще не створено жодного рахунку.</p>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv, i) => {
              const status = statusLabels[inv.status] || statusLabels.awaiting;
              const Icon = status.icon;
              const busy = processingId === inv.id;
              return (
                <Reveal key={inv.id} delay={i * 30}>
                  <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-[var(--text)]">{inv.productTitle}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--surface-2)] border border-[var(--border)] ${status.color}`}>
                            <Icon size={12} /> {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-3)] mb-2">Для: {inv.customerName || 'Клієнт'}</p>
                        <div className="text-base font-bold text-[var(--text)]">{inv.amount.toLocaleString('uk-UA')} ₴</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button onClick={() => copyLink(inv.id!)} variant="outline" className="!py-2.5 !px-4">
                          {copiedId === inv.id ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
                          {copiedId === inv.id ? 'Скопійовано' : 'Копіювати'}
                        </Button>
                        <a href={`/pay/${inv.id}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="!py-2.5 !px-4">
                            <ExternalLink size={16} className="mr-1" /> Відкрити
                          </Button>
                        </a>
                      </div>
                    </div>

                    {(inv.status === 'awaiting' || inv.status === 'pending_confirmation') && (
                      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[var(--border)]">
                        <Button onClick={() => handleConfirm(inv)} disabled={busy} className="flex-1 !py-3 bg-green-500 hover:bg-green-600 border-none">
                          {busy ? <Loader2 size={16} className="animate-spin mr-2" /> : <Check size={16} className="mr-2" />}
                          Підтвердити оплату
                        </Button>
                        <Button onClick={() => handleReject(inv)} disabled={busy} variant="outline" className="flex-1 !py-3 border-red-500/30 text-red-500 hover:bg-red-500/10">
                          <XCircle size={16} className="mr-2" /> Скасувати
                        </Button>
                      </div>
                    )}

                    {inv.status === 'confirmed' && (
                      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[var(--border)]">
                        <Button onClick={() => handleUnconfirm(inv)} disabled={busy} variant="outline" className="flex-1 !py-3 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10">
                          {busy ? <Loader2 size={16} className="animate-spin mr-2" /> : <RotateCcw size={16} className="mr-2" />}
                          Скасувати підтвердження
                        </Button>
                        <Button onClick={() => handleRefund(inv)} disabled={busy} variant="outline" className="flex-1 !py-3 border-orange-500/30 text-orange-500 hover:bg-orange-500/10">
                          <Undo2 size={16} className="mr-2" /> Повернути кошти
                        </Button>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
