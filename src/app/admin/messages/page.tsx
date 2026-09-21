'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  subscribeToAllConversations,
  subscribeToConversationMessages,
  sendSupportMessage,
  markAdminReadMessages,
  SupportMessage,
  SupportConversation,
} from '@/services/support';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Reveal from '@/components/ui/Reveal';

interface ClientInfo {
  uid: string;
  displayName: string;
  email: string;
  initial: string;
}

function CheckIcon({ read }: { read: boolean }) {
  if (!read) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.7 }}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  return (
    <svg
      width="16"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: '#22C55E' }}
    >
      <polyline points="1 12 6 17 15 8" />
      <polyline points="9 12 14 17 23 8" />
    </svg>
  );
}

export default function AdminMessagesPage() {
  const { currentUser, appUser, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [clients, setClients] = useState<Map<string, ClientInfo>>(new Map());
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (!currentUser || appUser?.role !== 'admin')) {
      router.push('/account');
    }
  }, [currentUser, appUser, loading, router]);

  useEffect(() => {
    if (appUser?.role !== 'admin') return;
    const unsub = subscribeToAllConversations(async (convs) => {
      setConversations(convs);

      const newClients = new Map(clients);
      for (const conv of convs) {
        if (!newClients.has(conv.userId)) {
          try {
            const userSnap = await getDoc(doc(db, 'users', conv.userId));
            if (userSnap.exists()) {
              const data = userSnap.data();
              newClients.set(conv.userId, {
                uid: conv.userId,
                displayName: data.displayName || 'Unknown',
                email: data.email || '',
                initial: (data.displayName?.[0] || data.email?.[0] || 'U').toUpperCase(),
              });
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
      setClients(newClients);

      if (!selectedUserId && convs.length > 0) {
        setSelectedUserId(convs[0].userId);
      }
    });
    return () => unsub();
  }, [appUser]);

  useEffect(() => {
    if (!selectedUserId) return;
    const unsub = subscribeToConversationMessages(selectedUserId, setMessages);
    markAdminReadMessages(selectedUserId).catch(() => {});
    return () => unsub();
  }, [selectedUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !currentUser || !selectedUserId) return;
    setSending(true);
    try {
      await sendSupportMessage({
        userId: selectedUserId,
        senderId: currentUser.uid,
        senderRole: 'admin',
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

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--purple)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || appUser?.role !== 'admin') return null;

  const selectedClient = selectedUserId ? clients.get(selectedUserId) : null;

  return (
    <>
      <Navbar />
      <main className="container py-12">
        <Reveal>
          <div className="mb-8">
            <Badge>Admin</Badge>
            <h1 className="text-4xl font-bold mt-4 tracking-tight">Messages</h1>
            <p className="text-[var(--text-muted)] mt-2">
              Live support conversations with clients
            </p>
          </div>
        </Reveal>

        {conversations.length === 0 ? (
          <Card hover={false} className="text-center py-16">
            <div className="text-4xl mb-3">💬</div>
            <h2 className="text-lg font-semibold mb-2">No conversations yet</h2>
            <p className="text-[var(--text-muted)] text-sm">
              When clients send messages through the chat, they will appear here.
            </p>
          </Card>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
            style={{ height: 'calc(100vh - 260px)', minHeight: '500px' }}
          >
            {/* LEFT: conversations list */}
            <div className="border-r border-[var(--border)] flex flex-col overflow-hidden">
              <div className="p-3 border-b border-[var(--border)]">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                  Conversations ({conversations.length})
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => {
                  const client = clients.get(conv.userId);
                  const isActive = conv.userId === selectedUserId;
                  return (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedUserId(conv.userId)}
                      className={`w-full text-left p-3 border-b border-[var(--border)] transition-colors flex items-center gap-3 ${
                        isActive ? 'bg-[var(--purple)]/10' : 'hover:bg-[var(--surface-2)]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-white font-semibold flex items-center justify-center shrink-0">
                        {client?.initial || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold truncate">
                            {client?.displayName || 'Loading...'}
                          </span>
                          {conv.unreadCount > 0 && (
                            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--purple)] text-white text-[10px] font-bold flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                          {conv.lastMessage.text}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: chat */}
            <div className="md:col-span-2 flex flex-col overflow-hidden">
              {selectedClient ? (
                <>
                  <div className="p-4 border-b border-[var(--border)] flex items-center gap-3 bg-gradient-to-r from-[var(--purple)]/[0.05] to-transparent">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-white font-semibold flex items-center justify-center">
                      {selectedClient.initial}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">{selectedClient.displayName}</div>
                      <div className="text-xs text-[var(--text-muted)] truncate">
                        {selectedClient.email}
                      </div>
                    </div>
                  </div>

                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5"
                  >
                    {messages.length === 0 ? (
                      <div className="text-center py-10 text-[var(--text-muted)] text-sm">
                        No messages yet.
                      </div>
                    ) : (
                      messages.map((m) => (
                        <div
                          key={m.id}
                          className={`chat-bubble ${
                            m.senderRole === 'admin' ? 'client' : 'admin'
                          }`}
                        >
                          <div>{m.text}</div>
                          <div className="chat-bubble-time flex items-center justify-end gap-1">
                            {new Date(m.createdAt).toLocaleTimeString('uk-UA', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {m.senderRole === 'admin' && <CheckIcon read={m.read} />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-[var(--border)] flex gap-2 items-center">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Type a reply..."
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
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
                  Select a conversation
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}