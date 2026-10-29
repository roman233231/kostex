'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; text: string; senderRole: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { currentUser } = useAuth();
  const pathname = usePathname();

  if (!currentUser) return null;

  const isBuilderOrAdmin = pathname === '/builder' || pathname?.startsWith('/admin');
  const bottomPosition = isBuilderOrAdmin ? 'bottom-28 md:bottom-24' : 'bottom-6';

  // Завантажуємо повідомлення, коли відкриваємо чат
  useEffect(() => {
    if (!isOpen || !currentUser) return;
    const load = async () => {
      const q = query(collection(db, 'supportMessages'), where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
      setMessages(msgs.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '')));
    };
    load();
  }, [isOpen, currentUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'supportMessages'), {
        userId: currentUser.uid,
        senderId: currentUser.uid,
        senderRole: 'client',
        text: newMessage.trim(),
        read: false,
        createdAt: new Date().toISOString(),
      });
      setNewMessage('');
      // Перезавантажуємо повідомлення
      const q = query(collection(db, 'supportMessages'), where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
      setMessages(msgs.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || '')));
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${bottomPosition} right-6 z-[9000] group flex items-center gap-3 px-5 py-4 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white shadow-[0_10px_40px_rgba(139,92,246,0.5)] hover:shadow-[0_10px_50px_rgba(139,92,246,0.7)] hover:scale-105 transition-all duration-300`}
      >
        <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="font-bold hidden md:block">Чат з підтримкою</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-end p-4 md:p-6 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md h-[80vh] md:h-[600px] bg-[var(--bg)] border border-[var(--border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text)]">Підтримка KOSTEX</h3>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Онлайн
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--text-3)] hover:text-red-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
              {messages.length === 0 ? (
                <div className="text-center py-10 text-[var(--text-3)] text-sm">
                  Напишіть нам, і ми відповімо найближчим часом.
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex ${m.senderRole === 'admin' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${m.senderRole === 'admin' ? 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]' : 'bg-[var(--accent)] text-white'}`}>
                      <p className="text-sm">{m.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-[var(--border)] bg-[var(--surface-2)] flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Напишіть повідомлення..."
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="w-12 h-12 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center hover:brightness-110 disabled:opacity-50 transition-all"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
