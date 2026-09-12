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

export default function AdminClientsPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<AppUser[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchClients = async () => {
        try {
          const data = await getAllClients();
          setClients(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingClients(false);
        }
      };
      fetchClients();
    }
  }, [appUser]);

  if (loading || loadingClients) {
    return <div className="container py-16 text-center">Loading...</div>;
  }

  if (!currentUser || appUser?.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Badge>Admin</Badge>
        <h1 className="text-4xl font-bold mt-4 mb-8">Clients</h1>

        {clients.length === 0 ? (
          <p className="text-white/60">No clients yet.</p>
        ) : (
          <div className="space-y-4">
            {clients.map(client => (
              <Card key={client.uid} hover={false}>
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{client.displayName || 'No name'}</h3>
                    <p className="text-sm text-white/60">{client.email}</p>
                    <p className="text-xs text-white/40 mt-1">
                      UID: {client.uid}
                    </p>
                    <p className="text-xs text-white/40">
                      Registered: {client.createdAt ? new Date(client.createdAt).toLocaleDateString('uk-UA') : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge>{client.role}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}