import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import PortfolioCard from '@/components/ui/PortfolioCard';
import Reveal from '@/components/ui/Reveal';
import { getPublishedPortfolio } from '@/services/portfolio';

export default async function PortfolioPage() {
  const items = await getPublishedPortfolio().catch(() => []);

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Reveal>
          <div className="mb-12">
            <Badge>Portfolio</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mt-4 tracking-tight">
              Our Work
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4 max-w-2xl">
              Demo projects and real client work.
            </p>
          </div>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-[var(--text-muted)]">No portfolio items yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <PortfolioCard item={item} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}