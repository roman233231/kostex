'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Star, Quote, ArrowRight } from 'lucide-react';

const reviews = [
  {
    name: 'Олександр К.',
    role: 'Власник автосервісу',
    company: 'AutoPro Service',
    text: 'Швидко, якісно, за розумну ціну. Сайт запустили за 10 днів, і він одразу почав приносити клієнтів. Онлайн-запис працює ідеально — адміністратори більше не витрачають час на дзвінки.',
    rating: 5,
    initial: 'О',
  },
  {
    name: 'Марина Л.',
    role: 'Засновниця ресторану',
    company: 'La Terrazza',
    text: 'Працювати з KOSTEX — одне задоволення. Все чітко, вчасно, з повагою до деталей. Сайт виглядає преміально, гості часто кажуть, що він кращий за конкурентів.',
    rating: 5,
    initial: 'М',
  },
  {
    name: 'Дмитро С.',
    role: 'Директор компанії',
    company: 'SalesFlow',
    text: 'Замовили CRM — тепер вся робота автоматизована. Продажі виросли на 30% за перші 2 місяці. Команда швидко реагує на будь-які правки.',
    rating: 5,
    initial: 'Д',
  },
  {
    name: 'Ігор Т.',
    role: 'Фітнес-тренер',
    company: 'FitLife Studio',
    text: 'Сайт для фітнес-студії вийшов ідеальним. Запис на тренування через сайт — зручно для клієнтів. Рекомендую всім, хто хоче сучасний продукт.',
    rating: 5,
    initial: 'І',
  },
  {
    name: 'Аліна В.',
    role: 'Власниця салону краси',
    company: 'BeautyBook',
    text: 'Онлайн-запис клієнти обожнюють. Все інтуїтивно зрозуміло. Підтримка завжди на зв\'язку. Це моя друга співпраця з KOSTEX.',
    rating: 5,
    initial: 'А',
  },
  {
    name: 'Сергій П.',
    role: 'Власник магазину',
    company: 'ShopSmart',
    text: 'Інтернет-магазин з інтеграцією оплат і доставки. Все працює швидко, адмінка зручна. Рекомендую як надійного партнера.',
    rating: 5,
    initial: 'С',
  },
];

export default function ReviewsPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge>{t('reviews.badge')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-5 tracking-tight leading-[1.05]">
              {t('reviews.title')}
              <br />
              <span className="gradient-text">{t('reviews.title2')}</span>
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-5">
              {t('reviews.subtitle')}
            </p>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal delay={80}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            <Card hover={false} className="text-center py-6">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill="var(--purple-bright)" stroke="none" />
                ))}
              </div>
              <div className="text-2xl md:text-3xl font-bold gradient-text">5.0</div>
              <div className="text-xs text-[var(--text-muted)] mt-1 uppercase tracking-wider">
                Рейтинг
              </div>
            </Card>
            <Card hover={false} className="text-center py-6">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">50+</div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                Проєктів
              </div>
            </Card>
            <Card hover={false} className="text-center py-6">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">98%</div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                Задоволених
              </div>
            </Card>
            <Card hover={false} className="text-center py-6">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                Підтримка
              </div>
            </Card>
          </div>
        </Reveal>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 60}>
              <Card hover={false} className="h-full flex flex-col group hover:border-[var(--border-purple)] transition-all">
                {/* Quote icon */}
                <div className="mb-4 text-[var(--purple-bright)] opacity-30 group-hover:opacity-60 transition-opacity">
                  <Quote size={28} />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="var(--purple-bright)" stroke="none" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-[var(--text-secondary)] leading-relaxed flex-1 mb-6 text-sm">
                  {r.text}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-[var(--border)]">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--purple)] to-[var(--purple-neon)] text-white font-bold flex items-center justify-center shrink-0">
                    {r.initial}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{r.name}</div>
                    <div className="text-xs text-[var(--text-muted)] truncate">
                      {r.role} · {r.company}
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={300}>
          <div className="mt-20">
            <Card hover={false} className="text-center py-12 md:py-16 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Хочете бути наступним?
              </h2>
              <p className="text-[var(--text-muted)] mb-7 max-w-lg mx-auto">
                Почніть свій проєкт зараз і отримайте продукт, який працює на вас.
              </p>
              <Link href="/builder">
                <Button className="btn-lg">
                  Почати проєкт <ArrowRight size={18} className="ml-1" />
                </Button>
              </Link>
            </Card>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}