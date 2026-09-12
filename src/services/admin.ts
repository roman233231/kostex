import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types/order';
import { AppUser } from '@/services/auth';

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const orders: Order[] = [];
  querySnapshot.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() } as Order);
  });
  return orders;
}

export async function getAllClients(): Promise<AppUser[]> {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const clients: AppUser[] = [];
  querySnapshot.forEach((doc) => {
    clients.push({ ...doc.data() } as AppUser);
  });
  return clients;
}

export interface AdminStats {
  totalOrders: number;
  newOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalClients: number;
  totalRevenue: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [ordersSnap, usersSnap] = await Promise.all([
    getDocs(collection(db, 'orders')),
    getDocs(collection(db, 'users')),
  ]);

  const orders: Order[] = [];
  ordersSnap.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() } as Order);
  });

  const clients: AppUser[] = [];
  usersSnap.forEach((doc) => {
    clients.push({ ...doc.data() } as AppUser);
  });

  const totalOrders = orders.length;
  const newOrders = orders.filter(o => o.status === 'NEW').length;
  const activeOrders = orders.filter(o =>
    ['ACCEPTED', 'IN DEVELOPMENT', 'CLIENT REVIEW', 'REVISION'].includes(o.status)
  ).length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
  const totalClients = clients.filter(c => c.role === 'client').length;
  const totalRevenue = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + (o.finalPrice || o.estimatedPrice || 0), 0);

  return {
    totalOrders,
    newOrders,
    activeOrders,
    completedOrders,
    totalClients,
    totalRevenue,
  };
}