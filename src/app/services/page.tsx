'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { serviceCategories } from '@/data/services';
import { ArrowRight, Clock } from 'lucide-react';

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16 md:py-24 min-h-screen">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge>Наші послуги</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-5 tracking-tight leading-[1.05]">
              Що ми <span className="text-gradient-animated">створюємо</span>
            </h1>
            <p className="text-lg text-[var(--text-3)] mt-5 max-w-2xl mx-auto">
              Оберіть послугу, щоб дізнатись деталі, терміни та що входить у роботу.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {serviceCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Reveal key={cat.id} delay={i * 40}>
                <Link href={`/services/${cat.id}`} className="block h-full">
                  <div className="glass-card rounded-3xl p-7 h-full flex flex-col group hover:border-[var(--accent)]/60 transition-colors duration-300 relative overflow-hidden cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-3xl group-hover:bg-[var(--accent)]/15 transition-colors" />
                    <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-6 border border-[var(--accent)]/20 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={26} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)] mb-2">{cat.name}</h3>
                    <p className="text-sm text-[var(--text-3)] mb-6 flex-1 leading-relaxed">{cat.desc}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-4)]">Вартість:</span>
                        <span className="font-bold text-[var(--text)]">
                          {cat.price > 0 ? `від ${cat.price.toLocaleString('uk-UA')} ₴` : 'За запитом'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-4)]">Термін:</span>
                        <span className="font-medium text-[var(--text-2)] flex items-center gap-1">
                          <Clock size={12} /> {cat.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] text-sm font-bold text-[var(--accent)]">
                      Детальніше
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
