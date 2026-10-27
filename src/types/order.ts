export interface Order {
  id?: string;
  userId: string;
  productId?: string;
  productTitle?: string;
  template?: string;
  design?: string;
  pages?: string[];
  features?: string[];
  requirements?: string;
  references?: string[];
  estimatedPrice: number;
  estimatedTime?: string;
  finalPrice?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;

  contactPreference?: 'telegram' | 'instagram' | 'phone' | 'email' | 'whatsapp' | 'viber' | 'site';
  contactValue?: string;

  // Оплата
  paymentStatus?: 'pending' | 'awaiting_manual' | 'pending_confirmation' | 'paid' | 'cancelled';
  paymentMethod?: 'card' | 'crypto' | 'paypal' | 'other';
  paymentDetails?: string;
  paidAt?: string;
  paymentClaimedAt?: string;
}
