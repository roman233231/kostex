export interface PaymentLink {
  id?: string; // token = doc ID
  orderId: string;
  userId: string;
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
