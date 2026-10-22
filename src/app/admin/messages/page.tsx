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
import { Send, Check, CheckCheck, MessageSquare, Search, Shield } from 'lucide-react';

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
    if (!loading && (!currentUser || appUser?.role !== 'admin')) router.push('/account');
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
                displayName: data.displayName || 'Невідомий',
                email: data.email || '',
                initial: (data.displayName?.[0] || data.email?.[0] || 'U').toUpperCase(),
              });
            }
          } catch (err) { console.error(err); }
        }
      }
      setClients(newClients);
      if (!selectedUserId && convs.length > 0) setSelectedUserId(convs[0].userId);
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
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !currentUser || !selectedUserId) return;
    setSending(true);
    try {
      await sendSupportMessage({
        userId: selectedUserId, senderId: currentUser.uid,
        senderRole: 'admin', text: text.trim(),
      });
      setText('');
    } catch (err) { console.error(err); } finally { setSending(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (loading) {
    return (
      <div className="container py-32 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
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
    return client.displayName.toLowerCase().includes(q) || client.email.toLowerCase().includes(q);
  });

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 h-[calc(100vh-100px)] flex flex-col">
        <Reveal>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-[var(--text)]">
                Повідомлення
              </h1>
              <p className="text-[var(--text-3)]">Спілкування з клієнтами в реальному часі</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="flex-1 min-h-0">
          {conversations.length === 0 ? (
            <div className="glass-card rounded-[2rem] text-center py-20 h-full flex flex-col justify-center items-center">
              <MessageSquare size={48} className="text-[var(--text-4)] mb-4" />
              <h3 className="text-xl font-bold text-[var(--text)] mb-2">Немає розмов</h3>
              <p className="text-[var(--text-3)] max-w-sm">Коли клієнти напишуть через чат, їхні повідомлення з'являться тут.</p>
            </div>
          ) : (
            <div className="glass-card rounded-3xl overflow-hidden flex h-full border border-[var(--border)]">
              
              {/* ЛІВА ПАНЕЛЬ (Список чатів) */}
              <div className="w-full md:w-80 flex flex-col border-r border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md">
                <div className="p-4 border-b border-[var(--border)]">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" />
                    <input
                      type="text"
                      placeholder="Пошук клієнта..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  {filteredConvs.map((conv) => {
                    const client = clients.get(conv.userId);
                    const isActive = conv.userId === selectedUserId;
                    return (
                      <button
                        key={conv.userId}
                        onClick={() => setSelectedUserId(conv.userId)}
                        className={`w-full text-left p-4 border-b border-[var(--border)] transition-all flex items-center gap-3 relative overflow-hidden ${
                          isActive ? 'bg-[var(--accent)]/10' : 'hover:bg-[var(--surface-2)]'
                        }`}
                      >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />}
                        <div className="w-11 h-11 rounded-full text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                          {client?.initial || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className={`text-sm font-bold truncate ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}>
                              {client?.displayName || 'Завантаження...'}
                            </span>
                            {conv.unreadCount > 0 && (
                              <span className="min-w-[20px] h-5 px-1.5 rounded-full text-white text-[10px] font-bold flex items-center justify-center bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[var(--text-3)] truncate">
                            {conv.lastMessage.text}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ПРАВА ПАНЕЛЬ (Чат) */}
              <div className="hidden md:flex flex-1 flex-col bg-[var(--bg)]/50">
                {selectedClient ? (
                  <>
                    <div className="p-4 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--surface)]/80 backdrop-blur-sm z-10">
                      <div className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                        {selectedClient.initial}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text)] text-sm">{selectedClient.displayName}</div>
                        <div className="text-xs text-[var(--text-3)]">{selectedClient.email}</div>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Онлайн
                      </div>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-20 text-[var(--text-4)] text-sm">Ще немає повідомлень</div>
                      ) : (
                        messages.map((m) => {
                          const isAdmin = m.senderRole === 'admin';
                          return (
                            <div key={m.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                              <div className={`p-4 rounded-2xl max-w-[75%] shadow-sm ${
                                isAdmin 
                                  ? 'bg-[var(--accent)] text-white rounded-tr-sm' 
                                  : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-tl-sm'
                              }`}>
                                <div className="text-sm leading-relaxed">{m.text}</div>
                              </div>
                              <div className="text-[10px] font-medium text-[var(--text-4)] mt-1 px-1 flex items-center gap-1">
                                {new Date(m.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                                {isAdmin && <CheckIcon read={m.read} />}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          onKeyDown={handleKey}
                          placeholder="Напишіть повідомлення..."
                          className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                          disabled={sending}
                        />
                        <button
                          onClick={handleSend}
                          disabled={!text.trim() || sending}
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 transition-all hover:scale-105 disabled:opacity-50 btn-tactile shadow-[0_0_15px_var(--accent)]"
                          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-4">
                      <Shield size={32} className="text-[var(--text-4)]" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text)] mb-2">Оберіть розмову</h3>
                    <p className="text-sm text-[var(--text-3)]">Виберіть клієнта зі списку зліва, щоб почати спілкування.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
