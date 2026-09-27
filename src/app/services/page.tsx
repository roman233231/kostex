'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Websites',
    description: 'Landing pages, business sites, e-commerce, blogs and corporate websites.',
    features: ['Responsive design', 'SEO optimized', 'Fast loading', 'CMS integration'],
    href: '/catalog/websites',
    emoji: '🌐',
    color1: '#8B5CF6',
    color2: '#A855F7',
    glow: 'rgba(139,92,246,0.5)',
  },
  {
    title: 'Web Apps',
    description: 'Custom dashboards, CRM, booking systems, SaaS platforms.',
    features: ['User accounts', 'Database', 'Admin panel', 'API integration'],
    href: '/catalog/web-apps',
    emoji: '⚡',
    color1: '#3B82F6',
    color2: '#06B6D4',
    glow: 'rgba(59,130,246,0.5)',
  },
  {
    title: 'Software',
    description: 'Desktop apps, business software, utilities and custom solutions.',
    features: ['Windows/macOS', 'Offline mode', 'Cloud sync', 'Custom logic'],
    href: '/catalog/software',
    emoji: '💻',
    color1: '#EC4899',
    color2: '#F43F5E',
    glow: 'rgba(236,72,153,0.5)',
  },
  {
    title: 'Bots',
    description: 'Telegram, Discord and automation bots for business.',
    features: ['Automation', 'Support', 'Notifications', 'Integrations'],
    href: '/catalog/bots',
    emoji: '🤖',
    color1: '#10B981',
    color2: '#14B8A6',
    glow: 'rgba(16,185,129,0.5)',
  },
  {
    title: 'CRM',
    description: 'Customer relationship management systems tailored to your workflow.',
    features: ['Clients', 'Deals', 'Tasks', 'Reports'],
    href: '/catalog/web-apps',
    emoji: '📊',
    color1: '#F59E0B',
    color2: '#F97316',
    glow: 'rgba(245,158,11,0.5)',
  },
  {
    title: 'E-commerce',
    description: 'Online stores with payment integration and inventory management.',
    features: ['Catalog', 'Cart', 'Payments', 'Shipping'],
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
            <Reveal key={service.title} delay={i * 60}>
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

                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-sm text-[var(--text-muted)] mb-5 flex-1 leading-relaxed">
                        {service.description}
                      </p>

                      <ul className="space-y-1.5 mb-6">
                        {service.features.map((f, j) => (
                          <li
                            key={j}
                            className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: service.color1 }}
                            />
                            {f}
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