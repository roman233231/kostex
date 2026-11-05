'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { Check, X, ArrowRight, Clock, Sparkles, Calculator, MessageCircle } from 'lucide-react';

const packages = [
  {
    id: 'start',
    name: 'Швидкий старт',
    subtitle: 'Лендінг або сайт-візитка',
    price: 3500,
    time: '3–7 днів',
    desc: 'Ідеально, щоб швидко запустити рекламу або презентувати бізнес в інтернеті.',
    includes: [
      '1 сторінка з унікальним дизайном',
      'Адаптація під телефон і планшет',
      'Форма звʼязку + месенджери',
      'Базове SEO налаштування',
      'Підключення домену та хостингу',
      '30 днів підтримки',
    ],
    notIncludes: ['Блог', 'Каталог товарів', 'Особистий кабінет'],
    cta: 'Розрахувати лендінг',
    builderType: 'landing',
    color: 'from-blue-500 to-cyan-500',
    popular: false,
  },
  {
    id: 'business',
    name: 'Повноцінний сайт',
    subtitle: 'Корпоративний сайт для бізнесу',
    price: 5000,
    time: '7–14 днів',
    desc: 'Багатосторінковий сайт, який продає. Підходить для компаній, послуг, каталогів.',
    includes: [
      'До 6 сторінок + блог',
      'Унікальний дизайн під бренд',
      'Форма звʼязку + онлайн-чат',
      'Розширена SEO-оптимізація',
      'Підключення аналітики',
      'Telegram-сповіщення',
      '60 днів підтримки',
    ],
    notIncludes: ['Особистий кабінет', 'Онлайн-оплата'],
    cta: 'Розрахувати сайт',
    builderType: 'website',
    color: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    id: 'custom',
    name: 'Складна система',
    subtitle: 'Веб-додаток, CRM або SaaS',
    price: 12000,
    time: 'від 2 тижнів',
    desc: 'Системи з логікою: особисті кабінети, оплати, ролі, автоматизація процесів.',
    includes: [
      'Будь-яка кількість сторінок',
      'Особистий кабінет користувача',
      'Онлайн-оплата (картки, крипта)',
      'Адмін-панель керування',
      'Інтеграції з зовнішніми API',
      'Telegram-боти та автоматизація',
      '90 днів підтримки',
    ],
    notIncludes: [],
    cta: 'Обговорити проєкт',
    builderType: 'webapp',
    color: 'from-amber-500 to-orange-500',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16 md:py-24 min-h-screen">

        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge>Скільки це коштує</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-5 mb-5 leading-[1.05]">
              Скільки коштує{' '}
              <span className="text-gradient-animated">ваш проєкт?</span>
            </h1>
            <p className="text-lg text-[var(--text-3)] max-w-2xl mx-auto">
              Оберіть сценарій, який найближче до вашої задачі. Це <b className="text-[var(--text)]">орієнтовна вартість</b> — точну ціну побачите в конструкторі за 1 хвилину.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 100} className="h-full">
              <div
                className={`relative h-full rounded-[2rem] p-7 flex flex-col transition-all duration-300 ${
                  pkg.popular
                    ? 'border-2 border-[var(--accent)] bg-[var(--surface)] shadow-[0_0_50px_-10px_var(--accent)] lg:-translate-y-3'
                    : 'border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/40'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1.5 whitespace-nowrap"
                       style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                    <Sparkles size={12} /> Найпопулярніше
                  </div>
                )}

                <div className="mb-6">
                  <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-3 bg-gradient-to-r ${pkg.color} text-white`}>
                    {pkg.name}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{pkg.subtitle}</h3>
                  <p className="text-sm text-[var(--text-3)] leading-relaxed">{pkg.desc}</p>
                </div>

                <div className="pb-6 mb-6 border-b border-[var(--border)]">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs text-[var(--text-4)] uppercase tracking-wider">від</span>
                    <span className={`text-4xl font-bold bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}>
                      {pkg.price.toLocaleString('uk-UA')} ₴
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-3)] mt-2">
                    <Clock size={12} />
                    <span>Термін: <b className="text-[var(--text-2)]">{pkg.time}</b></span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-4 flex-1">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--text-2)]">
                      <div className="w-4 h-4 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                {pkg.notIncludes.length > 0 && (
                  <ul className="space-y-2 mb-6 pt-4 border-t border-dashed border-[var(--border)]">
                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-4)] mb-1">Не входить:</div>
                    {pkg.notIncludes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs text-[var(--text-4)]">
                        <div className="w-4 h-4 rounded-full bg-red-500/10 text-red-400/60 flex items-center justify-center shrink-0 mt-0.5">
                          <X size={9} strokeWidth={3} />
                        </div>
                        <span className="leading-snug line-through decoration-[var(--text-4)]/30">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Link href={`/builder?type=${pkg.builderType}`} className="mt-auto block">
                  <Button
                    variant={pkg.popular ? 'primary' : 'outline'}
                    className={`w-full py-3.5 rounded-xl font-bold btn-tactile ${pkg.popular ? 'shadow-[0_10px_25px_-8px_var(--accent)]' : ''}`}
                  >
                    {pkg.cta} <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <div className="max-w-4xl mx-auto rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border border-[var(--accent)]/30"
               style={{ background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--accent)]/20 rounded-full blur-[80px]" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center relative z-10">
              <div className="md:col-span-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)] text-xs font-bold mb-4">
                  <Calculator size={14} /> Точний розрахунок за 1 хвилину
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  Не знаєте, який варіант ваш?
                </h2>
                <p className="text-[var(--text-3)] max-w-lg leading-relaxed">
                  Пройдіть короткий тест у конструкторі: оберіть тип проєкту, стиль, сторінки та фічі — і побачите <b className="text-[var(--text)]">точну ціну у реальному часі</b>.
                </p>
              </div>
              <div className="md:col-span-2 flex flex-col gap-3">
                <Link href="/builder">
                  <Button className="w-full btn-lg btn-tactile py-4 shadow-[0_0_30px_var(--accent)]">
                    Порахувати ціну <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <button
                  onClick={() => window.dispatchEvent(new Event('open-support-chat'))}
                  className="w-full py-3 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text-2)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} /> Задати питання
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Часті питання</h2>
            <div className="space-y-3">
              {[
                { q: 'Чому "від", а не фіксована ціна?', a: 'Бо кожен проєкт унікальний. "Від" — це мінімум для базової версії. Точну ціну ви бачите в конструкторі після вибору всіх опцій.' },
                { q: 'Це підписка чи одноразова оплата?', a: 'Одноразова. Ви платите за готовий проєкт. Хостинг і домен — окремо (приблизно 100–200 ₴/місяць, оплачується напряму провайдеру).' },
                { q: 'Як відбувається оплата?', a: '50% передоплата перед стартом робіт, 50% — після узгодження та здачі проєкту. Приймаємо картки, крипту та PayPal.' },
                { q: 'Що якщо мені не сподобається результат?', a: 'Ми працюємо поетапно з узгодженням на кожному кроці. Показуємо дизайн до початку розробки — щоб ви були впевнені.' },
                { q: 'Чи можна замовити щось поза цими варіантами?', a: 'Звичайно. У конструкторі є опція "Інше / Кастом" — там можна описати будь-яку задачу, і ми порахуємо індивідуально.' },
              ].map((f, i) => (
                <details key={i} className="glass-card rounded-2xl p-5 group">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-[var(--text)] text-sm">
                    {f.q}
                    <span className="text-[var(--accent)] transition-transform group-open:rotate-180 text-xs">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--text-3)] leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>

      </main>
      <Footer />
    </>
  );
}
