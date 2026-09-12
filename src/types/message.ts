export interface Message {
  id?: string;
  orderId: string;
  userId: string;       // власник замовлення (для правил безпеки)
  senderId: string;     // uid відправника
  senderRole: 'client' | 'admin';
  text: string;
  createdAt?: string;
  read: boolean;
}