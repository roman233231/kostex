'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders, getAdminStats, AdminStats } from '@/services/admin';
import { Order } from '@/types/order';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Reveal from '@/components/ui/Reveal';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Tag,
  Zap,
  FolderTree,
  Image as ImageIcon,
  Users,
  Database,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

const adminLinks = [
  { href: '/admin/orders', label: 'Замовлення', icon: Package, color1: '#3B82F6', color2: '#06B6D4' },
  { href: '/admin/messages', label: 'Повідомлення', icon: MessageSquare, color1: '#8B5CF6', color2: '#A855F7' },
  { href: '/admin/reviews', label: 'Відгуки', icon: Star, color1: '#F0C265', color2: '#FFD98A' }, // НОВИЙ
  { href: '/admin/products', label: 'Продукти', icon: Tag, color1: '#EC4899', color2: '#F43F5E' },
  { href: '/admin/features', label: 'Функції', icon: Zap, color1: '#10B981', color2: '#14B8A6' },
  { href: '/admin/categories', label: 'Категорії', icon: FolderTree, color1: '#F59E0B', color2: '#F97316' },
  { href: '/admin/portfolio', label: 'Портфоліо', icon: ImageIcon, color1: '#D946EF', color2: '#A855F7' },
  { href: '/admin/clients', label: 'Клієнти', icon: Users, color1: '#06B6D4', color2: '#14B8A6' },
  { href: '/admin/seed', label: 'Seed Data', icon: Database, color1: '#F43F5E', color2: '#EC4899' },
];

const statusLabels: Record<string, string> = {
  'NEW': 'Нове',
  'REVIEW': 'На розгляді',
  'ACCEPTED': 'Прийнято',
  'IN DEVELOPMENT': 'В розробці',
  'CLIENT REVIEW': 'На перевірці',
  'REVISION': 'Доопрацювання',
  'COMPLETED': 'Завершено',
  'CANCELLED': 'Скасовано',
};

const statusColors: Record<string, { color1: string; color2: string; glow: string }> = {
  'NEW': { color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  'REVIEW': { color1: '#F59E0B', color2: '#F97316', glow: 'rgba(245,158,11,0.5)' },
  'ACCEPTED': { color1: '#06B6D4', color2: '#14B8A6', glow: 'rgba(6,182,212,0.5)' },
  'IN DEVELOPMENT': { color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  'CLIENT REVIEW': { color1: '#F97316', color2: '#F43F5E', glow: 'rgba(249,115,22,0.5)' },
  'REVISION': { color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  'COMPLETED': { color1: '#10B981', color2: '#14B8A6', glow: 'rgba(16,185,129,0.5)' },
  'CANCELLED': { color1: '#EF4444', color2: '#F43F5E', glow: 'rgba(239,68,68,0.5)' },
};

export default function AdminPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      const fetchData = async () => {
        try {
          const [ordersData, statsData] = await Promise.all([
            getAllOrders(),
            getAdminStats(),
          ]);
          setOrders(ordersData);
          setStats(statsData);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [appUser]);

  if (loading || loadingData) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  const statCards = stats
    ? [
        {
          label: 'Всього замовлень',
          value: stats.totalOrders,
          icon: Package,
          color1: '#3B82F6',
          color2: '#06B6D4',
          glow: 'rgba(59,130,246,0.5)',
        },
        {
          label: 'Нові',
          value: stats.newOrders,
          icon: AlertCircle,
          color1: '#F59E0B',
          color2: '#F97316',
          glow: 'rgba(245,158,11,0.5)',
        },
        {
          label: 'Активні',
          value: stats.activeOrders,
          icon: Clock,
          color1: '#8B5CF6',
          color2: '#A855F7',
          glow: 'rgba(139,92,246,0.5)',
        },
        {
          label: 'Завершені',
          value: stats.completedOrders,
          icon: CheckCircle,
          color1: '#10B981',
          color2: '#14B8A6',
          glow: 'rgba(16,185,129,0.5)',
        },
        {
          label: 'Клієнти',
          value: stats.totalClients,
          icon: Users,
          color1: '#06B6D4',
          color2: '#14B8A6',
          glow: 'rgba(6,182,212,0.5)',
        },
        {
          label: 'Дохід',
          value: `${stats.totalRevenue.toLocaleString('uk-UA')} ₴`,
          icon: DollarSign,
          color1: '#D946EF',
          color2: '#A855F7',
          glow: 'rgba(217,70,239,0.5)',
        },
      ]
    : [];

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <Reveal>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                  boxShadow: '0 8px 24px -8px rgba(139,92,246,0.6)',
                }}
              >
                <LayoutDashboard size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--purple-bright)]">
                Admin Panel
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Dashboard
            </h1>
          </div>
        </Reveal>

        {/* Quick admin links */}
        <Reveal delay={80}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="color-card group"
                  style={
                    {
                      '--card-color-1': link.color1,
                      '--card-color-2': link.color2,
                      '--card-glow': `${link.color1}88`,
                    } as React.CSSProperties
                  }
                >
                  <div className="color-card-inner !p-4">
                    <div className="color-card-content">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${link.color1}, ${link.color2})`,
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <span className="text-sm font-semibold">{link.label}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Reveal>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {statCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.label} delay={i * 50}>
                  <div
                    className="color-card h-full"
                    style={
                      {
                        '--card-color-1': s.color1,
                        '--card-color-2': s.color2,
                        '--card-glow': s.glow,
                      } as React.CSSProperties
                    }
                  >
                    <div className="color-card-inner">
                      <div className="color-card-content">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                            style={{
                              background: `linear-gradient(135deg, ${s.color1}, ${s.color2})`,
                              boxShadow: `0 8px 20px -8px ${s.glow}`,
                            }}
                          >
                            <Icon size={20} />
                          </div>
                          <TrendingUp size={16} className="text-[var(--text-faint)]" />
                        </div>
                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                          {s.label}
                        </div>
                        <div
                          className="text-2xl md:text-3xl font-bold leading-none"
                          style={{
                            background: `linear-gradient(135deg, ${s.color1}, ${s.color2})`,
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {s.value}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Recent orders */}
        <Reveal delay={300}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl md:text-2xl font-bold">Останні замовлення</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-[var(--purple-bright)] hover:underline"
            >
              Всі →
            </Link>
          </div>
        </Reveal>

        {orders.length === 0 ? (
          <p className="text-[var(--text-muted)]">Немає замовлень.</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order, i) => {
              const colors = statusColors[order.status] || statusColors.NEW;
              return (
                <Reveal key={order.id} delay={i * 40}>
                  <Link href={`/admin/orders/${order.id}`} className="block group">
                    <div
                      className="color-card"
                      style={
                        {
                          '--card-color-1': colors.color1,
                          '--card-color-2': colors.color2,
                          '--card-glow': colors.glow,
                        } as React.CSSProperties
                      }
                    >
                      <div className="color-card-inner">
                        <div className="color-card-content">
                          <div className="flex justify-between items-start gap-4 flex-wrap">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base font-semibold">
                                {order.productTitle || 'Замовлення'}
                              </h3>
                              <p className="text-xs text-[var(--text-faint)] mt-1">
                                #{order.id?.slice(0, 8)}
                              </p>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <span
                                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                                style={{
                                  background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`,
                                  boxShadow: `0 6px 16px -6px ${colors.glow}`,
                                }}
                              >
                                {statusLabels[order.status] || order.status}
                              </span>
                              <div className="text-sm font-bold">
                                {order.finalPrice
                                  ? `${order.finalPrice.toLocaleString('uk-UA')} ₴`
                                  : `${order.estimatedPrice.toLocaleString('uk-UA')} ₴`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}