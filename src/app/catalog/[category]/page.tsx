import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getProductsByCategory } from '@/services/product';

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = await params;
  const products = await getProductsByCategory(category);

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Badge>Category</Badge>
        <h1 className="text-5xl font-bold mt-4 capitalize">{category}</h1>
        <p className="text-white/60 mt-4 mb-8">Explore our {category} products.</p>

        {products.length === 0 ? (
          <p className="text-white/60">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id} className="flex flex-col">
                <h3 className="text-xl font-semibold">{product.title}</h3>
                <p className="text-white/60 mt-2 flex-1">{product.shortDescription}</p>
                <div className="mt-4">
                  <Button href={`/products/${product.slug}`}>View Details</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}