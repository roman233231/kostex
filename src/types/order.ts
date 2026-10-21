export interface Order {
  id?: string;
  userId: string;
  productId: string;
  productTitle?: string;
  template?: string;
  design?: string;
  pages: string[];
  features: string[];
  requirements?: string;
  references?: string[];
  estimatedPrice: number;
  finalPrice?: number;
  estimatedTime?: string;
  status: 'NEW' | 'REVIEW' | 'ACCEPTED' | 'IN DEVELOPMENT' | 'CLIENT REVIEW' | 'REVISION' | 'COMPLETED' | 'CANCELLED';
  createdAt?: string;
  updatedAt?: string;
}