import { 
  Globe, LayoutTemplate, Zap, Bot, Code, BarChart3, 
  ShoppingCart, Smartphone, Settings, HelpCircle 
} from 'lucide-react';

export const serviceCategories = [
  { id: 'website', name: 'Корпоративний сайт', icon: Globe, price: 5000, time: '7–14 днів', desc: 'Багатосторінковий сайт для бізнесу' },
  { id: 'landing', name: 'Лендінг', icon: LayoutTemplate, price: 3500, time: '3–7 днів', desc: 'Односторінковий сайт для продажу послуги' },
  { id: 'webapp', name: 'Веб-додаток', icon: Zap, price: 12000, time: '2–4 тижні', desc: 'Додаток з авторизацією, базою даних та логікою' },
  { id: 'bot', name: 'Telegram-бот', icon: Bot, price: 4000, time: '3–7 днів', desc: 'Бот для продажів, запису або підтримки' },
  { id: 'software', name: 'Софт / Десктоп', icon: Code, price: 15000, time: '3–5 тижнів', desc: 'Крос-платформний софт або утиліта' },
  { id: 'crm', name: 'CRM-система', icon: BarChart3, price: 20000, time: '4–6 тижнів', desc: 'Управління клієнтами та замовленнями' },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart, price: 15000, time: '2–4 тижні', desc: 'Онлайн-магазин з каталогом та оплатою' },
  { id: 'mobile', name: 'Мобільний додаток', icon: Smartphone, price: 25000, time: '4–8 тижнів', desc: 'iOS / Android додаток під ваш бізнес' },
  { id: 'automation', name: 'Автоматизація', icon: Settings, price: 8000, time: '1–2 тижні', desc: 'Інтеграції, парсери, скрипти' },
  { id: 'other', name: 'Інше / Кастом', icon: HelpCircle, price: 0, time: 'Узгоджується', desc: 'Нестандартний проєкт — обговоримо' },
];
