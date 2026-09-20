import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import ProductCard from '@/components/ui/ProductCard';
import Reveal from '@/components/ui/Reveal';
import { getPublishedProducts } from '@/services/product';
import { getAllCategories } from '@/services/category';

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([
    getPublishedProducts().catch(() => []),
    getAllCategories().catch(() => []),
  ]);

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Reveal>
          <div className="mb-12">
            <Badge>Catalog</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mt-4 tracking-tight">
              Digital Products
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4 max-w-2xl">
              Choose a starting point for your project. Customize it to fit your needs.
            </p>
          </div>
        </Reveal>

        {/* Category chips */}
        <Reveal delay={100}>
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.length > 0
              ? categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/catalog/${cat.slug}`}
                    className="px-4 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)] transition-colors"
                  >
                    {cat.name}
                  </a>
                ))
              : ['websites', 'web-apps', 'software', 'bots'].map((cat) => (
                  <a
                    key={cat}
                    href={`/catalog/${cat}`}
                    className="px-4 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--purple)] hover:text-[var(--purple)] transition-colors capitalize"
                  >
                    {cat.replace('-', ' ')}
                  </a>
                ))}
          </div>
        </Reveal>

        {/* Products grid */}
        {products.length === 0 ? (
          <p className="text-[var(--text-muted)]">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <Reveal key={product.id} delay={i * 60}>
                <ProductCard product={product} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}