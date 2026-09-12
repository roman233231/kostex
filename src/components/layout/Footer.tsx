import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-24">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">KOSTEX</h3>
          <p className="text-sm text-white/50">Digital Products Studio</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/40">Products</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/catalog/websites">Websites</Link></li>
            <li><Link href="/catalog/web-apps">Web Apps</Link></li>
            <li><Link href="/catalog/software">Software</Link></li>
            <li><Link href="/catalog/bots">Bots</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/40">Company</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/portfolio">Portfolio</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/40">Legal</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t border-white/5 text-center text-sm text-white/40">
        © {new Date().getFullYear()} KOSTEX. All rights reserved.
      </div>
    </footer>
  );
}