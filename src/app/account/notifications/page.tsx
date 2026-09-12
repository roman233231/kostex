'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getUserNotifications,
  markAllRead,
  markNotificationRead,
} from '@/services/notification';
import { Notification } from '@/types/notification';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function NotificationsPage() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!currentUser) return;
    try {
      const data = await getUserNotifications(currentUser.uid);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [currentUser]);

  const handleMarkAll = async () => {
    if (!currentUser) return;
    await markAllRead(currentUser.uid);
    load();
  };

  const handleClickItem = async (n: Notification) => {
    if (n.id && !n.read) {
      await markNotificationRead(n.id);
      load();
    }
  };

  if (loading) {
    return <div className="text-white/60">Loading notifications...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {items.some((n) => !n.read) && (
          <Button variant="outline" onClick={handleMarkAll}>
            Mark all as read
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-white/60">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Link
              key={n.id}
              href={n.link || '/account/notifications'}
              onClick={() => handleClickItem(n)}
              className="block"
            >
              <Card
                hover={false}
                className={`cursor-pointer transition-colors ${
                  !n.read ? 'border-purple/40' : ''
                } hover:border-purple-bright`}
              >
                <div className="flex items-start gap-3">
                  {!n.read && (
                    <span className="mt-2 w-2 h-2 rounded-full bg-purple-bright flex-shrink-0"></span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold text-white/90">
                      {n.title}
                    </div>
                    <div className="text-sm text-white/60 mt-1">{n.message}</div>
                    <div className="text-xs text-white/40 mt-2">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString('uk-UA')
                        : ''}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}