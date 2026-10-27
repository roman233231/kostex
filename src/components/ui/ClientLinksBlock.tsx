'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types/order';
import { DeliveryLink } from '@/types/delivery';
import { getOrderLinks } from '@/services/delivery';
import { Code2, ExternalLink } from 'lucide-react';

export default function ClientLinksBlock({ order }: { order: Order }) {
  const [links, setLinks] = useState<DeliveryLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!order.id) return;
    const load = async () => {
      try { setLinks(await getOrderLinks(order.id!)); }
      catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, [order.id]);

  if (loading || links.length === 0) return null;

  return (
    <div className="glass-card rounded-[2rem] p-6 md:p-8 border-green-500/20 mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border)] relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
          <Code2 size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--text)]">Вихідний код</h3>
          <p className="text-sm text-[var(--text-3)]">Ваш проєкт доступний на GitHub</p>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {links.map((link) => (
          <div key={link.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                <Code2 size={22} />
              </div>
              <div className="min-w-0">
                <div className="text-base font-bold text-[var(--text)] truncate">{link.title}</div>
                {link.description && <div className="text-sm text-[var(--text-3)] truncate">{link.description}</div>}
              </div>
            </div>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#24292e] hover:bg-black text-white text-sm font-bold transition-all shadow-lg btn-tactile shrink-0 w-full sm:w-auto">
              <ExternalLink size={16} /> Відкрити на GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
