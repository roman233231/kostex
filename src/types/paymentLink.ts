export interface PaymentLink {
  id?: string;
  orderId?: string;
  userId?: string;
  customerName?: string;
  amount: number;
  totalPrice: number;
  paidAmountBefore: number;
  invoiceType: 'prepayment' | 'final' | 'full';
  paymentMethod: 'card' | 'crypto' | 'paypal' | 'other';
  paymentDetails: string;
  productTitle: string;
  status: 'awaiting' | 'pending_confirmation' | 'confirmed' | 'rejected' | 'superseded' | 'refunded';
  createdAt: string;
  claimedAt?: string;
  confirmedAt?: string;
  refundedAt?: string;
}
