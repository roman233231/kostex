'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

export default function MessagesPage() {
  return (
    <div>
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-[var(--text-muted)] mt-1">
            Chat with KOSTEX about your orders
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Card hover={false} className="text-center py-12">
          <div className="text-4xl mb-3">💬</div>
          <h2 className="text-lg font-semibold mb-2">No active conversations</h2>
          <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto mb-6">
            Messages are attached to orders. Open an order to start a conversation with us.
          </p>
          <Button href="/account/orders">View Orders</Button>
        </Card>
      </Reveal>
    </div>
  );
}