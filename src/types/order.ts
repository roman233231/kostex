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

  // Фінанси
  finalPrice?: number;
  currentInvoiceAmount?: number;
  paidAmount?: number;
  invoiceType?: 'prepayment' | 'final' | 'full';

  status: string;
  createdAt?: string;
  updatedAt?: string;

  contactPreference?: 'telegram' | 'instagram' | 'phone' | 'email' | 'whatsapp' | 'viber' | 'site';
  contactValue?: string;

  // Оплата
  paymentStatus?: 'pending' | 'awaiting_manual' | 'pending_confirmation' | 'partially_paid' | 'fully_paid' | 'cancelled';
  paymentMethod?: 'card' | 'crypto' | 'paypal' | 'other';
  paymentDetails?: string;
  paymentToken?: string;     // Токен публічного посилання на оплату
  paymentId?: string | number;
  paymentProvider?: string;
  paidAt?: string;
  paymentClaimedAt?: string;
}
