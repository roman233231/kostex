export interface PaymentLink {
  id?: string;
  orderId?: string;          // необов'язково — для ручних рахунків
  userId?: string;
  customerName?: string;     // ім'я клієнта для ручного рахунку
  amount: number;
  totalPrice: number;
  paidAmountBefore: number;
  invoiceType: 'prepayment' | 'final' | 'full';
  paymentMethod: 'card' | 'crypto' | 'paypal' | 'other';
  paymentDetails: string;
  productTitle: string;
  status: 'awaiting' | 'pending_confirmation' | 'confirmed' | 'rejected' | 'superseded';
  createdAt: string;
  claimedAt?: string;
  confirmedAt?: string;
}
