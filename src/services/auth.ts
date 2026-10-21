
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Тип для користувача з роллю
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'client' | 'admin';
  createdAt?: string;
}
export async function updateUserProfile(displayName: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  await updateProfile(user, { displayName });
  await setDoc(doc(db, 'users', user.uid), { displayName }, { merge: true });
}

// Реєстрація нового користувача
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AppUser> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Оновлюємо профіль
  await updateProfile(user, { displayName: name });

  // Створюємо документ у Firestore
  const userData: AppUser = {
    uid: user.uid,
    email: user.email,
    displayName: name,
    role: 'client',
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', user.uid), userData);

  return userData;
}

// Вхід
export async function loginUser(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Вихід
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Скидання пароля
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// Отримати додаткові дані користувача з Firestore
export async function getUserData(uid: string): Promise<AppUser | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as AppUser;
  }
  return null;
}