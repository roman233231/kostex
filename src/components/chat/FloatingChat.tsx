'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import {
  sendSupportMessage,
  subscribeToSupportMessages,
  markClientReadMessages,
  SupportMessage,
} from '@/services/support';
import { Send, X, MessageCircle, Check, CheckCheck, Shield } from 'lucide-react';

function CheckIcon({ read }: { read: boolean }) {
  if (!read) {
    return <Check size={12} className="opacity-70" />;
  }
  return <CheckCheck size={14} className="text-green-400" />;
}

export default function FloatingChat() {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hidden =
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register') ||
    pathname?.startsWith('/admin');

  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToSupportMessages(currentUser.uid, setMessages);
    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (open && currentUser) {
      markClientReadMessages(currentUser.uid).catch(() => {});
    }
  }, [open, messages, currentUser]);

  if (!currentUser || hidden) return null;

  const unread = messages.filter((m) => m.senderRole === 'admin' && !m.read).length;

  const handleSend = async () => {
    if (!text.trim() || !currentUser) return;
    setSending(true);
    try {
      await sendSupportMessage({
        userId: currentUser.uid,
        senderId: currentUser.uid,
        senderRole: 'client',
        text: text.trim(),
      });
      setText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {open && (
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-avatar">
              <Shield size={20} className="text-white relative z-10" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Підтримка KOSTEX</div>
              <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Онлайн · Відповідь ~5 хв
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
              aria-label="Закрити"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-[var(--purple-soft)] border border-[var(--border-purple)] flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👋</span>
                </div>
                <div className="font-semibold mb-1">Вітаємо!</div>
                <div className="text-sm text-[var(--text-muted)] max-w-[240px] mx-auto leading-relaxed">
                  Запитайте нас про проєкт, ціни або функції. Відповідаємо швидко.
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`chat-bubble ${m.senderRole === 'client' ? 'client' : 'admin'}`}
                >
                  <div>{m.text}</div>
                  <div className="chat-bubble-time flex items-center justify-end gap-1">
                    {new Date(m.createdAt).toLocaleTimeString('uk-UA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {m.senderRole === 'client' && <CheckIcon read={m.read} />}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Напишіть повідомлення..."
              className="chat-input"
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="chat-send"
              aria-label="Надіслати"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
  className="chat-fab"
  onClick={() => setOpen(!open)}
  aria-label="Чат підтримки"
>
  {open ? <X size={26} strokeWidth={2.5} /> : <MessageCircle size={26} strokeWidth={2.5} />}
        {unread > 0 && !open && (
          <span className="chat-badge">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>
    </>
  );
}