'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllClients } from '@/services/admin';
import { AppUser } from '@/services/auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import { Search, Users, Mail, Calendar } from 'lucide-react';

export default function AdminClientsPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<AppUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          const data = await getAllClients();
          setClients(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [appUser]);

  if (loading || loadingData) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.displayName || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  });

  const getInitial = (c: AppUser) =>
    (c.displayName?.[0] || c.email?.[0] || 'U').toUpperCase();

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Клієнти
            </h1>
            <p className="text-[var(--text-muted)] mt-2">
              {clients.length} {clients.length === 1 ? 'користувач' : 'користувачів'}
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative md:max-w-sm mb-6">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
            />
            <input
              type="text"
              placeholder="Пошук за ім'ям або email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="card no-hover text-center py-14">
            <Users size={48} className="text-[var(--text-faint)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">
              {clients.length === 0 ? 'Користувачів поки немає.' : 'Нічого не знайдено.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((client, i) => (
              <Reveal key={client.uid} delay={i * 30}>
                <div
                  className="color-card"
                  style={
                    {
                      '--card-color-1': '#06B6D4',
                      '--card-color-2': '#14B8A6',
                      '--card-glow': 'rgba(6,182,212,0.5)',
                    } as React.CSSProperties
                  }
                >
                  <div className="color-card-inner">
                    <div className="color-card-content">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl text-white font-bold text-lg flex items-center justify-center shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #06B6D4, #14B8A6)',
                            boxShadow: '0 8px 20px -8px rgba(6,182,212,0.6)',
                          }}
                        >
                          {getInitial(client)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold truncate">
                              {client.displayName || 'Без імені'}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                client.role === 'admin'
                                  ? 'text-white'
                                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]'
                              }`}
                              style={
                                client.role === 'admin'
                                  ? {
                                      background:
                                        'linear-gradient(135deg, #8B5CF6, #A855F7)',
                                    }
                                  : {}
                              }
                            >
                              {client.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1.5 text-xs text-[var(--text-muted)] flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <Mail size={12} />
                              <span className="truncate">{client.email}</span>
                            </span>
                            {client.createdAt && (
                              <span className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                {new Date(client.createdAt).toLocaleDateString('uk-UA')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
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