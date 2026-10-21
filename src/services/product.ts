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
import { Product } from '@/types/product';

export async function getAllProducts(): Promise<Product[]> {
  const q = query(collection(db, 'products'), orderBy('title', 'asc'));
  const querySnapshot = await getDocs(q);
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
}

export async function getPublishedProducts(): Promise<Product[]> {
  const q = query(
    collection(db, 'products'),
    where('published', '==', true),
    orderBy('title', 'asc')
  );
  const querySnapshot = await getDocs(q);
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(
    collection(db, 'products'),
    where('category', '==', category),
    where('published', '==', true),
    orderBy('title', 'asc')
  );
  const querySnapshot = await getDocs(q);
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(
    collection(db, 'products'),
    where('slug', '==', slug),
    where('published', '==', true)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Product;
  }
  return null;
}

export async function getProductById(productId: string): Promise<Product | null> {
  const docRef = doc(db, 'products', productId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
}

export async function createProduct(productData: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), productData);
  return docRef.id;
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<void> {
  const docRef = doc(db, 'products', productId);
  await updateDoc(docRef, productData);
}

export async function deleteProduct(productId: string): Promise<void> {
  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef);
}