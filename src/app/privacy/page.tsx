'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, Lock, Eye, Database, Mail, UserCheck } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Які дані ми збираємо',
    text: 'Ми збираємо лише необхідну інформацію для надання послуг: ваше ім\'я, email-адресу, контактні дані та інформацію про ваші замовлення. Ми не збираємо дані банківських карток напряму — всі платежі обробляються через захищені платіжні системи.',
  },
  {
    icon: Eye,
    title: 'Як ми використовуємо ваші дані',
    text: 'Ваші дані використовуються виключно для: обробки замовлень, комунікації щодо проєктів, покращення якості послуг та надсилання важливих оновлень. Ми ніколи не продаємо та не передаємо ваші дані третім особам для маркетингових цілей.',
  },
  {
    icon: Lock,
    title: 'Як ми захищаємо дані',
    text: 'Усі дані зберігаються на захищених серверах Firebase (Google Cloud) з шифруванням. Доступ до персональних даних мають лише уповноважені співробітники KOSTEX. Ми використовуємо сучасні методи автентифікації та шифрування для захисту вашої інформації.',
  },
  {
    icon: UserCheck,
    title: 'Ваші права',
    text: 'Ви маєте право: отримати доступ до своїх даних, вимагати їх виправлення або видалення, відкликати згоду на обробку, подати скаргу до контролюючого органу. Для реалізації будь-якого з цих прав — зв\'яжіться з нами.',
  },
  {
    icon: Mail,
    title: 'Контакти',
    text: 'З будь-яких питань щодо обробки персональних даних звертайтесь на email: kostex.official@gmail.com. Ми відповідаємо протягом 24-48 годин.',
  },
];

export default function PrivacyPage() {
  const { lang } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen max-w-4xl">
        <Reveal>
          <div className="text-center mb-16">
            <Badge className="mb-4">Legal</Badge>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-[0_10px_30px_-10px_var(--accent)] animate-float" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                <Shield size={36} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gradient-animated">
              Політика конфіденційності
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)] max-w-2xl mx-auto">
              Ми серйозно ставимось до захисту ваших персональних даних. Ось як ми збираємо, використовуємо та захищаємо інформацію.
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
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
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
              Маєте питання щодо конфіденційності?
            </h2>
            <p className="text-[var(--text-3)] mb-6 max-w-lg mx-auto">
              Зв'яжіться з нами, і ми відповімо на всі ваші питання щодо обробки даних.
            </p>
            <a href="mailto:kostex.official@gmail.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:brightness-110 transition-all btn-tactile shadow-[0_0_20px_var(--accent)]">
              <Mail size={18} /> Написати нам
            </a>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
