'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';

export default function MessagesPage() {
  const { t } = useLanguage();

  return (
    <div>
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t('account.messages')}</h1>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Card hover={false} className="text-center py-12">
          <div className="text-4xl mb-3">💬</div>
          <h2 className="text-lg font-semibold mb-2">{t('account.noMessages')}</h2>
          <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto mb-6">
            {t('account.noMessagesDesc')}
          </p>
          <Link href="/account/orders">
            <Button>{t('account.viewOrders')}</Button>
          </Link>
        </Card>
      </Reveal>
    </div>
  );
}