'use client';

import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function DashboardPage() {
  const { appUser } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-white/60 mb-8">Welcome back, {appUser?.displayName || 'User'}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Badge>Active Projects</Badge>
          <div className="text-4xl font-bold mt-3">0</div>
          <p className="text-sm text-white/50 mt-1">No active projects yet.</p>
        </Card>
        <Card>
          <Badge>Orders</Badge>
          <div className="text-4xl font-bold mt-3">0</div>
          <p className="text-sm text-white/50 mt-1">No orders yet.</p>
        </Card>
        <Card>
          <Badge>Messages</Badge>
          <div className="text-4xl font-bold mt-3">0</div>
          <p className="text-sm text-white/50 mt-1">No unread messages.</p>
        </Card>
      </div>
    </div>
  );
}