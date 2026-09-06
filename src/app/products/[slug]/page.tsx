import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getProductBySlug } from '@/services/product';

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Badge>{product.category}</Badge>
        <h1 className="text-5xl font-bold mt-4">{product.title}</h1>
        <p className="text-lg text-white/60 mt-4 max-w-2xl">{product.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/80">
                    <span className="w-2 h-2 rounded-full bg-purple-bright"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
            {product.pages && (
              <Card>
                <h2 className="text-2xl font-semibold mb-4">Pages</h2>
                <div className="flex flex-wrap gap-2">
                  {product.pages.map((page, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                      {page}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold">Price</h3>
              <div className="text-3xl font-bold mt-2">
                {product.startingPrice.toLocaleString('uk-UA')} ₴
              </div>
              <div className="text-sm text-white/50 mt-1">Estimated: {product.estimatedTime}</div>
              <div className="flex flex-col gap-3 mt-6">
                <Button href={product.demoUrl || '#'}>View Demo</Button>
                <Button variant="outline" href={`/builder?product=${product.slug}`}>
                  Customize
                </Button>
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                  <span key={i} className="text-sm text-white/50">#{tag}</span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}