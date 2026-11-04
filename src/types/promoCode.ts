export interface PromoCode {
  id?: string;
  code: string;
  discountPercent: number;
  maxUses?: number;
  minAmount?: number;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
}
