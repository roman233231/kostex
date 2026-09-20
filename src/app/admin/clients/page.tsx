'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllClients } from '@/services/admin';
import { AppUser } from '@/services/auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

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
            <Badge>Admin</Badge>
            <h1 className="text-4xl font-bold mt-4 tracking-tight">Clients</h1>
            <p className="text-[var(--text-muted)] mt-2">
              {clients.length} {clients.length === 1 ? 'user' : 'users'} registered
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input md:max-w-sm"
            />
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <p className="text-[var(--text-muted)]">
            {clients.length === 0 ? 'No clients yet.' : 'No clients match your search.'}
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((client, i) => (
              <Reveal key={client.uid} delay={i * 30}>
                <Card hover={false}>
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-white font-semibold text-base flex items-center justify-center shrink-0">
                      {getInitial(client)}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold truncate">
                          {client.displayName || 'No name'}
                        </h3>
                        <Badge>{client.role}</Badge>
                      </div>
                      <p className="text-sm text-[var(--text-muted)] truncate mt-0.5">
                        {client.email}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="text-right hidden sm:block shrink-0">
                      <div className="text-xs text-[var(--text-faint)] uppercase tracking-wider">
                        Registered
                      </div>
                      <div className="text-sm text-[var(--text-muted)] mt-0.5">
                        {client.createdAt
                          ? new Date(client.createdAt).toLocaleDateString('uk-UA')
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}