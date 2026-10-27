'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types/order';
import { DeliveryLink } from '@/types/delivery';
import { addDeliveryLink, getOrderLinks, deleteDeliveryLink } from '@/services/delivery';
import { notifyAllAdmins } from '@/services/notification';
import Button from '@/components/ui/Button';
import { Code2, Plus, Trash2, ExternalLink, Loader2 } from 'lucide-react';

export default function DeliveryLinkPanel({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const { currentUser } = useAuth();
  const [links, setLinks] = useState<DeliveryLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    if (!order.id) return;
    try { setLinks(await getOrderLinks(order.id)); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [order.id]);

  const handleAdd = async () => {
    if (!title.trim() || !url.trim() || !order.id || !currentUser) return;
    setSaving(true);
    try {
      await addDeliveryLink(order.id, order.userId, currentUser.uid, title.trim(), url.trim(), description.trim());
      await notifyAllAdmins('Проєкт доставлено', `Замовлення #${order.id.slice(0, 8)} — ${title}`, `/admin/orders/${order.id}`);
      setTitle(''); setUrl(''); setDescription('');
      await load(); onUpdate();
    } catch (err) { console.error(err); alert('Помилка'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити це посилання?')) return;
    await deleteDeliveryLink(id);
    await load();
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[var(--border)]">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
          <Code2 size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text)]">Доставка проєкту</h3>
          <p className="text-xs text-[var(--text-3)]">Встав посилання на GitHub-репозиторій</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Назва (напр. 'Вихідний код (GitHub)')" className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/username/repo" className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] font-mono" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Інструкція (напр. 'Додайте клієнта в колаборатори')" className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]" />
        <Button onClick={handleAdd} disabled={saving || !title.trim() || !url.trim()} className="w-full py-3 rounded-xl btn-tactile shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-green-500 hover:bg-green-600 border-none">
          {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Plus size={16} className="mr-2" />}
          {saving ? 'Додавання...' : 'Додати репозиторій'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4 text-[var(--text-3)] text-sm">Завантаження...</div>
      ) : links.length === 0 ? (
        <div className="text-center py-6 text-[var(--text-4)] text-sm">Репозиторіїв ще немає</div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2">Доставлено ({links.length})</div>
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                <Code2 size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[var(--text)] truncate">{link.title}</div>
                {link.description && <div className="text-xs text-[var(--text-3)] truncate">{link.description}</div>}
                <div className="text-[10px] text-[var(--text-4)] mt-0.5">{new Date(link.createdAt).toLocaleString('uk-UA')}</div>
              </div>
              <div className="flex gap-1">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all">
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => handleDelete(link.id!)} className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
