'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, CreditCard, Clock, RefreshCw, AlertCircle, Scale } from 'lucide-react';

const sections = [
  {
    icon: FileText,
    title: 'Загальні положення',
    text: 'Використовуючи сайт KOSTEX, ви погоджуєтесь з цими Умовами. Ми залишаємо за собою право змінювати умови в будь-який час. Зміни набувають чинності з моменту публікації на цій сторінці. Продовжуючи користуватись сайтом після змін, ви автоматично приймаєте нові умови.',
  },
  {
    icon: CreditCard,
    title: 'Замовлення та оплата',
    text: 'Всі замовлення оформлюються через конструктор на сайті. Ціни вказані як орієнтовні. Остаточна вартість узгоджується індивідуально після обговорення всіх деталей проєкту. Оплата здійснюється за графіком, узгодженим з обома сторонами — як правило, 50% передоплата та 50% після завершення.',
  },
  {
    icon: Clock,
    title: 'Терміни виконання',
    text: 'Орієнтовні терміни вказані для кожного продукту. Фактичні терміни можуть відрізнятися в залежності від складності, кількості правок та своєчасності надання матеріалів клієнтом. Ми завжди намагаємось дотримуватись узгоджених дедлайнів.',
  },
  {
    icon: RefreshCw,
    title: 'Правки та доопрацювання',
    text: 'Кількість безкоштовних правок залежить від обраного тарифу. Правки, не пов\'язані з початковим технічним завданням (зміна концепції, додавання нових функцій), оплачуються окремо згідно з прайсом.',
  },
  {
    icon: AlertCircle,
    title: 'Відповідальність',
    text: 'KOSTEX не несе відповідальності за: зміст матеріалів, наданих клієнтом, роботу сторонніх сервісів (хостинг, платіжні системи тощо), збитки, спричинені неправильним використанням продукту. Клієнт несе відповідальність за достовірність наданих даних.',
  },
  {
    icon: Scale,
    title: 'Права на продукт',
    text: 'Після повної оплати всі права на створений продукт переходять до клієнта. KOSTEX залишає за собою право використовувати роботу в портфоліо (за згодою клієнта). Вихідний код та файли передаються клієнту після фінального розрахунку.',
  },
];

export default function TermsPage() {
  const { lang } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen max-w-4xl">
        <Reveal>
          <div className="text-center mb-16">
            <Badge className="mb-4">Legal</Badge>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent)] animate-float" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
                <FileText size={36} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gradient-animated">
              Умови використання
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)] max-w-2xl mx-auto">
              Правила співпраці з KOSTEX. Будь ласка, уважно прочитайте перед оформленням замовлення.
            </p>
            <p className="text-sm text-[var(--text-4)] mt-4">
              Останнє оновлення: {new Date().toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </Reveal>

        <div className="space-y-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <Reveal key={i} delay={i * 60}>
                <div className="glass-card rounded-3xl p-8 md:p-10 hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold mb-3 text-[var(--text)]">
                        {section.title}
                      </h2>
                      <p className="text-base text-[var(--text-3)] leading-relaxed">
                        {section.text}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={400}>
          <div className="mt-12 glass-card rounded-3xl p-8 md:p-10 text-center border-[var(--accent)]/30">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-[var(--text)]">
              Маєте запитання щодо умов?
            </h2>
            <p className="text-[var(--text-3)] mb-6 max-w-lg mx-auto">
              Зв'яжіться з нами — ми розповімо про всі деталі співпраці.
            </p>
            <a href="mailto:kostex.official@gmail.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:brightness-110 transition-all btn-tactile shadow-[0_0_20px_var(--accent)]">
              <FileText size={18} /> Написати нам
            </a>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
