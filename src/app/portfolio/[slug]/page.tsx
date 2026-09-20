import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
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
        <Link
          href="/portfolio"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--purple)] transition-colors inline-flex items-center gap-1"
        >
          ← Back to Portfolio
        </Link>

        <Reveal>
          <div className="mt-8 mb-12">
            <Badge>{item.category.replace('-', ' ')}</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mt-4 tracking-tight">
              {item.title}
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4 max-w-3xl">
              {item.description}
            </p>
          </div>
        </Reveal>

        {item.image && (
          <Reveal delay={100}>
            <div className="mb-12 rounded-2xl overflow-hidden border border-[var(--border)] relative w-full aspect-[16/9]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {item.features && item.features.length > 0 && (
              <Reveal>
                <Card hover={false}>
                  <h2 className="text-2xl font-semibold mb-5">Features</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--purple-bright)] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            )}

            {item.technologies && item.technologies.length > 0 && (
              <Reveal delay={100}>
                <Card hover={false}>
                  <h2 className="text-2xl font-semibold mb-5">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Card>
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <Reveal delay={150}>
                <Card hover={false} className="border-[var(--purple)]/30">
                  <h3 className="text-lg font-semibold mb-3">Get this project</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-5">
                    Like this project? You can order a similar one or customize it.
                  </p>
                  <div className="flex flex-col gap-3">
                    {item.demoUrl && (
                      <Button href={item.demoUrl} className="w-full">
                        View Live Demo
                      </Button>
                    )}
                    <Button variant="outline" href="/builder" className="w-full">
                      Build Similar Project
                    </Button>
                  </div>
                </Card>
              </Reveal>

              <Reveal delay={200}>
                <Card hover={false}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-3">
                    Category
                  </h3>
                  <Badge>{item.category.replace('-', ' ')}</Badge>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}