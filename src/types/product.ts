export interface Product {
  id: string;
  slug: string;
  title: string;
  category: 'websites' | 'web-apps' | 'software' | 'bots';
  shortDescription: string;
  description: string;
  startingPrice: number;
  estimatedTime: string;
  tags: string[];
  features: string[];
  pages?: string[];
  image?: string;
  demoUrl?: string;
  published: boolean;
}

export const categories = [
  { id: 'websites', label: 'Websites' },
  { id: 'web-apps', label: 'Web Apps' },
  { id: 'software', label: 'Software' },
  { id: 'bots', label: 'Bots' },
];