import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Badge>Portfolio</Badge>
        <h1 className="text-5xl font-bold mt-4">Our Work</h1>
        <p className="text-lg text-white/60 mt-4 max-w-2xl">
          Demo projects and real client work.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <h3 className="text-xl font-semibold">Auto Service Pro</h3>
            <p className="text-white/60 mt-2">Modern website for automotive businesses.</p>
          </Card>
          <Card>
            <h3 className="text-xl font-semibold">Restaurant</h3>
            <p className="text-white/60 mt-2">Elegant site for a restaurant or cafe.</p>
          </Card>
          <Card>
            <h3 className="text-xl font-semibold">Fitness</h3>
            <p className="text-white/60 mt-2">Website for gym or fitness coach.</p>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}