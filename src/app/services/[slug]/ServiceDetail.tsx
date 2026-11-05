'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { serviceCategories } from '@/data/services';
import {
  ArrowRight, ArrowLeft, Check, Clock, Sparkles,
  Target, Palette, Code2, Rocket, Shield, MessageCircle
} from 'lucide-react';

const included = [
  { icon: Target, title: 'Аналіз бізнесу', desc: 'Вивчаємо нішу, конкурентів та цільову аудиторію' },
  { icon: Palette, title: 'Унікальний дизайн', desc: 'Створюємо стиль, який виділяє вас серед конкурентів' },
  { icon: Code2, title: 'Якісна розробка', desc: 'Чистий код, швидкість, адаптивність під всі екрани' },
  { icon: Shield, title: 'SEO та аналітика', desc: 'Готуємо проєкт до Google та підключаємо аналітику' },
];

const process = [
  { step: '01', title: 'Брифінг', desc: 'Обговорюємо цілі, бюджет та терміни. Складаємо ТЗ.' },
  { step: '02', title: 'Дизайн', desc: 'Розробляємо концепт та узгоджуємо з вами.' },
  { step: '03', title: 'Розробка', desc: 'Кодуємо, тестуємо, показуємо прогрес.' },
  { step: '04', title: 'Запуск', desc: 'Розміщуємо на хостингу, навчаємо, підтримуємо.' },
];

const faq = [
  { q: 'Скільки точно коштує проєкт?', a: 'Базова ціна вказана на цій сторінці. Точна вартість залежить від обсягу — розрахуйте її в конструкторі за 1 хвилину.' },
  { q: 'Чи можна змінити дизайн під мій бренд?', a: 'Так, ми адаптуємо кольори, шрифти та стиль під ваш брендбук.' },
  { q: 'Як відбувається оплата?', a: '50% передоплата для старту, 50% після узгодження готового проєкту.' },
  { q: 'Чи надаєте ви гарантію?', a: 'Так, 30 днів безкоштовної підтримки та виправлення помилок після запуску.' },
];

export default function ServiceDetail({ slug }: { slug: string }) {
  const service = serviceCategories.find((s) => s.id === slug);
  if (!service) {
    notFound();
  }
  const Icon = service.icon;
  const otherServices = serviceCategories.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="container pt-16 pb-12 md:pt-24 md:pb-16">
          <Reveal>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm text-[var(--text-3)] hover:text-[var(--accent)] mb-8">
              <ArrowLeft size={16} /> Усі послуги
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7">
                <Badge>Послуга</Badge>
                <div className="flex items-start gap-4 mt-5">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 flex items-center justify-center shrink-0">
                    <Icon size={30} />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
                      {service.name}
                    </h1>
                    <p className="text-lg text-[var(--text-3)] mt-3 max-w-xl">
                      {service.desc}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-8 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <Clock size={14} className="text-[var(--accent)]" />
                    <span className="text-[var(--text-2)]">Термін: <b className="text-[var(--text)]">{service.time}</b></span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <Sparkles size={14} className="text-[var(--accent)]" />
                    <span className="text-[var(--text-2)]">Ціна: <b className="text-[var(--text)]">{service.price > 0 ? `від ${service.price.toLocaleString('uk-UA')} ₴` : 'за запитом'}</b></span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 w-full">
                <div className="glass-card rounded-[2rem] p-6 md:p-8 border-[var(--accent)]/30">
                  <h3 className="text-lg font-bold mb-2">Готові почати?</h3>
                  <p className="text-sm text-[var(--text-3)] mb-5">
                    Розрахуйте точну вартість за 1 хвилину в конструкторі — оберіть потрібні сторінки та фічі.
                  </p>
                  <Link href={`/builder?type=${service.id}`}>
                    <Button className="w-full btn-tactile py-4 shadow-[0_0_25px_var(--accent)]">
                      Розрахувати вартість <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                  <button
                    onClick={() => window.dispatchEvent(new Event('open-support-chat'))}
                    className="w-full mt-3 py-3 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text-2)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} /> Задати питання
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="container py-12 md:py-16">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Що входить у послугу</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {included.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <Reveal key={i} delay={i * 60}>
                  <div className="glass-card rounded-2xl p-6 h-full">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
                      <ItemIcon size={20} />
                    </div>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-[var(--text-3)] leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Як ми працюємо</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {process.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="relative rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)] h-full">
                  <div className="text-5xl font-bold text-[var(--accent)]/20 mb-2 leading-none">{p.step}</div>
                  <h3 className="font-bold mb-1">{p.title}</h3>
                  <p className="text-sm text-[var(--text-3)] leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Часті питання</h2>
          </Reveal>
          <div className="max-w-3xl space-y-3">
            {faq.map((f, i) => (
              <Reveal key={i} delay={i * 40}>
                <details className="glass-card rounded-2xl p-6 group">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-[var(--text)]">
                    {f.q}
                    <span className="text-[var(--accent)] transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-4 text-sm text-[var(--text-3)] leading-relaxed">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <Reveal>
            <div className="rounded-[2.5rem] p-8 md:p-14 text-center max-w-4xl mx-auto border border-[var(--accent)]/30 relative overflow-hidden"
                 style={{ background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--accent)]/20 rounded-full blur-[80px]" />
              <Rocket size={40} className="text-[var(--accent)] mx-auto mb-4 relative z-10" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3 relative z-10">Готові створити {service.name.toLowerCase()}?</h2>
              <p className="text-[var(--text-3)] mb-7 max-w-lg mx-auto relative z-10">
                Оберіть потрібні опції та отримайте точну ціну за хвилину.
              </p>
              <Link href={`/builder?type=${service.id}`} className="relative z-10 inline-block">
                <Button className="btn-lg btn-tactile px-10 py-4 shadow-[0_0_30px_var(--accent)]">
                  Почати проєкт <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </section>

        <section className="container py-12 md:py-16">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Інші послуги</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherServices.map((s, i) => {
              const OtherIcon = s.icon;
              return (
                <Reveal key={s.id} delay={i * 60}>
                  <Link href={`/services/${s.id}`} className="glass-card rounded-2xl p-6 h-full block group hover:border-[var(--accent)]/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <OtherIcon size={20} />
                    </div>
                    <h3 className="font-bold mb-1">{s.name}</h3>
                    <p className="text-xs text-[var(--text-3)] mb-4 line-clamp-2">{s.desc}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-2)]">{s.price > 0 ? `від ${s.price.toLocaleString('uk-UA')} ₴` : 'за запитом'}</span>
                      <ArrowRight size={16} className="text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
