import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-3xl">
        <Badge>About</Badge>
        <h1 className="text-5xl font-bold mt-4">KOSTEX Studio</h1>
        <p className="text-lg text-white/60 mt-6">
          We are a digital products studio. We build websites, web apps, software, bots, and custom solutions.
        </p>
        <p className="text-white/60 mt-4">
          Our approach is simple: you can configure your digital product yourself, see an estimated price, and order it online.
        </p>
      </main>
      <Footer />
    </>
  );
}