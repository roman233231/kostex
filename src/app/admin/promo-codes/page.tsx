'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllPromoCodes, createPromoCode, updatePromoCode, deletePromoCode } from '@/services/promoCode';
import { PromoCode } from '@/types/promoCode';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Trash2, Check, X, Tag, Percent, Calendar, Hash, Copy } from 'lucide-react';

export default function PromoCodesPage() {
  const { currentUser, appUser, loading } = useAuth();
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form fields
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await getAllPromoCodes();
      setPromos(data);
    } catch (err) { console.error(err); } finally { setLoadingData(false); }
  };

  useEffect(() => {
    if (appUser?.role === 'admin') load();
  }, [appUser]);

  const handleCreate = async () => {
    setError('');
    const d = Number(discount);
    if (!code.trim()) { setError('Введіть код'); return; }
    if (!d || d < 1 || d > 90) { setError('Знижка має бути від 1 до 90%'); return; }
    if (!currentUser) return;
    setCreating(true);
    try {
      await createPromoCode({
        code: code.trim().toUpperCase(),
        discountPercent: d,
        maxUses: maxUses ? Number(maxUses) : undefined,
        minAmount: minAmount ? Number(minAmount) : undefined,
        active: true,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        createdBy: currentUser.uid,
      });
      setCode(''); setDiscount(''); setMaxUses(''); setMinAmount(''); setExpiresAt('');
      setShowForm(false);
      await load();
    } catch (err: any) {
      setError(err.message || 'Помилка');
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (p: PromoCode) => {
    if (!p.id) return;
    await updatePromoCode(p.id, { active: !p.active });
    await load();
  };

  const handleDelete = async (p: PromoCode) => {
    if (!p.id) return;
    if (!confirm(`Видалити промокод ${p.code}?`)) return;
    await deletePromoCode(p.id);
    await load();
  };

  const copyCode = (p: PromoCode) => {
    navigator.clipboard.writeText(p.code);
    setCopiedId(p.id || null);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (loading || loadingData) return <div className="container py-32 flex items-center justify-center min-h-screen"><div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" /></div>;
  if (!currentUser || appUser?.role !== 'admin') return null;

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-[var(--text)]">Промокоди</h1>
              <p className="text-lg text-[var(--text-3)]">Коди на знижку для клієнтів</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="w-full md:w-auto px-6 py-3 rounded-xl btn-tactile shadow-[0_0_20px_var(--accent)]">
              <Plus size={18} className="mr-2" /> {showForm ? 'Скасувати' : 'Створити промокод'}
            </Button>
          </div>
        </Reveal>

        {showForm && (
          <Reveal delay={50}>
            <div className="glass-card rounded-3xl p-6 md:p-8 mb-8">
              <h2 className="text-lg font-bold mb-5 text-[var(--text)]">Новий промокод</h2>
              {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Код (латиниця, цифри)" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="KOSTEX10" />
                <Input label="Знижка (%)" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="10" />
                <Input label="Макс. використань (необов'язково)" type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="100" />
                <Input label="Мін. сума (₴, необов'язково)" type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder="5000" />
                <Input label="Діє до (необов'язково)" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              </div>
              <Button onClick={handleCreate} disabled={creating} className="mt-5 px-8 py-3 rounded-xl btn-tactile">
                {creating ? 'Створення...' : 'Створити'}
              </Button>
            </div>
          </Reveal>
        )}

        {promos.length === 0 ? (
          <Reveal delay={100}>
            <div className="glass-card rounded-[2rem] text-center py-20">
              <Tag size={48} className="text-[var(--text-4)] mx-auto mb-4" />
              <p className="text-[var(--text-3)]">Ще не створено жодного промокоду.</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promos.map((p, i) => (
              <Reveal key={p.id} delay={i * 40}>
                <div className={`glass-card rounded-2xl p-5 flex flex-col gap-3 ${!p.active ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                        <Percent size={18} />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-lg text-[var(--text)]">{p.code}</div>
                        <div className="text-xs text-[var(--text-3)]">-{p.discountPercent}%</div>
                      </div>
                    </div>
                    <button onClick={() => copyCode(p)} className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)]">
                      {copiedId === p.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-[var(--text-3)]">
                    {p.maxUses && <div className="flex items-center gap-1"><Hash size={12} /> Ліміт: {p.maxUses}</div>}
                    {p.minAmount && <div>Мін. сума: {p.minAmount.toLocaleString('uk-UA')} ₴</div>}
                    {p.expiresAt && <div className="flex items-center gap-1"><Calendar size={12} /> До {new Date(p.expiresAt).toLocaleDateString('uk-UA')}</div>}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                    <button onClick={() => toggleActive(p)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${p.active ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                      {p.active ? 'Деактивувати' : 'Активувати'}
                    </button>
                    <button onClick={() => handleDelete(p)} className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
