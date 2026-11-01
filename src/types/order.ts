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
  finalPrice?: number;            // Загальна вартість проєкту
  currentInvoiceAmount?: number;  // Сума, на яку виставлено рахунок ЗАРАЗ
  paidAmount?: number;            // Скільки вже фактично сплачено
  invoiceType?: 'prepayment' | 'final' | 'full'; 

  status: string;
  createdAt?: string;
  updatedAt?: string;

  contactPreference?: 'telegram' | 'instagram' | 'phone' | 'email' | 'whatsapp' | 'viber' | 'site';
  contactValue?: string;

  // Статус оплати
  paymentStatus?: 'pending' | 'awaiting_manual' | 'pending_confirmation' | 'partially_paid' | 'fully_paid' | 'cancelled';
  paymentMethod?: 'card' | 'crypto' | 'paypal' | 'other';
  paymentDetails?: string;
  paidAt?: string;
  paymentClaimedAt?: string;
}
