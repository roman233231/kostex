'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

export default function DashboardPage() {
  const { appUser } = useAuth();

  return (
    <div>
      <Reveal>
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {appUser?.displayName?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            Here's what's happening with your projects.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Reveal delay={0}>
          <Card hover={false}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider">
                Active Projects
              </span>
              <span className="text-xl">📊</span>
            </div>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-[var(--text-faint)] mt-1">No active projects yet.</p>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card hover={false}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider">
                Orders
              </span>
              <span className="text-xl">📦</span>
            </div>
            <div className="text-3xl font-bold">0</div>
            <Link
              href="/account/orders"
              className="text-sm text-[var(--purple)] mt-1 inline-block hover:underline"
            >
              View all orders →
            </Link>
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card hover={false}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider">
                Notifications
              </span>
              <span className="text-xl">🔔</span>
            </div>
            <div className="text-3xl font-bold">0</div>
            <Link
              href="/account/notifications"
              className="text-sm text-[var(--purple)] mt-1 inline-block hover:underline"
            >
              View notifications →
            </Link>
          </Card>
        </Reveal>
      </div>

      <Reveal delay={240}>
        <div className="mt-10">
          <Card hover={false} className="text-center py-12">
            <div className="text-4xl mb-3">🚀</div>
            <h2 className="text-xl font-semibold mb-2">Start your first project</h2>
            <p className="text-[var(--text-muted)] mb-5 max-w-md mx-auto">
              Configure your digital product, choose features, and place an order in minutes.
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] text-white font-semibold text-sm hover:brightness-110 transition"
            >
              Open Builder
            </Link>
          </Card>
        </div>
      </Reveal>
    </div>
  );
}