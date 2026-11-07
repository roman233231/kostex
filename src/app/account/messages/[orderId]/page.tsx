'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders } from '@/services/order';
import { getOrderMessages, sendMessage } from '@/services/message';
import { Order } from '@/types/order';
import { Message } from '@/types/message';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser || !orderId) return;
    const load = async () => {
      try {
        // Використовуємо getUserOrders замість getOrderById
        const orders = await getUserOrders(currentUser.uid);
        const foundOrder = orders.find(o => o.id === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
          const msgs = await getOrderMessages(orderId);
          setMessages(msgs);
        } else {
          router.push('/account/messages');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser, orderId, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !order) return;
    setSending(true);
    try {
      await sendMessage({
        orderId: orderId,
        userId: currentUser.uid,
        senderId: currentUser.uid,
        senderRole: 'client',
        text: newMessage.trim(),
        read: false,
      });
      const msgs = await getOrderMessages(orderId);
      setMessages(msgs);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-[var(--text-3)]">Завантаження...</div>;
  if (!order) return null;

  return (
    <div className="animate-slide-up flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[var(--border)]">
        <Link href="/account/messages" className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--accent)] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">Чат по проєкту</h1>
          <p className="text-sm text-[var(--text-3)]">{order.productTitle}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--surface-2)] rounded-2xl border border-[var(--border)]">
        {messages.length === 0 ? (
          <div className="text-center text-[var(--text-3)] py-10">Повідомлень ще немає. Напишіть перше!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isMe ? 'bg-[var(--accent)] text-white rounded-br-sm' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-bl-sm'}`}>
                  {msg.text}
                  <div className={`text-[10px] mt-1 ${isMe ? 'text-white/70' : 'text-[var(--text-4)]'}`}>
                    {new Date(msg.createdAt || '').toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="mt-4 flex gap-2">
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
          className="w-12 h-12 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center hover:brightness-110 disabled:opacity-50 transition-all shrink-0"
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}
