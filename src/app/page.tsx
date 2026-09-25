'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Logo from '@/components/layout/Logo';
import Reveal from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';
import TiltCard from '@/components/ui/TiltCard';
import MagneticButton from '@/components/ui/MagneticButton';
import FAQ from '@/components/ui/FAQ';
import Reviews from '@/components/ui/Reviews';
import { useLanguage } from '@/context/LanguageContext';

const buildCards = [
  { titleKey: 'build.website', href: '/catalog/websites', descKey: 'build.websiteDesc', icon: '🌐' },
  { titleKey: 'build.webapp', href: '/catalog/web-apps', descKey: 'build.webappDesc', icon: '⚡' },
  { titleKey: 'build.software', href: '/catalog/software', descKey: 'build.softwareDesc', icon: '💻' },
  { titleKey: 'build.bot', href: '/catalog/bots', descKey: 'build.botDesc', icon: '🤖' },
  { titleKey: 'build.crm', href: '/catalog/web-apps', descKey: 'build.crmDesc', icon: '📊' },
  { titleKey: 'build.ecommerce', href: '/catalog/websites', descKey: 'build.ecommerceDesc', icon: '🛒' },
] as const;

const techStack = ['Next.js', 'React', 'TypeScript', 'Firebase', 'Tauri', 'Tailwind CSS', 'Node.js', 'REST API', 'Stripe', 'OpenAI'];

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden min-h-[80vh] md:min-h-[88vh] flex items-center">
          <div className="grid-bg" />

          <div
            className="glow-orb animate-float-slow hidden md:block"
            style={{
              top: '-10%',
              left: '20%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)',
            }}
          />
          <div
            className="glow-orb animate-float hidden md:block"
            style={{
              bottom: '-15%',
              right: '10%',
              width: '550px',
              height: '550px',
              background: 'radial-gradient(circle, rgba(192,38,255,0.18), transparent 70%)',
              animationDelay: '2s',
            }}
          />

          <div className="container relative py-16 md:py-28">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="mb-6 md:mb-7 animate-fade-down">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(139,92,246,0.5), transparent 70%)',
                      filter: 'blur(40px)',
                      animation: 'pulse 4s ease-in-out infinite',
                    }}
                  />
                  <Logo
                    size={88}
                    className="relative w-16 h-16 md:w-24 md:h-24 drop-shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                  />
                </div>
              </div>

              <div className="animate-fade-up delay-100 mb-4 md:mb-5">
                <Badge>{t('hero.badge')}</Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-5 md:mb-6 animate-fade-up delay-200 leading-[0.95]">
                {t('hero.title1')}
                <br />
                <span className="gradient-text">{t('hero.title2')}</span>
                <span className="text-[var(--purple)] animate-blink ml-1">_</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mb-7 md:mb-9 animate-fade-up delay-300 px-2">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-up delay-400 w-full sm:w-auto px-4 sm:px-0">
                <MagneticButton href="/builder" className="w-full sm:w-auto">
                  <Button className="btn-lg w-full sm:w-auto">{t('hero.cta1')} →</Button>
                </MagneticButton>
                <MagneticButton href="/portfolio" className="w-full sm:w-auto">
                  <Button variant="outline" className="btn-lg w-full sm:w-auto">{t('hero.cta2')}</Button>
                </MagneticButton>
              </div>

              <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full max-w-3xl animate-fade-up delay-600">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold gradient-text">
                    <Counter value={50} suffix="+" />
                  </div>
                  <div className="text-[10px] md:text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1">
                    {t('hero.stat1')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold gradient-text">24/7</div>
                  <div className="text-[10px] md:text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1">
                    {t('hero.stat2')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold gradient-text">
                    <Counter value={14} prefix="7–" />
                  </div>
                  <div className="text-[10px] md:text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1">
                    {t('hero.stat3')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold gradient-text">
                    <Counter value={100} suffix="%" />
                  </div>
                  <div className="text-[10px] md:text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1">
                    {t('hero.stat4')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="py-5 md:py-6 border-y border-[var(--border)] bg-[var(--surface)]/40">
          <div className="marquee">
            <div className="marquee-track">
              {[...techStack, ...techStack].map((tech, i) => (
                <div
                  key={i}
                  className="text-base md:text-xl font-semibold text-[var(--text-faint)] whitespace-nowrap flex items-center gap-8 md:gap-14"
                >
                  <span>{tech}</span>
                  <span className="text-[var(--purple)]">✦</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE BUILD */}
        <section className="container py-16 md:py-28">
          <Reveal>
            <div className="text-center mb-10 md:mb-14">
              <Badge>{t('sections.whatWeBuild')}</Badge>
              <h2 className="section-title mt-4">
                {t('sections.whatYouWant')}{' '}
                <span className="gradient-text">{t('sections.build')}</span>?
              </h2>
              <p className="section-subtitle mx-auto">{t('sections.whatSubtitle')}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {buildCards.map((item, i) => (
              <Reveal key={item.titleKey} delay={i * 70}>
                <Link href={item.href} className="block h-full">
                  <TiltCard className="h-full">
                    <Card className="h-full flex flex-col group">
                      <div className="text-3xl md:text-4xl mb-3 md:mb-4 transition-transform duration-500 group-hover:scale-110">
                        {item.icon}
                      </div>
                      <h3 className="text-base md:text-lg font-bold mb-2 group-hover:text-[var(--purple)] transition-colors">
                        {t(item.titleKey)}
                      </h3>
                      <p className="text-[var(--text-muted)] text-sm flex-1">{t(item.descKey)}</p>
                      <div className="mt-4 text-sm text-[var(--purple)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        {t('common.viewDetails')} <span>→</span>
                      </div>
                    </Card>
                  </TiltCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* WHY KOSTEX */}
        <section className="container py-16 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
            <Reveal>
              <div>
                <Badge>{t('sections.whyUs')}</Badge>
                <h2 className="section-title mt-4">
                  {t('sections.whyUsTitle')}{' '}
                  <span className="gradient-text">{t('sections.whyUsTitle2')}</span>
                </h2>
                <p className="section-subtitle mt-3 md:mt-4">{t('sections.whyUsSubtitle')}</p>

                <div className="mt-7 md:mt-9 space-y-4 md:space-y-5">
                  {(['builder', 'delivery', 'transparency'] as const).map((key, i) => (
                    <Reveal key={key} delay={i * 100}>
                      <div className="flex gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-[var(--purple-soft)] border border-[var(--border-purple)] flex items-center justify-center text-[var(--purple-bright)] font-bold shrink-0 text-sm">
                          ✓
                        </div>
                        <div>
                          <h3 className="font-semibold mb-0.5 text-sm md:text-base">
                            {t(`features.${key}` as any)}
                          </h3>
                          <p className="text-xs md:text-sm text-[var(--text-muted)]">
                            {t(`features.${key}Desc` as any)}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
                    filter: 'blur(60px)',
                  }}
                />
                <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                  <div className="flex gap-2 mb-4 md:mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-2 rounded-full bg-[var(--surface-2)] w-3/4" />
                    <div className="h-2 rounded-full bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] w-full" />
                    <div className="h-2 rounded-full bg-[var(--surface-2)] w-5/6" />
                    <div className="h-2 rounded-full bg-[var(--surface-2)] w-2/3" />
                    <div className="mt-4 md:mt-5 grid grid-cols-3 gap-2.5">
                      <div className="h-12 md:h-14 rounded-lg bg-[var(--surface-2)]" />
                      <div className="h-12 md:h-14 rounded-lg bg-[var(--purple-soft)] border border-[var(--border-purple)]" />
                      <div className="h-12 md:h-14 rounded-lg bg-[var(--surface-2)]" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="container py-16 md:py-28">
          <Reveal>
            <div className="text-center mb-10 md:mb-14">
              <Badge>{t('reviews.badge')}</Badge>
              <h2 className="section-title mt-4">
                {t('reviews.title')}{' '}
                <span className="gradient-text">{t('reviews.title2')}</span>
              </h2>
              <p className="section-subtitle mx-auto">{t('reviews.subtitle')}</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Reviews />
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="container py-16 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            <Reveal className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <Badge>{t('faq.badge')}</Badge>
                <h2 className="section-title mt-4">
                  {t('faq.title')}{' '}
                  <span className="gradient-text">{t('faq.title2')}</span>
                </h2>
                <p className="section-subtitle mt-3">{t('faq.subtitle')}</p>

                <div className="mt-7 md:mt-8 p-4 md:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                  <div className="font-semibold mb-2 text-sm md:text-base">Still have questions?</div>
                  <p className="text-xs md:text-sm text-[var(--text-muted)] mb-4">
                    Write to us and we'll get back within 24 hours.
                  </p>
                  <Link href="/contact">
                    <Button variant="outline">{t('cta.contact')}</Button>
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100} className="lg:col-span-3">
              <FAQ />
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-16 md:py-28">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 md:px-8 py-12 md:py-24 text-center">
              <div className="grid-bg" />
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
                  filter: 'blur(60px)',
                }}
              />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-5 tracking-tight">
                  {t('cta.title1')}
                  <br />
                  <span className="gradient-text">{t('cta.title2')}</span>?
                </h2>
                <p className="text-base md:text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-7 md:mb-9">
                  {t('cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <MagneticButton href="/builder">
                    <Button className="btn-lg">{t('cta.button')} →</Button>
                  </MagneticButton>
                  <MagneticButton href="/contact">
                    <Button variant="outline" className="btn-lg">{t('cta.contact')}</Button>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}