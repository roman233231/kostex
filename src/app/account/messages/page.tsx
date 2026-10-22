'use client';

import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { MessageSquare, ArrowRight } from 'lucide-react';

export default function MessagesPage() {
  const { t } = useLanguage();

  return (
    <div className="animate-slide-up">
      <Reveal>
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            {t('account.messages')}
          </h1>
          <p className="text-lg text-[var(--text-3)]">Всі ваші чати з командою в одному місці</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="glass-card rounded-[2rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--accent)]/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 relative z-10 animate-float shadow-[0_15px_40px_-10px_var(--accent)]" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
            <MessageSquare size={40} />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 text-[var(--text)]">
            {t('account.noMessages')}
          </h2>
          <p className="text-base text-[var(--text-3)] max-w-md mx-auto mb-8 relative z-10">
            {t('account.noMessagesDesc')}
          </p>
          
          <Link href="/account/orders" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] font-bold hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all btn-tactile relative z-10">
            {t('account.viewOrders')} <ArrowRight size={18} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
