export interface BlogPost {
  slug: string;
  category: string;
  date: string;
  readingTime: number;
  titleUk: string;
  titleEn: string;
  excerptUk: string;
  excerptEn: string;
  contentUk: string[];
  contentEn: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-business-needs-website-2026',
    category: 'Business',
    date: '2026-09-15',
    readingTime: 4,
    titleUk: 'Чому кожному бізнесу потрібен сайт у 2026 році',
    titleEn: 'Why every business needs a website in 2026',
    excerptUk: 'Соцмережі — це добре, але вони не замінюють власний сайт. Розповідаємо, чому.',
    excerptEn: 'Social media is great, but it doesn\'t replace your own website. Here\'s why.',
    contentUk: [
      'У 2026 році наявність сайту — це не розкіш, а базова необхідність. Клієнти гуглять перед тим, як зателефонувати або замовити послугу. Якщо вас немає в пошуку — вас не існує.',
      'Соцмережі — це чудовий канал для залучення, але вони не контролюються вами. Алгоритми змінюються, акаунти блокують, охоплення падає. Сайт — це ваша власна платформа, де ви встановлюєте правила.',
      'Сайт працює 24/7. Він приймає замовлення, відповідає на питання, показує портфоліо та збирає контакти — навіть коли ви спите.',
      'Крім того, сайт — це довіра. Бізнес без сайту виглядає менш серйозно, ніж конкурент з охайним лендінгом. Клієнти готові платити більше тим, хто виглядає професійно.',
      'І ще один момент: SEO. Ваш сайт може приводити безкоштовних клієнтів з Google роками. Це найдешевший канал залучення у довгостроковій перспективі.',
    ],
    contentEn: [
      'In 2026, having a website is not a luxury — it\'s a basic necessity. Customers Google before they call or order a service. If you\'re not in search results — you don\'t exist.',
      'Social media is a great channel for acquisition, but it\'s not controlled by you. Algorithms change, accounts get blocked, reach drops. A website is your own platform where you set the rules.',
      'A website works 24/7. It accepts orders, answers questions, shows your portfolio and collects contacts — even while you sleep.',
      'Moreover, a website builds trust. A business without a website looks less serious than a competitor with a clean landing page. Customers are willing to pay more to those who look professional.',
      'And one more thing: SEO. Your website can bring free clients from Google for years. This is the cheapest acquisition channel in the long run.',
    ],
  },
  {
    slug: '5-mistakes-small-business-websites',
    category: 'Tips',
    date: '2026-09-10',
    readingTime: 5,
    titleUk: '5 помилок на сайтах малого бізнесу',
    titleEn: '5 mistakes on small business websites',
    excerptUk: 'Ці 5 помилок вбивають конверсію вашого сайту. Перевірте, чи немає їх у вас.',
    excerptEn: 'These 5 mistakes kill your website conversion. Check if you have them.',
    contentUk: [
      'Помилка №1: Повільне завантаження. Якщо сайт вантажиться довше 3 секунд — 53% відвідувачів йдуть назавжди. Перевірте швидкість через PageSpeed Insights.',
      'Помилка №2: Немає чіткого заклику до дії. Користувач має зрозуміти за 5 секунд, що ви пропонуєте і що йому робити далі. Одна кнопка, одна дія, один результат.',
      'Помилка №3: Погана мобільна версія. 70% трафіку — з телефону. Якщо ваш сайт криво виглядає на смартфоні — ви втрачаєте більшість клієнтів.',
      'Помилка №4: Немає контактів на видному місці. Телефон, email, месенджери — все має бути на першому екрані. Клієнт не буде шукати, як з вами зв\'язатись.',
      'Помилка №5: Застарілий дизайн. Сайт 2015 року виглядає так само, як і бізнес 2015 року. Інвестуйте в оновлення — це окупиться за перший місяць.',
    ],
    contentEn: [
      'Mistake #1: Slow loading. If your site takes more than 3 seconds — 53% of visitors leave forever. Check speed via PageSpeed Insights.',
      'Mistake #2: No clear call to action. The user must understand in 5 seconds what you offer and what to do next. One button, one action, one result.',
      'Mistake #3: Bad mobile version. 70% of traffic is from phones. If your site looks broken on a smartphone — you lose most clients.',
      'Mistake #4: No contacts in a visible place. Phone, email, messengers — all should be on the first screen. The client won\'t look for how to contact you.',
      'Mistake #5: Outdated design. A 2015 website looks the same as a 2015 business. Invest in an upgrade — it will pay off in the first month.',
    ],
  },
  {
    slug: 'landing-vs-multipage',
    category: 'Guide',
    date: '2026-09-05',
    readingTime: 6,
    titleUk: 'Landing page чи багатосторінковий сайт — що обрати?',
    titleEn: 'Landing page or multi-page website — what to choose?',
    excerptUk: 'Розбираємо плюси та мінуси обох варіантів, щоб ви зробили правильний вибір.',
    excerptEn: 'We analyze pros and cons of both options so you make the right choice.',
    contentUk: [
      'Landing page — це односторінковий сайт з фокусом на одну дію. Ідеально, коли у вас одна послуга або продукт, і ви хочете швидко запустити рекламу.',
      'Переваги лендінгу: швидко зробити (5-10 днів), дешевше, вся інформація на одному екрані, вища конверсія для реклами.',
      'Багатосторінковий сайт — це 5+ сторінок з різними секціями: про компанію, послуги, кейси, блог. Підходить для бізнесів з кількома напрямками.',
      'Переваги багатосторінкового: краще для SEO (більше точок входу), гнучкіше для росту, виглядає солідніше, дозволяє розповісти історію.',
      'Що обрати? Якщо ви щойно запускаєтесь і хочете швидко тестувати — беріть лендінг. Якщо плануєте довгостроково розвиватись — інвестуйте в багатосторінковий сайт.',
      'Найкращий варіант — почати з лендінгу, а потім розширювати його до багатосторінкового. Так ви швидко отримаєте перших клієнтів і не витратите зайвого.',
    ],
    contentEn: [
      'A landing page is a one-page website focused on one action. Ideal when you have one service or product, and you want to quickly launch ads.',
      'Advantages of landing: fast to make (5-10 days), cheaper, all info on one screen, higher conversion for ads.',
      'A multi-page website has 5+ pages with different sections: about, services, cases, blog. Suitable for businesses with multiple directions.',
      'Advantages of multi-page: better for SEO (more entry points), more flexible for growth, looks more solid, allows telling a story.',
      'What to choose? If you\'re just launching and want to test quickly — go with landing. If you plan long-term development — invest in a multi-page website.',
      'The best option is to start with a landing and then expand it to multi-page. This way you\'ll get first clients fast and won\'t overspend.',
    ],
  },
];