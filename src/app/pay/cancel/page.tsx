'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { XCircle, ArrowRight } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <>
      <Navbar />
      <main className="container py-32 min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-[2rem] p-10 md:p-16 text-center max-w-lg border-red-500/30">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <XCircle size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-3">Оплату скасовано</h1>
          <p className="text-[var(--text-3)] mb-8">Ви можете спробувати ще раз або зв'язатися з нами для допомоги.</p>
          <Link href="/account/orders"><Button variant="outline" className="rounded-xl">До моїх замовлень <ArrowRight size={18} className="ml-2" /></Button></Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
