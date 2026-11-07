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
  originalPrice?: number;
  promoCode?: string;
  promoDiscount?: number;
  promoDiscountPercent?: number;
  estimatedTime?: string;

  finalPrice?: number;
  currentInvoiceAmount?: number;
  paidAmount?: number;
  invoiceType?: 'prepayment' | 'final' | 'full';

  status: string;
  createdAt?: string;
  updatedAt?: string;

  contactPreference?: 'telegram' | 'instagram' | 'phone' | 'email' | 'whatsapp' | 'viber' | 'site';
  contactValue?: string;

  paymentStatus?: 'pending' | 'awaiting_manual' | 'pending_confirmation' | 'partially_paid' | 'fully_paid' | 'cancelled';
  paymentMethod?: 'card' | 'crypto' | 'paypal' | 'other';
  paymentDetails?: string;
  paymentToken?: string;
  paymentId?: string | number;
  paymentProvider?: string;
  paidAt?: string;
  paymentClaimedAt?: string;

  // ДОДАНО: Поле для файлів (вихідний код, макети тощо)
  files?: { name: string; url: string }[];
  attachments?: { name: string; url: string }[];
}
