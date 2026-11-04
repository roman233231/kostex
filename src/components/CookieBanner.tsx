'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from './ui/Button';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-accepted');
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-accepted', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9500] p-4 bg-[var(--surface)] border-t border-[var(--border)] shadow-2xl">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-2)] text-center sm:text-left">
          Ми використовуємо cookies для покращення роботи сайту. Продовжуючи, ви погоджуєтесь з{' '}
          <Link href="/privacy" className="text-[var(--accent)] underline">політикою конфіденційності</Link>.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button onClick={accept} className="px-6 py-2.5 rounded-xl">Прийняти</Button>
        </div>
      </div>
    </div>
  );
}
