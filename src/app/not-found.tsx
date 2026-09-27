'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container py-24 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
        <div className="grid-bg" />

        {/* Colorful glows */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.15), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="relative text-center max-w-2xl">
          <div className="text-[120px] md:text-[180px] font-bold leading-none tracking-tighter gradient-text">
            404
          </div>

          <h1 className="text-2xl md:text-4xl font-bold mt-4 mb-4">
            Сторінку не знайдено
          </h1>

          <p className="text-[var(--text-muted)] text-lg mb-10 max-w-md mx-auto">
            Можливо, вона була переміщена або видалена.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="btn-lg">
                <ArrowLeft size={18} /> На головну
              </Button>
            </Link>
            <Link href="/catalog">
              <Button variant="outline" className="btn-lg">
                <Search size={18} /> Каталог
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}