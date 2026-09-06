export async function getPublishedProducts(): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('published', '==', true), orderBy('title', 'asc'));
  const querySnapshot = await getDocs(q);
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(
    collection(db, 'products'),
    where('category', '==', category),
    where('published', '==', true),
    orderBy('title', 'asc')
  );
  const querySnapshot = await getDocs(q);
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(db, 'products'), where('slug', '==', slug), where('published', '==', true));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Product;
  }
  return null;
}