'use client';

import Link from 'next/link';
import Logo from './Logo';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, Send, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-[var(--border)] bg-[var(--surface)]/30 backdrop-blur-xl overflow-hidden">
      {/* Світіння на фоні футера */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent)]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Logo & Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <Logo size={40} className="w-10 h-10 transition-transform duration-500 group-hover:rotate-12" />
              <span className="text-2xl font-bold tracking-tight text-white">KOSTEX</span>
            </Link>
            <p className="text-[var(--text-3)] text-sm leading-relaxed mb-8 max-w-xs">
              Digital Products Studio — створюємо сайти, додатки та боти, які приносять прибуток.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all hover:-translate-y-1" aria-label="Website">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all hover:-translate-y-1" aria-label="Telegram">
                <Send size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] hover:text-white hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all hover:-translate-y-1" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Продукти</h3>
            <ul className="space-y-4">
              {['Сайти', 'Веб-додатки', 'Софт', 'Боти'].map((item) => (
                <li key={item}>
                  <Link href="/catalog" className="text-[var(--text-3)] text-sm hover:text-[var(--accent)] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Компанія</h3>
            <ul className="space-y-4">
              {[
                { name: 'Послуги', href: '/services' },
                { name: 'Ціни', href: '/pricing' },
                { name: 'Портфоліо', href: '/portfolio' },
                { name: 'Про нас', href: '/about' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[var(--text-3)] text-sm hover:text-[var(--accent)] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Більше</h3>
            <ul className="space-y-4">
              {[
                { name: 'Блог', href: '/blog' },
                { name: 'Натхнення', href: '/inspiration' },
                { name: 'Контакти', href: '/contact' },
                { name: 'Приватність', href: '/privacy' },
                { name: 'Умови', href: '/terms' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[var(--text-3)] text-sm hover:text-[var(--accent)] transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-4)] text-sm">
            © {currentYear} KOSTEX. Всі права захищені.
          </p>
          <Link href="/builder" className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:text-white transition-colors group">
            Створити проєкт <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
