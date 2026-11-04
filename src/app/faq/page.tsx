'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { MessageCircle, Send, ArrowRight, HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'Скільки коштує розробка сайту?', a: 'Ціна залежить від складності. Орієнтовна вартість — від 5 000 ₴ за лендінг. Точну ціну ви побачите в конструкторі після вибору всіх параметрів.' },
  { q: 'Скільки часу займає розробка?', a: 'Лендінг — 3–7 днів, корпоративний сайт — 7–14 днів, складні проєкти — від 2 тижнів. Терміни залежать від обсягу робіт.' },
  { q: 'Чи можна оплатити частинами?', a: 'Так, ми працюємо за схемою 50% передоплата та 50% після завершення. Також можлива повна оплата одразу.' },
  { q: 'Які способи оплати ви приймаєте?', a: 'Банківські картки (Visa, Mastercard), Apple Pay, Google Pay, криптовалюта (USDT, BTC, ETH) та PayPal.' },
  { q: 'Чи отримаю я вихідний код?', a: 'Так, після повної оплати ви отримуєте доступ до GitHub-репозиторію з усім кодом.' },
  { q: 'Чи є гарантія?', a: 'Так, ми надаємо 7 днів безкоштовної підтримки після запуску для виправлення дрібних помилок.' },
  { q: 'Чи можете ви доопрацювати існуючий сайт?', a: 'Так, ми беремося за доопрацювання, редизайн та оптимізацію існуючих проєктів. Зв’яжіться з нами для оцінки.' },
  { q: 'Як замовити?', a: 'Перейдіть у конструктор, оберіть параметри, залиште контакт — і ми зв’яжемося з вами для уточнення деталей.' },
];

export default function FAQPage() {
  const openChat = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-support-chat'));
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 max-w-4xl min-h-screen">
        <Reveal>
          <div className="text-center mb-12">
            <Badge>FAQ</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 tracking-tight leading-[1.05]">
              Часті <span className="text-gradient-animated">запитання</span>
            </h1>
            <p className="text-lg text-[var(--text-3)] mt-4">Відповіді на найпопулярніші питання про наші послуги</p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 50}>
              <details className="glass-card rounded-2xl p-6 group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-lg font-semibold text-[var(--text)] pr-4">{f.q}</span>
                  <span className="text-[var(--accent)] transition-transform group-open:rotate-180 shrink-0">▼</span>
                </summary>
                <p className="mt-4 text-[var(--text-3)] leading-relaxed">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center mt-12 border-[var(--accent)]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mx-auto mb-5">
                <HelpCircle size={40} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[var(--text)]">Не знайшли відповідь?</h2>
              <p className="text-[var(--text-3)] mb-8 max-w-lg mx-auto">
                Напишіть нам — відповімо протягом 24 годин. Або зв'яжіться зручним для вас способом.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={openChat}
                  className="btn-tactile rounded-xl px-8 py-4 text-base shadow-[0_0_20px_var(--accent)]"
                >
                  <MessageCircle size={18} className="mr-2" /> Відкрити чат підтримки
                </Button>
                <a href="https://t.me/kostex_official" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="btn-tactile rounded-xl px-8 py-4 text-base w-full sm:w-auto">
                    <Send size={18} className="mr-2" /> Написати в Telegram
                  </Button>
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <Link href="/builder" className="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-semibold">
                  Або одразу почати проєкт <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
