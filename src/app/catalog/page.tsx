import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { products } from '@/data/products';
import { categories } from '@/types/product';

export default function CatalogPage() {
  const publishedProducts = products.filter(p => p.published);

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <div className="mb-12">
          <Badge>Catalog</Badge>
          <h1 className="text-5xl font-bold mt-4">Digital Products</h1>
          <p className="text-lg text-white/60 mt-4 max-w-2xl">
            Choose a starting point for your project. Customize it to fit your needs.
          </p>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(cat => (
            <a
              key={cat.id}
              href={`/catalog/${cat.id}`}
              className="px-4 py-2 rounded-full border border-white/10 text-sm text-white/70 hover:border-purple-bright hover:text-purple-bright transition-colors"
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedProducts.map(product => (
            <Card key={product.id} className="flex flex-col">
              <Badge className="self-start">{product.category}</Badge>
              <h3 className="text-xl font-semibold mt-3">{product.title}</h3>
              <p className="text-white/60 mt-2 flex-1">{product.shortDescription}</p>
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="text-sm text-white/50">From {product.startingPrice.toLocaleString('uk-UA')} ₴</div>
                <div className="text-sm text-white/50">{product.estimatedTime}</div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button href={`/products/${product.slug}`} className="flex-1">View Details</Button>
                <Button variant="outline" href={product.demoUrl || '#'} className="flex-1">Demo</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}