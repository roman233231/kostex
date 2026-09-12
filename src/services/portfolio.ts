import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PortfolioItem } from '@/types/portfolio';

export async function getAllPortfolio(): Promise<PortfolioItem[]> {
  const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const items: PortfolioItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as PortfolioItem);
  });
  return items;
}

export async function getPublishedPortfolio(): Promise<PortfolioItem[]> {
  const q = query(
    collection(db, 'portfolio'),
    where('published', '==', true),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const items: PortfolioItem[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as PortfolioItem);
  });
  return items;
}

export async function getPortfolioById(id: string): Promise<PortfolioItem | null> {
  const docRef = doc(db, 'portfolio', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as PortfolioItem;
  }
  return null;
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioItem | null> {
  const q = query(collection(db, 'portfolio'), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as PortfolioItem;
  }
  return null;
}

export async function createPortfolioItem(itemData: Omit<PortfolioItem, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'portfolio'), {
    ...itemData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updatePortfolioItem(id: string, itemData: Partial<PortfolioItem>): Promise<void> {
  const docRef = doc(db, 'portfolio', id);
  await updateDoc(docRef, itemData);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const docRef = doc(db, 'portfolio', id);
  await deleteDoc(docRef);
}