import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container py-24 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
        {/* Grid bg */}
        <div className="grid-bg" />

        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="relative text-center max-w-2xl">
          <div className="text-[120px] md:text-[180px] font-bold leading-none gradient-text tracking-tighter">
            404
          </div>

          <h1 className="text-2xl md:text-4xl font-bold mt-4 mb-4">
            Page not found
          </h1>

          <p className="text-[var(--text-muted)] text-lg mb-10 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="btn-lg">← Back to Home</Button>
            </Link>
            <Link href="/catalog">
              <Button variant="outline" className="btn-lg">Browse Catalog</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}