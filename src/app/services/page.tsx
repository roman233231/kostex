'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import TiltCard from '@/components/ui/TiltCard';
import { useLanguage } from '@/context/LanguageContext';

const services = [
  {
    title: 'Websites',
    description: 'Landing pages, business sites, e-commerce, blogs and corporate websites.',
    features: ['Responsive design', 'SEO optimized', 'Fast loading', 'CMS integration'],
    href: '/catalog/websites',
    icon: '🌐',
  },
  {
    title: 'Web Apps',
    description: 'Custom dashboards, CRM, booking systems, SaaS platforms.',
    features: ['User accounts', 'Database', 'Admin panel', 'API integration'],
    href: '/catalog/web-apps',
    icon: '⚡',
  },
  {
    title: 'Software',
    description: 'Desktop apps, business software, utilities and custom solutions.',
    features: ['Windows/macOS', 'Offline mode', 'Cloud sync', 'Custom logic'],
    href: '/catalog/software',
    icon: '💻',
  },
  {
    title: 'Bots',
    description: 'Telegram, Discord and automation bots for business.',
    features: ['Automation', 'Support', 'Notifications', 'Integrations'],
    href: '/catalog/bots',
    icon: '🤖',
  },
  {
    title: 'CRM',
    description: 'Customer relationship management systems tailored to your workflow.',
    features: ['Clients', 'Deals', 'Tasks', 'Reports'],
    href: '/catalog/web-apps',
    icon: '📊',
  },
  {
    title: 'E-commerce',
    description: 'Online stores with payment integration and inventory management.',
    features: ['Catalog', 'Cart', 'Payments', 'Shipping'],
    href: '/catalog/websites',
    icon: '🛒',
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
            <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              {t('services.title')}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4">{t('services.subtitle')}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 60}>
              <TiltCard className="h-full">
                <Card className="flex flex-col h-full group">
                  <div className="text-4xl mb-4 transition-transform group-hover:scale-110">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--purple)] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[var(--text-muted)] mb-5 flex-1 text-sm">{service.description}</p>
                  <ul className="space-y-1.5 mb-6">
                    {service.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--purple-bright)] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" href={service.href} className="w-full">
                    {t('services.explore')}
                  </Button>
                </Card>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('services.notSure')}</h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-xl mx-auto">
              {t('services.notSureDesc')}
            </p>
            <Link href="/builder"><Button>{t('services.openBuilder')}</Button></Link>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}