'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllFeatures, deleteFeature } from '@/services/feature';
import { Feature } from '@/types/feature';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

export default function AdminFeaturesPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [features, setFeatures] = useState<Feature[]>([]);
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
          const data = await getAllFeatures();
          setFeatures(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [appUser]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feature?')) return;
    try {
      await deleteFeature(id);
      setFeatures((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  if (loading || loadingData) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  const filtered = features.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
  });

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <Reveal>
          <div className="flex justify-between items-start mb-8 gap-4 flex-wrap">
            <div>
              <Badge>Admin</Badge>
              <h1 className="text-4xl font-bold mt-4 tracking-tight">Features</h1>
            </div>
            <Button href="/admin/features/new">+ Add Feature</Button>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input md:max-w-sm"
            />
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <p className="text-[var(--text-muted)]">
            {features.length === 0 ? 'No features yet.' : 'No features match your search.'}
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((feature, i) => (
              <Reveal key={feature.id} delay={i * 30}>
                <Card hover={false}>
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold">{feature.name}</h3>
                        {!feature.active && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-faint)] border border-[var(--border)]">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-muted)] mt-1">
                        {feature.description}
                      </p>
                      <p className="text-xs text-[var(--text-faint)] mt-1">
                        {feature.price} ₴ · {feature.estimatedTime}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/admin/features/${feature.id}`}
                        className="px-3 py-1.5 rounded-md border border-[var(--border)] text-xs text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)] transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(feature.id!)}
                        className="px-3 py-1.5 rounded-md border border-[var(--border)] text-xs text-[var(--text-muted)] hover:border-red-500/40 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
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