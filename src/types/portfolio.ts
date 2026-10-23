export interface PortfolioItem {
  id?: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  demoUrl?: string;
  features?: string[];
  technologies?: string[];
  published: boolean;
  createdAt?: string;
  price?: number; // Додано для готових сайтів
}
