import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getPublishedPortfolio } from '@/services/portfolio';

export default async function PortfolioPage() {
  const items = await getPublishedPortfolio().catch(() => []);

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Badge>Portfolio</Badge>
        <h1 className="text-5xl font-bold mt-4">Our Work</h1>
        <p className="text-lg text-white/60 mt-4 max-w-2xl mb-12">
          Demo projects and real client work.
        </p>

        {items.length === 0 ? (
          <p className="text-white/60">No portfolio items yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map(item => (
              <Link key={item.id} href={`/portfolio/${item.slug}`} className="block">
                <Card className="flex flex-col h-full hover:border-purple-bright transition-colors">
                  {item.image && (
                    <div className="mb-3 rounded-md overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                    </div>
                  )}
                  <Badge className="self-start">{item.category}</Badge>
                  <h3 className="text-xl font-semibold mt-3">{item.title}</h3>
                  <p className="text-white/60 mt-2 flex-1">{item.description}</p>
                  <div className="mt-4 text-sm text-purple-bright">
                    View case →
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}