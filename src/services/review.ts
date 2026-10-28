import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, limit, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Review } from '@/types/review';

export async function createReview(data: { userId: string; userName: string; userEmail?: string; orderId?: string; orderTitle?: string; rating: number; text: string; }): Promise<string> {
  const docRef = await addDoc(collection(db, 'reviews'), { ...data, approved: false, featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  return docRef.id;
}

export async function getApprovedReviews(limitCount?: number): Promise<Review[]> {
  const q = limitCount ? query(collection(db, 'reviews'), where('approved', '==', true), orderBy('createdAt', 'desc'), limit(limitCount)) : query(collection(db, 'reviews'), where('approved', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const reviews: Review[] = [];
  snap.forEach((d) => reviews.push({ id: d.id, ...d.data() } as Review));
  return reviews;
}

export async function getAllReviews(): Promise<Review[]> {
  const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const reviews: Review[] = [];
  snap.forEach((d) => reviews.push({ id: d.id, ...d.data() } as Review));
  return reviews;
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  const q = query(collection(db, 'reviews'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const reviews: Review[] = [];
  snap.forEach((d) => reviews.push({ id: d.id, ...d.data() } as Review));
  return reviews;
}

// Оновлена функція з фільтром по userId
export async function getReviewByOrderId(orderId: string, userId: string): Promise<Review | null> {
  const q = query(collection(db, 'reviews'), where('orderId', '==', orderId), where('userId', '==', userId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Review;
}

export async function getReviewById(id: string): Promise<Review | null> {
  const ref = doc(db, 'reviews', id);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() } as Review;
  return null;
}

export async function updateReview(id: string, data: Partial<Pick<Review, 'approved' | 'featured' | 'text' | 'rating'>>): Promise<void> {
  const ref = doc(db, 'reviews', id);
  await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, 'reviews', id));
}

export async function seedDemoReviews(): Promise<{ created: number; skipped: boolean }> {
  const existing = await getAllReviews();
  if (existing.some((r) => r.orderId?.startsWith('demo-'))) return { created: 0, skipped: true };

  const demoReviews = [
    { userId: 'demo-client-1', userName: 'Олена К.', userEmail: 'olena@example.com', orderId: 'demo-1', orderTitle: 'Сайт для кав’ярні', rating: 5, text: 'Дуже задоволена роботою! Сайт вийшов сучасним, швидким і зручним. Окрема подяка за уважність до деталей і оперативні правки.', approved: true, featured: true },
    { userId: 'demo-client-2', userName: 'Максим Т.', userEmail: 'maksym@example.com', orderId: 'demo-2', orderTitle: 'Telegram-бот для запису', rating: 4, text: 'Бот працює добре, клієнти записуються без проблем. Були дрібні нюанси з інтерфейсом, але все швидко виправили. Рекомендую.', approved: true, featured: false },
    { userId: 'demo-client-3', userName: 'Діана М.', userEmail: 'diana@example.com', orderId: 'demo-3', orderTitle: 'CRM для студії', rating: 5, text: 'Замовляли CRM для нашої студії. Все зробили вчасно, пояснили, як користуватися. Команда KOSTEX — професіонали своєї справи.', approved: true, featured: true }
  ];

  const now = new Date().toISOString();
  for (const r of demoReviews) {
    await setDoc(doc(db, 'reviews', r.orderId), { ...r, createdAt: now, updatedAt: now });
  }
  return { created: demoReviews.length, skipped: false };
}
