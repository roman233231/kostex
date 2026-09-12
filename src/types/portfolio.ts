export interface PortfolioItem {
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image?: string;
  demoUrl?: string;
  technologies: string[];
  features: string[];
  published: boolean;
  createdAt?: string;
}