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

const buildCards = [
  { title: 'Website', href: '/catalog/websites', description: 'Modern responsive websites for any business.', icon: '🌐' },
  { title: 'Web App', href: '/catalog/web-apps', description: 'Complex applications with dashboards and auth.', icon: '⚡' },
  { title: 'Software', href: '/catalog/software', description: 'Desktop apps and custom business software.', icon: '💻' },
  { title: 'Bot', href: '/catalog/bots', description: 'Telegram & Discord automation and support.', icon: '🤖' },
  { title: 'CRM', href: '/catalog/web-apps', description: 'Customer management systems for your team.', icon: '📊' },
  { title: 'E-commerce', href: '/catalog/websites', description: 'Online stores with payment integration.', icon: '🛒' },
];

const techStack = ['Next.js', 'React', 'TypeScript', 'Firebase', 'Tauri', 'Tailwind CSS', 'Node.js', 'REST API', 'Stripe', 'OpenAI'];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          <div className="grid-bg" />

          <div
            className="glow-orb animate-float-slow"
            style={{
              top: '-10%',
              left: '20%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)',
            }}
          />
          <div
            className="glow-orb animate-float"
            style={{
              bottom: '-15%',
              right: '10%',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(192,38,255,0.2), transparent 70%)',
              animationDelay: '2s',
            }}
          />

          <div className="container relative z-10 py-24 md:py-32">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="mb-8 animate-fade-down">
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
                    size={96}
                    className="relative w-20 h-20 md:w-24 md:h-24 drop-shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                  />
                </div>
              </div>

              <div className="animate-fade-up delay-100 mb-6">
                <Badge>Digital Products Studio</Badge>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-fade-up delay-200">
                We build digital
                <br />
                <span className="gradient-text">products</span>
                <span className="text-[var(--purple)] animate-blink">_</span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mb-10 animate-fade-up delay-300">
                Websites, Web Apps, Software, Bots and custom digital solutions — built for your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-400">
                <MagneticButton href="/builder">
                  <Button className="btn-lg">Start a Project →</Button>
                </MagneticButton>
                <MagneticButton href="/portfolio">
                  <Button variant="outline" className="btn-lg">Explore Projects</Button>
                </MagneticButton>
              </div>

              {/* COUNTER STATS */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl animate-fade-up delay-600">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">
                    <Counter value={50} suffix="+" />
                  </div>
                  <div className="text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1">
                    Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">
                    24/7
                  </div>
                  <div className="text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1">
                    Support
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">
                    <Counter value={14} prefix="7–" /> <span className="text-xl">days</span>
                  </div>
                  <div className="text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1">
                    Avg delivery
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text">
                    <Counter value={100} suffix="%" />
                  </div>
                  <div className="text-xs text-[var(--text-faint)] uppercase tracking-wider mt-1">
                    Custom
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="py-8 border-y border-[var(--border)] bg-[var(--surface)]/50">
          <div className="marquee">
            <div className="marquee-track">
              {[...techStack, ...techStack].map((tech, i) => (
                <div key={i} className="text-xl md:text-2xl font-semibold text-[var(--text-faint)] whitespace-nowrap">
                  {tech}
                  <span className="text-[var(--purple)] mx-8">✦</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT WE BUILD */}
        <section className="container py-24 md:py-32">
          <Reveal>
            <div className="text-center mb-16">
              <Badge>What we build</Badge>
              <h2 className="section-title mt-4">
                What do you want to <span className="gradient-text">build</span>?
              </h2>
              <p className="section-subtitle mx-auto">
                Choose a category and start creating your digital product.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildCards.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <Link href={item.href} className="block h-full">
                  <TiltCard className="h-full">
                    <Card className="h-full flex flex-col">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-[var(--text-muted)] flex-1">{item.description}</p>
                      <div className="mt-5 text-sm text-[var(--purple)]">Explore →</div>
                    </Card>
                  </TiltCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container py-24 md:py-32">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-8 py-20 md:py-28 text-center">
              <div className="grid-bg" />
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)',
                  filter: 'blur(60px)',
                }}
              />
              <div className="relative">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                  Ready to build<br />
                  your <span className="gradient-text">project</span>?
                </h2>
                <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto mb-10">
                  Configure your product, see the estimated price, and place an order in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <MagneticButton href="/builder">
                    <Button className="btn-lg">Start Building →</Button>
                  </MagneticButton>
                  <MagneticButton href="/contact">
                    <Button variant="outline" className="btn-lg">Contact Us</Button>
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