'use client';

import Link from 'next/link';
import Logo from './Logo';
import { useLanguage } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/translations';

const columns: { titleKey: TranslationKey; links: { href: string; labelKey: TranslationKey }[] }[] = [
  {
    titleKey: 'footer.products',
    links: [
      { href: '/catalog/websites', labelKey: 'catalog.websites' },
      { href: '/catalog/web-apps', labelKey: 'catalog.webapps' },
      { href: '/catalog/software', labelKey: 'catalog.software' },
      { href: '/catalog/bots', labelKey: 'catalog.bots' },
    ],
  },
  {
    titleKey: 'footer.company',
    links: [
      { href: '/services', labelKey: 'nav.services' },
      { href: '/pricing', labelKey: 'pricing.badge' },
      { href: '/portfolio', labelKey: 'nav.portfolio' },
      { href: '/about', labelKey: 'nav.about' },
    ],
  },
  {
    titleKey: 'footer.more',
    links: [
      { href: '/blog', labelKey: 'nav.blog' },
      { href: '/inspiration', labelKey: 'nav.inspiration' },
      { href: '/contact', labelKey: 'nav.contact' },
      { href: '/privacy', labelKey: 'nav.about' },
    ],
  },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-[var(--border)]">
      <div className="container">
        <div className="footer-grid">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-16">
            <div className="flex-shrink-0 md:max-w-xs">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 group footer-brand-text"
              >
                <Logo
                  size={28}
                  className="w-7 h-7 transition-transform duration-500 group-hover:rotate-12"
                />
                <span className="text-base font-bold tracking-tight">KOSTEX</span>
              </Link>

              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5">
                {t('footer.tagline')}
              </p>

              {/* Socials with colorful hover */}
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com/kostex.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-faint)] transition-all hover:-translate-y-1"
                  style={{ background: 'var(--surface-2)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #EC4899, #F43F5E)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px -8px rgba(236,72,153,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--surface-2)';
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                <a
                  href="https://t.me/kostex_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-faint)] transition-all hover:-translate-y-1"
                  style={{ background: 'var(--surface-2)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #3B82F6, #06B6D4)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px -8px rgba(59,130,246,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--surface-2)';
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 3L3 10.5l6 2.5 2.5 7L21 3z" />
                    <path d="M9 13l11-10" />
                  </svg>
                </a>

                <a
                  href="mailto:kostex.official@gmail.com"
                  aria-label="Email"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-faint)] transition-all hover:-translate-y-1"
                  style={{ background: 'var(--surface-2)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #8B5CF6, #A855F7)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px -8px rgba(139,92,246,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--surface-2)';
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 md:gap-12 flex-1 md:max-w-xl">
              {columns.map((col) => (
                <div key={col.titleKey}>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text)]">
                    {t(col.titleKey)}
                  </h4>
                  <ul>
                    {col.links.map((link, idx) => (
                      <li key={`${link.href}-${idx}`}>
                        <Link
                          href={link.href}
                          className="text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors"
                        >
                          {t(link.labelKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] footer-bottom flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-faint)]">
            © {new Date().getFullYear()} KOSTEX. {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-2 text-xs text-[var(--text-faint)]">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            <span>{t('footer.available')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}