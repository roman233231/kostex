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

  // Контакт для зв'язку
  contactPreference?: 'telegram' | 'instagram' | 'phone' | 'email' | 'whatsapp' | 'viber' | 'site';
  contactValue?: string;

  // Оплата (ручний інвойс та NOWPayments)
  paymentStatus?: 'pending' | 'awaiting_manual' | 'paid' | 'cancelled';
  paymentMethod?: 'card' | 'crypto' | 'paypal' | 'other';
  paymentDetails?: string;
  paymentToken?: string;
  paymentProvider?: 'nowpayments' | 'manual' | 'liqpay' | 'monobank';
  paymentInvoiceUrl?: string;
  paymentId?: string | number;
  paidAt?: string;
}
