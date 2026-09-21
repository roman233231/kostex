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

function CheckIcon({ read }: { read: boolean }) {
  if (!read) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  return (
    <svg width="16" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#22C55E' }}>
      <polyline points="1 12 6 17 15 8" />
      <polyline points="9 12 14 17 23 8" />
    </svg>
  );
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
          <div className="chat-header">
            <div className="chat-avatar">K</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">KOSTEX Support</div>
              <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Online · Reply in ~5 min
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="chat-messages" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-[var(--purple-soft)] border border-[var(--purple)]/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👋</span>
                </div>
                <div className="font-semibold mb-1">Hi! How can we help?</div>
                <div className="text-sm text-[var(--text-muted)] max-w-[240px] mx-auto">
                  Ask us anything about your project, pricing, or features.
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

          <div className="chat-input-area">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Write a message..."
              className="chat-input"
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="chat-send"
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Open chat">
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {unread > 0 && !open && (
          <span className="chat-badge">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>
    </>
  );
}