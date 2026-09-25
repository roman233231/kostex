'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import {
  seedProducts,
  seedPortfolio,
  seedFeatures,
  seedCategories,
} from '@/data/seedData';

export default function SeedPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') {
    return null;
  }

  const addLog = (msg: string) => {
    setLog((prev) => [...prev, msg]);
  };

  const clearCollection = async (collectionName: string): Promise<number> => {
    const snap = await getDocs(collection(db, collectionName));
    if (snap.empty) return 0;
    const batch = writeBatch(db);
    let count = 0;
    snap.forEach((d) => {
      batch.delete(d.ref);
      count++;
    });
    await batch.commit();
    return count;
  };

  const handleSeed = async () => {
    if (!confirm('Це видалить усі існуючі продукти/портфоліо/функції/категорії та додасть демо-дані. Продовжити?')) {
      return;
    }
    setSeeding(true);
    setLog([]);
    setDone(false);

    try {
      addLog('🧹 Очищаю старі дані...');
      await clearCollection('products');
      await clearCollection('portfolio');
      await clearCollection('features');
      await clearCollection('categories');
      addLog('✓ Старі дані видалено');

      addLog('📂 Додаю категорії...');
      for (const cat of seedCategories) {
        await addDoc(collection(db, 'categories'), cat);
      }
      addLog(`✓ Додано ${seedCategories.length} категорій`);

      addLog('📦 Додаю продукти...');
      for (const p of seedProducts) {
        await addDoc(collection(db, 'products'), p);
      }
      addLog(`✓ Додано ${seedProducts.length} продуктів`);

      addLog('🎨 Додаю портфоліо...');
      for (const item of seedPortfolio) {
        await addDoc(collection(db, 'portfolio'), {
          ...item,
          createdAt: new Date().toISOString(),
        });
      }
      addLog(`✓ Додано ${seedPortfolio.length} кейсів портфоліо`);

      addLog('⚡ Додаю функції...');
      for (const f of seedFeatures) {
        await addDoc(collection(db, 'features'), f);
      }
      addLog(`✓ Додано ${seedFeatures.length} функцій`);

      addLog('');
      addLog('🎉 Готово! Дані успішно завантажено.');
      setDone(true);
    } catch (err: any) {
      console.error(err);
      addLog(`❌ Помилка: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-12 max-w-3xl">
        <Reveal>
          <div className="mb-8">
            <Badge>Admin</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 tracking-tight">
              Seed Demo Data
            </h1>
            <p className="text-[var(--text-muted)] mt-3">
              Заповнює Firestore демо-даними: 6 продуктів, 6 кейсів портфоліо, 10 функцій, 4 категорії.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <Card hover={false} className="mb-6 border-yellow-500/30 bg-yellow-500/[0.03]">
            <div className="flex gap-3">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <div className="font-semibold mb-1 text-sm">Увага</div>
                <p className="text-sm text-[var(--text-muted)]">
                  Ця дія <strong className="text-[var(--text)]">видалить усі існуючі</strong> продукти,
                  портфоліо, функції та категорії, і замінить їх демо-даними. Замовлення та
                  користувачі залишаться без змін.
                </p>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card hover={false}>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-2">
                  Буде додано:
                </div>
                <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                  <li>📦 6 продуктів (Auto Service, Restaurant, Fitness, CRM, Booking, Bot)</li>
                  <li>🎨 6 кейсів портфоліо (з зображеннями з Unsplash)</li>
                  <li>⚡ 10 функцій для конструктора</li>
                  <li>📂 4 категорії</li>
                </ul>
              </div>

              <Button
                onClick={handleSeed}
                disabled={seeding}
                className="w-full sm:w-auto"
              >
                {seeding ? '⏳ Завантажую...' : '🚀 Завантажити демо-дані'}
              </Button>

              {log.length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-black/40 border border-[var(--border)] font-mono text-xs text-[var(--text-secondary)] max-h-80 overflow-y-auto">
                  {log.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))}
                </div>
              )}

              {done && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--border)]">
                  <Button onClick={() => router.push('/catalog')}>
                    Переглянути каталог →
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/portfolio')}>
                    Переглянути портфоліо →
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/admin')}>
                    До адмінки
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}