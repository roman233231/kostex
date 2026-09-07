import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types/category';

export async function getAllCategories(): Promise<Category[]> {
  const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
  const querySnapshot = await getDocs(q);
  const categories: Category[] = [];
  querySnapshot.forEach((doc) => {
    categories.push({ id: doc.id, ...doc.data() } as Category);
  });
  return categories;
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const docRef = doc(db, 'categories', categoryId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Category;
  }
  return null;
}

export async function createCategory(categoryData: Omit<Category, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'categories'), categoryData);
  return docRef.id;
}

export async function updateCategory(categoryId: string, categoryData: Partial<Category>): Promise<void> {
  const docRef = doc(db, 'categories', categoryId);
  await updateDoc(docRef, categoryData);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const docRef = doc(db, 'categories', categoryId);
  await deleteDoc(docRef);
}