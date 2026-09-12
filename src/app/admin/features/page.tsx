'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllFeatures, deleteFeature } from '@/services/feature';
import { Feature } from '@/types/feature';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminFeaturesPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchFeatures = async () => {
        try {
          const data = await getAllFeatures();
          setFeatures(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingFeatures(false);
        }
      };
      fetchFeatures();
    }
  }, [appUser]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feature?')) return;
    try {
      await deleteFeature(id);
      setFeatures(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete feature');
    }
  };

  if (loading || loadingFeatures) {
    return <div className="container py-16 text-center">Loading...</div>;
  }

  if (!currentUser || appUser?.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Badge>Admin</Badge>
            <h1 className="text-4xl font-bold mt-4">Features</h1>
          </div>
          <Button href="/admin/features/new">Add Feature</Button>
        </div>

        {features.length === 0 ? (
          <p className="text-white/60">No features yet.</p>
        ) : (
          <div className="space-y-4">
            {features.map(feature => (
              <Card key={feature.id} hover={false}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{feature.name}</h3>
                    <p className="text-sm text-white/60">{feature.description}</p>
                    <p className="text-sm text-white/50">Price: {feature.price} ₴ | Time: {feature.estimatedTime}</p>
                    {!feature.active && <Badge className="mt-2">Inactive</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" href={`/admin/features/${feature.id}`}>Edit</Button>
                    <Button variant="outline" onClick={() => handleDelete(feature.id)}>Delete</Button>
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