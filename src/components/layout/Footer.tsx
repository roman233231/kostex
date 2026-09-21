'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

const productLinks = [
  { href: '/catalog/websites', label: 'Websites' },
  { href: '/catalog/web-apps', label: 'Web Apps' },
  { href: '/catalog/software', label: 'Software' },
  { href: '/catalog/bots', label: 'Bots' },
];

const companyLinks = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/inspiration', label: 'Inspiration' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setEmail('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <footer className="relative mt-40 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--purple)]/50 to-transparent" />

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.15), transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="container relative">
        {/* ============================================================
            CTA SECTION
           ============================================================ */}
        <div className="py-20 md:py-28 border-b border-[var(--border)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-[var(--text-muted)]">
                  Available for new projects
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
                Let's build
                <br />
                something{' '}
                <span className="gradient-text">great</span>
              </h2>

              <p className="text-lg text-[var(--text-muted)] max-w-lg leading-relaxed">
                From websites to complex applications — we turn ideas into digital products that
                work for your business.
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <Link
                href="/builder"
                className="group inline-flex items-center justify-between gap-6 w-full lg:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] text-white font-semibold hover:brightness-110 hover:-translate-y-1 transition-all shadow-[0_12px_40px_-8px_rgba(139,92,246,0.5)]"
              >
                <span className="text-lg">Start a Project</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center justify-between gap-6 w-full lg:w-auto px-8 py-5 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)]/50 backdrop-blur text-[var(--text)] font-semibold hover:border-[var(--purple)] hover:text-[var(--purple-bright)] hover:-translate-y-1 transition-all"
              >
                <span className="text-lg">Talk to us</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================
            MAIN GRID
           ============================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-12 py-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <Logo
                size={40}
                className="w-10 h-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
              />
              <span className="text-xl font-bold tracking-tight">KOSTEX</span>
            </Link>

            <p className="text-[var(--text-muted)] leading-relaxed max-w-sm mb-8">
              A digital products studio crafting modern websites, web apps, software and bots for
              businesses worldwide.
            </p>

            {/* Newsletter */}
            <div className="mb-8">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-3">
                Subscribe to updates
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--purple)] transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium text-[var(--text)] hover:border-[var(--purple)] hover:text-[var(--purple-bright)] transition-all"
                >
                  {sent ? '✓' : '→'}
                </button>
              </form>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com/kostex.studio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group w-11 h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-[var(--purple)] hover:bg-[var(--purple)] hover:-translate-y-1 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://t.me/kostex"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="group w-11 h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-[var(--purple)] hover:bg-[var(--purple)] hover:-translate-y-1 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 3L3 10.5l6 2.5 2.5 7L21 3z" />
                  <path d="M9 13l11-10" />
                </svg>
              </a>
              <a
                href="mailto:hello@kostex.com"
                aria-label="Email"
                className="group w-11 h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-[var(--purple)] hover:bg-[var(--purple)] hover:-translate-y-1 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Products */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-6">
              Products
            </h4>
            <ul className="space-y-4">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-[var(--text-secondary)] hover:text-[var(--purple-bright)] transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[var(--purple)] transition-all duration-300" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-[var(--text-secondary)] hover:text-[var(--purple-bright)] transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[var(--purple)] transition-all duration-300" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)] mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-[var(--text-secondary)] hover:text-[var(--purple-bright)] transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[var(--purple)] transition-all duration-300" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ============================================================
            BOTTOM BAR
           ============================================================ */}
        <div className="py-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-faint)]">
            <span>© {new Date().getFullYear()} KOSTEX</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-[var(--text-faint)]" />
            <span>Digital Products Studio</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}