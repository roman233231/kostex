'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/translations';
import { ArrowRight } from 'lucide-react';

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
      <main className="container py-16">
        <Reveal>
          <div className="mb-14 max-w-3xl">
            <Badge>{t('nav.services')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 tracking-tight leading-[1.05]">
              {t('services.title')}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-5">
              {t('services.subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service, i) => (
            <Reveal key={service.titleKey} delay={i * 60}>
              <Link href={service.href} className="block h-full">
                <div
                  className="color-card h-full"
                  style={
                    {
                      '--card-color-1': service.color1,
                      '--card-color-2': service.color2,
                      '--card-glow': service.glow,
                    } as React.CSSProperties
                  }
                >
                  <div className="color-card-inner">
                    <div className="color-card-content">
                      <div className="color-icon">
                        <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                          {service.emoji}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-2">{t(service.titleKey)}</h3>
                      <p className="text-sm text-[var(--text-muted)] mb-5 flex-1 leading-relaxed">
                        {t(service.descKey)}
                      </p>

                      <ul className="space-y-1.5 mb-6">
                        {service.featureKeys.map((f, j) => (
                          <li
                            key={j}
                            className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: service.color1 }}
                            />
                            {t(f)}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span
                          style={{
                            background: `linear-gradient(135deg, ${service.color1}, ${service.color2})`,
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {t('services.explore')}
                        </span>
                        <ArrowRight
                          size={14}
                          className="color-arrow"
                          style={{ color: service.color1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('services.notSure')}
            </h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-xl mx-auto">
              {t('services.notSureDesc')}
            </p>
            <Link href="/builder">
              <Button>
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