'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Logo from '@/components/layout/Logo';
import Reveal from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';
import MagneticButton from '@/components/ui/MagneticButton';
import FAQ from '@/components/ui/FAQ';
import Reviews from '@/components/ui/Reviews';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Truck, Eye, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const buildCards = [
  { titleKey: 'build.website', href: '/catalog/websites', descKey: 'build.websiteDesc', emoji: '🌐', color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  { titleKey: 'build.webapp', href: '/catalog/web-apps', descKey: 'build.webappDesc', emoji: '⚡', color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  { titleKey: 'build.software', href: '/catalog/software', descKey: 'build.softwareDesc', emoji: '💻', color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  { titleKey: 'build.bot', href: '/catalog/bots', descKey: 'build.botDesc', emoji: '🤖', color1: '#10B981', color2: '#14B8A6', glow: 'rgba(16,185,129,0.5)' },
  { titleKey: 'build.crm', href: '/catalog/web-apps', descKey: 'build.crmDesc', emoji: '📊', color1: '#F59E0B', color2: '#F97316', glow: 'rgba(245,158,11,0.5)' },
  { titleKey: 'build.ecommerce', href: '/catalog/websites', descKey: 'build.ecommerceDesc', emoji: '🛒', color1: '#D946EF', color2: '#A855F7', glow: 'rgba(217,70,239,0.5)' },
] as const;

const features = [
  { key: 'builder', icon: Sparkles, color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  { key: 'delivery', icon: Truck, color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  { key: 'transparency', icon: Eye, color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
] as const;

const techStack = ['Next.js', 'React', 'TypeScript', 'Firebase', 'Tauri', 'Tailwind CSS', 'Node.js', 'REST API', 'Stripe', 'OpenAI'];

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        {/* HERO */}
        <section className="relative min-h-[90vh] flex items-center pt-20">
          <div className="grid-bg absolute inset-0 opacity-50" />
          
          {/* Анімовані плями на фоні */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[var(--accent)]/20 rounded-full blur-[120px] animate-float pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

          <div className="container relative z-10 py-20 text-center">
            <div className="mb-8 animate-zoom-in">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[var(--accent)]/40 blur-[50px] rounded-full animate-glow" />
                <Logo size={100} className="relative w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_30px_rgba(139,92,246,0.8)] animate-float" />
              </div>
            </div>

            <Badge className="animate-slide-up delay-100 mb-6">{t('hero.badge')}</Badge>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 animate-slide-up delay-200 leading-[0.95]">
              {t('hero.title1')}<br />
              <span className="text-gradient-animated">{t('hero.title2')}</span>
              <span className="text-[var(--accent)] animate-pulse ml-1">_</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-3)] max-w-2xl mx-auto mb-10 animate-slide-up delay-300">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-400">
              <MagneticButton href="/builder">
                <Button className="btn-lg btn-tactile w-full sm:w-auto shadow-[0_0_30px_var(--accent)] hover:shadow-[0_0_50px_var(--accent)] rounded-full px-8">
                  {t('hero.cta1')} <ArrowRight size={18} className="ml-2" />
                </Button>
              </MagneticButton>
              <MagneticButton href="/portfolio">
                <Button variant="outline" className="btn-lg btn-tactile w-full sm:w-auto rounded-full px-8 border-[var(--accent)]/30 hover:bg-[var(--accent)]/10">
                  {t('hero.cta2')}
                </Button>
              </MagneticButton>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up delay-500">
              {[
                { val: 50, suffix: '+', label: 'hero.stat1', color: 'text-violet-400' },
                { val: '24/7', suffix: '', label: 'hero.stat2', color: 'text-blue-400' },
                { val: 14, prefix: '7–', suffix: '', label: 'hero.stat3', color: 'text-pink-400' },
                { val: 100, suffix: '%', label: 'hero.stat4', color: 'text-emerald-400' }
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center">
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {typeof stat.val === 'number' ? <Counter value={stat.val} prefix={stat.prefix} suffix={stat.suffix} /> : stat.val}
                  </div>
                  <div className="text-xs text-[var(--text-3)] uppercase tracking-widest text-center">{t(stat.label as any)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="py-8 border-y border-[var(--border)] bg-[var(--surface)]/30 backdrop-blur-md relative z-10">
          <div className="marquee">
            <div className="marquee-track">
              {[...techStack, ...techStack].map((tech, i) => (
                <div key={i} className="text-xl font-semibold text-[var(--text-4)] whitespace-nowrap flex items-center gap-12">
                  <span className="hover:text-[var(--accent)] transition-colors cursor-default">{tech}</span>
                  <span className="text-[var(--accent)] opacity-50">✦</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE BUILD */}
        <section className="container py-24 md:py-32 relative">
          <Reveal>
            <div className="text-center mb-16">
              <Badge>{t('sections.whatWeBuild')}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
                {t('sections.whatYouWant')} <span className="text-gradient-animated">{t('sections.build')}</span>?
              </h2>
              <p className="text-lg text-[var(--text-3)] max-w-2xl mx-auto">{t('sections.whatSubtitle')}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildCards.map((item, i) => (
              <Reveal key={item.titleKey} delay={i * 80}>
                <Link href={item.href} className="block h-full group">
                  <div className="glass-card rounded-3xl h-full relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-10px_var(--card-glow)]" style={{ '--card-glow': item.glow } as React.CSSProperties}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="p-8 flex flex-col h-full relative z-10">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ background: `linear-gradient(135deg, ${item.color1}20, ${item.color2}20)`, border: `1px solid ${item.color1}40`, boxShadow: `0 0 20px ${item.glow}` }}>
                        {item.emoji}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-white">{t(item.titleKey)}</h3>
                      <p className="text-[var(--text-3)] flex-1 leading-relaxed mb-6">{t(item.descKey)}</p>
                      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors" style={{ color: item.color1 }}>
                        {t('common.viewDetails')} <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* WHY KOSTEX */}
        <section className="container py-24 md:py-32 border-t border-[var(--border)] relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <Badge>{t('sections.whyUs')}</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-6">
                  {t('sections.whyUsTitle')} <span className="text-gradient-animated">{t('sections.whyUsTitle2')}</span>
                </h2>
                <p className="text-lg text-[var(--text-3)] mb-12">{t('sections.whyUsSubtitle')}</p>
                <div className="space-y-8">
                  {features.map((f, i) => (
                    <Reveal key={f.key} delay={i * 100}>
                      <div className="flex gap-6 group">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg" style={{ background: `linear-gradient(135deg, ${f.color1}, ${f.color2})`, boxShadow: `0 10px 30px -10px ${f.glow}` }}>
                          <f.icon size={28} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[var(--accent)] transition-colors">{t(`features.${f.key}` as any)}</h3>
                          <p className="text-[var(--text-3)] leading-relaxed">{t(`features.${f.key}Desc` as any)}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative glass-card rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <div className="ml-auto text-xs text-[var(--text-4)] font-mono">kostex_terminal</div>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center gap-2 text-[var(--text-3)]"><span className="text-[var(--accent)]">~</span> <span className="text-blue-400">init</span> project</div>
                  <div className="h-2 rounded-full bg-[var(--surface-2)] w-3/4 overflow-hidden"><div className="h-full bg-gradient-to-r from-[var(--accent)] to-blue-500 w-full animate-pulse" /></div>
                  <div className="flex items-center gap-2 text-[var(--text-3)]"><span className="text-[var(--accent)]">✓</span> Design approved</div>
                  <div className="flex items-center gap-2 text-[var(--text-3)]"><span className="text-[var(--accent)]">✓</span> Code deployed</div>
                  <div className="mt-6 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <span className="text-emerald-400 font-bold">Project launched successfully!</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* REVIEWS & FAQ */}
        <section className="container py-24 md:py-32 border-t border-[var(--border)]">
          <Reveal>
            <div className="text-center mb-16">
              <Badge>{t('reviews.badge')}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4">{t('reviews.title')} <span className="text-gradient-animated">{t('reviews.title2')}</span></h2>
              <p className="text-lg text-[var(--text-3)]">{t('reviews.subtitle')}</p>
            </div>
          </Reveal>
          <Reveal delay={100}><Reviews /></Reveal>
        </section>

        <section className="container py-24 md:py-32 border-t border-[var(--border)]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <Reveal className="lg:col-span-2">
              <div className="sticky top-28">
                <Badge>{t('faq.badge')}</Badge>
                <h2 className="text-4xl font-bold mt-6 mb-4">{t('faq.title')} <span className="text-gradient-animated">{t('faq.title2')}</span></h2>
                <p className="text-lg text-[var(--text-3)] mb-10">{t('faq.subtitle')}</p>
                <div className="glass-card rounded-2xl p-6 border-[var(--accent)]/30">
                  <h3 className="font-bold text-lg mb-2">Залишились питання?</h3>
                  <p className="text-sm text-[var(--text-3)] mb-6">Напишіть нам — відповімо протягом 24 годин.</p>
                  <Link href="/contact"><Button variant="outline" className="w-full btn-tactile rounded-xl">{t('cta.contact')}</Button></Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-3"><FAQ /></Reveal>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="container py-24 md:py-32">
          <Reveal>
            <div className="relative overflow-hidden rounded-[3rem] glass-card px-6 py-20 md:py-32 text-center shadow-[0_0_80px_rgba(139,92,246,0.2)]">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent-2)]/10" />
              <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[var(--accent)]/30 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
              
              <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-bold mb-6">
                  {t('cta.title1')}<br />
                  <span className="text-gradient-animated">{t('cta.title2')}</span>?
                </h2>
                <p className="text-xl text-[var(--text-2)] max-w-2xl mx-auto mb-10">{t('cta.subtitle')}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <MagneticButton href="/builder">
                    <Button className="btn-lg btn-tactile rounded-full shadow-[0_0_20px_var(--accent)] px-10">{t('cta.button')} <ArrowRight size={20} /></Button>
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
