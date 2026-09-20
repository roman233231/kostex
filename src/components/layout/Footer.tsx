import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <Logo size={32} className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-lg font-bold tracking-tight">KOSTEX</span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              Digital Products Studio. Websites, Web Apps, Software, Bots — built for your business.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[var(--text-faint)]">
              Products
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog/websites" className="text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors">
                  Websites
                </Link>
              </li>
              <li>
                <Link href="/catalog/web-apps" className="text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors">
                  Web Apps
                </Link>
              </li>
              <li>
                <Link href="/catalog/software" className="text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors">
                  Software
                </Link>
              </li>
              <li>
                <Link href="/catalog/bots" className="text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors">
                  Bots
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[var(--text-faint)]">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[var(--text-faint)]">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-faint)]">
            © {new Date().getFullYear()} KOSTEX. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-faint)] tracking-wider uppercase">
            Digital Products Studio
          </p>
        </div>
      </div>
    </footer>
  );
}