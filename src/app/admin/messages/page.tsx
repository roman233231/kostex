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
import Reveal from '@/components/ui/Reveal';
import { Send, Check, CheckCheck, MessageSquare, Shield, Search } from 'lucide-react';

interface ClientInfo {
  uid: string;
  displayName: string;
  email: string;
  initial: string;
}

function CheckIcon({ read }: { read: boolean }) {
  if (!read) return <Check size={12} className="opacity-70" />;
  return <CheckCheck size={14} className="text-green-400" />;
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
  const [search, setSearch] = useState('');
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

  const filteredConvs = conversations.filter((c) => {
    if (!search) return true;
    const client = clients.get(c.userId);
    if (!client) return false;
    const q = search.toLowerCase();
    return (
      client.displayName.toLowerCase().includes(q) ||
      client.email.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Navbar />
      <main className="container py-8 md:py-12">
        <Reveal>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                  boxShadow: '0 8px 24px -8px rgba(139,92,246,0.6)',
                }}
              >
                <MessageSquare size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--purple-bright)]">
                Live Chat
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Повідомлення
            </h1>
          </div>
        </Reveal>

        {conversations.length === 0 ? (
          <div className="card no-hover text-center py-16">
            <MessageSquare size={48} className="text-[var(--text-faint)] mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Немає розмов</h2>
            <p className="text-[var(--text-muted)] text-sm">
              Коли клієнти пишуть через чат, розмови з'являться тут.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
            style={{ height: 'calc(100vh - 260px)', minHeight: '500px' }}
          >
            {/* LEFT */}
            <div className="border-r border-[var(--border)] flex flex-col overflow-hidden">
              <div className="p-3 border-b border-[var(--border)]">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
                  />
                  <input
                    type="text"
                    placeholder="Пошук..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--purple)] transition-colors"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConvs.map((conv) => {
                  const client = clients.get(conv.userId);
                  const isActive = conv.userId === selectedUserId;
                  return (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedUserId(conv.userId)}
                      className={`w-full text-left p-3 border-b border-[var(--border)] transition-colors flex items-center gap-3 ${
                        isActive
                          ? 'bg-[var(--purple-soft)] border-l-2 border-l-[var(--purple)]'
                          : 'hover:bg-[var(--surface-2)]'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full text-white font-semibold flex items-center justify-center shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                        }}
                      >
                        {client?.initial || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold truncate">
                            {client?.displayName || 'Loading...'}
                          </span>
                          {conv.unreadCount > 0 && (
                            <span
                              className="min-w-[20px] h-5 px-1.5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                              style={{
                                background: 'linear-gradient(135deg, #8B5CF6, #C026FF)',
                              }}
                            >
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

            {/* RIGHT */}
            <div className="md:col-span-2 flex flex-col overflow-hidden">
              {selectedClient ? (
                <>
                  <div
                    className="p-4 border-b border-[var(--border)] flex items-center gap-3"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(139,92,246,0.08), transparent)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full text-white font-semibold flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
                      }}
                    >
                      {selectedClient.initial}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">
                        {selectedClient.displayName}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] truncate">
                        {selectedClient.email}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Онлайн
                    </div>
                  </div>

                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5"
                  >
                    {messages.length === 0 ? (
                      <div className="text-center py-10 text-[var(--text-muted)] text-sm">
                        Ще немає повідомлень
                      </div>
                    ) : (
                      messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-3 rounded-xl max-w-[78%] ${
                            m.senderRole === 'admin'
                              ? 'self-end ml-auto text-white'
                              : 'bg-[var(--surface-2)] border border-[var(--border)] self-start'
                          }`}
                          style={
                            m.senderRole === 'admin'
                              ? {
                                  background:
                                    'linear-gradient(135deg, #8B5CF6, #C026FF)',
                                }
                              : {}
                          }
                        >
                          <div className="text-sm">{m.text}</div>
                          <div className="text-[10px] opacity-70 mt-1 flex items-center justify-end gap-1">
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
                      placeholder="Напишіть відповідь..."
                      className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--purple)] transition-colors"
                      disabled={sending}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!text.trim() || sending}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #C026FF)',
                        boxShadow: '0 6px 20px -6px rgba(139,92,246,0.6)',
                      }}
                      aria-label="Надіслати"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <Shield size={48} className="text-[var(--text-faint)] mb-4" />
                  <p className="text-[var(--text-muted)]">Оберіть розмову</p>
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