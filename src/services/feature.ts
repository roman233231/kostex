import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Feature } from '@/types/feature';

export async function getAllFeatures(): Promise<Feature[]> {
  const q = query(collection(db, 'features'), orderBy('name', 'asc'));
  const querySnapshot = await getDocs(q);
  const features: Feature[] = [];
  querySnapshot.forEach((doc) => {
    features.push({ id: doc.id, ...doc.data() } as Feature);
  });
  return features;
}

export async function getFeatureById(featureId: string): Promise<Feature | null> {
  const docRef = doc(db, 'features', featureId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Feature;
  }
  return null;
}

export async function createFeature(featureData: Omit<Feature, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'features'), featureData);
  return docRef.id;
}

export async function updateFeature(featureId: string, featureData: Partial<Feature>): Promise<void> {
  const docRef = doc(db, 'features', featureId);
  await updateDoc(docRef, featureData);
}

export async function deleteFeature(featureId: string): Promise<void> {
  const docRef = doc(db, 'features', featureId);
  await deleteDoc(docRef);
}