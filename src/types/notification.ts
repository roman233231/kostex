export interface Notification {
  id?: string;
  userId: string;       // кому адресовано (uid)
  title: string;
  message: string;
  link?: string;        // куди перейти при кліку
  read: boolean;
  createdAt?: string;
}