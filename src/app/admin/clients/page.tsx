'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllClients } from '@/services/admin';
import { AppUser } from '@/services/auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import { Search, Users, Mail, Calendar, ShieldCheck } from 'lucide-react';

export default function AdminClientsPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<AppUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) router.push('/account');
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          const data = await getAllClients();
          setClients(data);
        } catch (err) { console.error(err); } finally { setLoadingData(false); }
      };
      fetchData();
    }
  }, [appUser]);

  if (loading || loadingData) {
    return (
      <div className="container py-32 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (c.displayName || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q);
  });

  const getInitial = (c: AppUser) => (c.displayName?.[0] || c.email?.[0] || 'U').toUpperCase();

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-[var(--text)]">
                База <span className="text-gradient-animated">Клієнтів</span>
              </h1>
              <p className="text-lg text-[var(--text-3)]">
                {clients.length} {clients.length === 1 ? 'користувач' : 'користувачів'} зареєстровано
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="glass-card rounded-3xl p-4 md:p-6 mb-8">
            <div className="relative w-full md:max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)]" />
              <input
                type="text"
                placeholder="Пошук за ім'ям або email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <Reveal delay={150}>
            <div className="glass-card rounded-[2rem] text-center py-20">
              <Users size={48} className="text-[var(--text-4)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[var(--text)] mb-2">Нічого не знайдено</h3>
              <p className="text-[var(--text-3)]">{clients.length === 0 ? 'Користувачів поки немає.' : 'Спробуйте змінити запит пошуку.'}</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((client, i) => (
              <Reveal key={client.uid} delay={i * 30}>
                <div className="glass-card rounded-2xl p-6 flex items-start gap-4 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.3)] transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-white shadow-lg text-xl font-bold" style={{ background: 'linear-gradient(135deg, #06B6D4, #14B8A6)' }}>
                    {getInitial(client)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-[var(--text)] truncate">{client.displayName || 'Без імені'}</h3>
                      {client.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                          <ShieldCheck size={12} /> Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--surface-2)] text-[var(--text-3)] border border-[var(--border)]">
                          Client
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 mt-3">
                      <div className="flex items-center gap-2 text-sm text-[var(--text-3)] truncate">
                        <Mail size={14} className="text-[var(--text-4)] shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      {client.createdAt && (
                        <div className="flex items-center gap-2 text-sm text-[var(--text-3)]">
                          <Calendar size={14} className="text-[var(--text-4)] shrink-0" />
                          <span>Реєстрація: {new Date(client.createdAt).toLocaleDateString('uk-UA')}</span>
                        </div>
                      )}
                    </div>
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
