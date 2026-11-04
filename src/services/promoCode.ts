import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PromoCode } from '@/types/promoCode';

export async function getAllPromoCodes(): Promise<PromoCode[]> {
  const q = query(collection(db, 'promoCodes'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const list: PromoCode[] = [];
  snap.forEach((d) => list.push({ id: d.id, ...d.data() } as PromoCode));
  return list;
}

export async function createPromoCode(data: Omit<PromoCode, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'promoCodes'), {
    ...data,
    code: data.code.trim().toUpperCase(),
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updatePromoCode(id: string, data: Partial<PromoCode>): Promise<void> {
  await updateDoc(doc(db, 'promoCodes', id), data);
}

export async function deletePromoCode(id: string): Promise<void> {
  await deleteDoc(doc(db, 'promoCodes', id));
}

export async function getPromoCodeByCode(code: string): Promise<PromoCode | null> {
  const q = query(collection(db, 'promoCodes'), where('code', '==', code.trim().toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as PromoCode;
}

export interface PromoValidationResult {
  valid: boolean;
  promo?: PromoCode;
  discountAmount?: number;
  error?: string;
}

export async function validatePromoCode(code: string, orderAmount: number): Promise<PromoValidationResult> {
  if (!code.trim()) return { valid: false, error: 'Введіть промокод' };

  const promo = await getPromoCodeByCode(code);
  if (!promo) return { valid: false, error: 'Промокод не знайдено' };
  if (!promo.active) return { valid: false, error: 'Промокод неактивний' };

  if (promo.expiresAt) {
    const exp = new Date(promo.expiresAt).getTime();
    if (Date.now() > exp) return { valid: false, error: 'Термін дії промокоду закінчився' };
  }

  if (promo.minAmount && orderAmount < promo.minAmount) {
    return { valid: false, error: `Мінімальна сума замовлення для цього промокоду — ${promo.minAmount.toLocaleString('uk-UA')} ₴` };
  }

  if (promo.maxUses) {
    const usesQ = query(collection(db, 'orders'), where('promoCode', '==', promo.code));
    const usesSnap = await getDocs(usesQ);
    if (usesSnap.size >= promo.maxUses) {
      return { valid: false, error: 'Ліміт використань промокоду вичерпано' };
    }
  }

  const discountAmount = Math.round((orderAmount * promo.discountPercent) / 100);
  return { valid: true, promo, discountAmount };
}
