'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import { HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

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
                  <span className="text-lg font-semibold text-[var(--text)]">{f.q}</span>
                  <span className="text-[var(--accent)] transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-4 text-[var(--text-3)] leading-relaxed">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center mt-12 border-[var(--accent)]/30">
            <MessageCircle size={48} className="text-[var(--accent)] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Не знайшли відповідь?</h2>
            <p className="text-[var(--text-3)] mb-6">Напишіть нам у підтримку — відповімо протягом 24 годин.</p>
            <Link href="/contact"><Button>Зв’язатися з нами <ArrowRight size={18} className="ml-2" /></Button></Link>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
