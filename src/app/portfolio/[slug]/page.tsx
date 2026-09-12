import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { getPortfolioBySlug } from '@/services/portfolio';

export default async function PortfolioDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);

  if (!item || !item.published) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Link href="/portfolio" className="text-sm text-white/50 hover:text-purple-bright">
          ← Back to Portfolio
        </Link>

        <div className="mt-6 mb-12">
          <Badge>{item.category}</Badge>
          <h1 className="text-5xl font-bold mt-4">{item.title}</h1>
          <p className="text-lg text-white/60 mt-4 max-w-3xl">{item.description}</p>
        </div>

        {item.image && (
          <div className="mb-12 rounded-lg overflow-hidden border border-white/10">
            <img src={item.image} alt={item.title} className="w-full" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {item.features && item.features.length > 0 && (
              <Card>
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <ul className="space-y-2">
                  {item.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/80">
                      <span className="w-2 h-2 rounded-full bg-purple-bright"></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {item.technologies && item.technologies.length > 0 && (
              <Card>
                <h2 className="text-2xl font-semibold mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold mb-4">Get this project</h3>
              <p className="text-sm text-white/60 mb-4">
                Like this project? You can order a similar one or customize it.
              </p>
              <div className="flex flex-col gap-3">
                {item.demoUrl && (
                  <Button href={item.demoUrl}>View Live Demo</Button>
                )}
                <Button variant="outline" href="/builder">
                  Build Similar Project
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-3">Category</h3>
              <Badge>{item.category}</Badge>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}