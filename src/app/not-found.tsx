'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { ArrowLeft, Search, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container py-24 min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Фонові плями */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

        <Reveal>
          <div className="relative text-center max-w-3xl mx-auto z-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-[var(--surface-2)] border border-[var(--border)] text-[var(--accent)] animate-float shadow-[0_0_30px_var(--accent)]">
                <Sparkles size={36} />
              </div>
            </div>

            <div className="text-[120px] md:text-[180px] font-bold leading-none tracking-tighter text-gradient-animated drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              404
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mt-6 mb-6 text-[var(--text)]">
              Ой! Сторінку не знайдено
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-3)] mb-12 max-w-lg mx-auto">
              Можливо, вона була переміщена, видалена або ви ввели неправильну адресу.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="w-full sm:w-auto px-8 py-4 rounded-full text-lg btn-tactile shadow-[0_0_20px_var(--accent)]">
                  <ArrowLeft size={20} className="mr-2" /> На головну
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-4 rounded-full text-lg btn-tactile border-[var(--border)] hover:bg-[var(--surface-2)]">
                  <Search size={20} className="mr-2" /> До каталогу
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
