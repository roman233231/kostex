'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const pathname = usePathname();

  if (!currentUser) return null;

  // Якщо ми на сторінці Білдера або Адмінки, піднімаємо кнопку вище
  const isBuilderOrAdmin = pathname === '/builder' || pathname?.startsWith('/admin');
  const bottomPosition = isBuilderOrAdmin ? 'bottom-28 md:bottom-24' : 'bottom-6';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${bottomPosition} right-6 z-[9000] group flex items-center gap-3 px-5 py-4 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white shadow-[0_10px_40px_rgba(139,92,246,0.5)] hover:shadow-[0_10px_50px_rgba(139,92,246,0.7)] hover:scale-105 transition-all duration-300 animate-glow`}
      >
        <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="font-bold hidden md:block">Чат з підтримкою</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-end p-4 md:p-6 bg-black/40 backdrop-blur-sm animate-slide-up">
          <div className="w-full max-w-md h-[80vh] md:h-[600px] bg-[var(--bg)] border border-[var(--border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
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

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[var(--bg)]">
              <div className="w-20 h-20 rounded-full bg-[var(--accent-soft)] flex items-center justify-center mb-4">
                <MessageCircle size={40} className="text-[var(--accent)]" />
              </div>
              <h4 className="text-lg font-bold text-[var(--text)] mb-2">Привіт! Чим можемо допомогти?</h4>
              <p className="text-sm text-[var(--text-3)] mb-6">
                Напишіть нам, і ми відповімо найближчим часом.
              </p>
              <a href="/account/messages" className="px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-bold hover:brightness-110 transition-all btn-tactile">
                Перейти до повідомлень
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
