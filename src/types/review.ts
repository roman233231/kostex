export interface Review {
    id?: string;
    userId: string;
    userName: string;
    userEmail?: string;
    orderId?: string;
    orderTitle?: string;
    rating: number; // 1–5
    text: string;
    approved: boolean;
    featured?: boolean;
    createdAt?: string;
    updatedAt?: string;
}