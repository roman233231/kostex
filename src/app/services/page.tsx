'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/translations';
import { ArrowRight, Check } from 'lucide-react';

interface ServiceCard {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  featureKeys: TranslationKey[];
  href: string;
  emoji: string;
  color1: string;
  color2: string;
  glow: string;
}

const services: ServiceCard[] = [
  {
    titleKey: 'services.websites',
    descKey: 'services.websitesDesc',
    featureKeys: ['services.websitesF1', 'services.websitesF2', 'services.websitesF3', 'services.websitesF4'],
    href: '/catalog/websites',
    emoji: '🌐',
    color1: '#8B5CF6',
    color2: '#A855F7',
    glow: 'rgba(139,92,246,0.5)',
  },
  {
    titleKey: 'services.webapps',
    descKey: 'services.webappsDesc',
    featureKeys: ['services.webappsF1', 'services.webappsF2', 'services.webappsF3', 'services.webappsF4'],
    href: '/catalog/web-apps',
    emoji: '⚡',
    color1: '#3B82F6',
    color2: '#06B6D4',
    glow: 'rgba(59,130,246,0.5)',
  },
  {
    titleKey: 'services.software',
    descKey: 'services.softwareDesc',
    featureKeys: ['services.softwareF1', 'services.softwareF2', 'services.softwareF3', 'services.softwareF4'],
    href: '/catalog/software',
    emoji: '💻',
    color1: '#EC4899',
    color2: '#F43F5E',
    glow: 'rgba(236,72,153,0.5)',
  },
  {
    titleKey: 'services.bots',
    descKey: 'services.botsDesc',
    featureKeys: ['services.botsF1', 'services.botsF2', 'services.botsF3', 'services.botsF4'],
    href: '/catalog/bots',
    emoji: '🤖',
    color1: '#10B981',
    color2: '#14B8A6',
    glow: 'rgba(16,185,129,0.5)',
  },
  {
    titleKey: 'services.crm',
    descKey: 'services.crmDesc',
    featureKeys: ['services.crmF1', 'services.crmF2', 'services.crmF3', 'services.crmF4'],
    href: '/catalog/web-apps',
    emoji: '📊',
    color1: '#F59E0B',
    color2: '#F97316',
    glow: 'rgba(245,158,11,0.5)',
  },
  {
    titleKey: 'services.ecommerce',
    descKey: 'services.ecommerceDesc',
    featureKeys: ['services.ecommerceF1', 'services.ecommerceF2', 'services.ecommerceF3', 'services.ecommerceF4'],
    href: '/catalog/websites',
    emoji: '🛒',
    color1: '#D946EF',
    color2: '#A855F7',
    glow: 'rgba(217,70,239,0.5)',
  },
];

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        {/* Заголовок */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge>{t('nav.services')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6 tracking-tight leading-[1.05]">
              {t('services.title')}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)]">
              {t('services.subtitle')}
            </p>
          </div>
        </Reveal>

        {/* Сітка послуг */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Reveal key={service.titleKey} delay={i * 70}>
              <Link href={service.href} className="block h-full group">
                <div
                  className="glass-card rounded-3xl p-8 h-full flex flex-col relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2"
                  style={
                    {
                      '--card-color-1': service.color1,
                      '--card-color-2': service.color2,
                      '--card-glow': service.glow,
                    } as React.CSSProperties
                  }
                >
                  {/* Декоративне світло */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: service.glow }}
                  />

                  {/* Іконка */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      background: `linear-gradient(135deg, ${service.color1}20, ${service.color2}20)`,
                      border: `1px solid ${service.color1}40`,
                      boxShadow: `0 0 20px ${service.glow}`,
                    }}
                  >
                    {service.emoji}
                  </div>

                  {/* Назва та опис */}
                  <h3 className="text-2xl font-bold mb-3 text-[var(--text)]">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-[var(--text-3)] flex-1 leading-relaxed mb-6">
                    {t(service.descKey)}
                  </p>

                  {/* Фічі */}
                  <ul className="space-y-2.5 mb-8">
                    {service.featureKeys.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-[var(--text-2)]">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `${service.color1}20`, color: service.color1 }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                        {t(f)}
                      </li>
                    ))}
                  </ul>

                  {/* Кнопка-посилання */}
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors" style={{ color: service.color1 }}>
                    {t('services.explore')}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-2"
                    />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* CTA внизу */}
        <Reveal delay={200}>
          <div className="mt-24 text-center glass-card rounded-3xl p-12 md:p-16 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[80px] pointer-events-none" />
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-[var(--text)]">
              {t('services.notSure')}
            </h2>
            <p className="text-[var(--text-3)] mb-8 max-w-xl mx-auto">
              {t('services.notSureDesc')}
            </p>
            <Link href="/builder">
              <Button className="btn-tactile rounded-full px-8 py-4 text-lg shadow-[0_0_20px_var(--accent)]">
                {t('services.openBuilder')} <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
