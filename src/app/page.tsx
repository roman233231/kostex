import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Logo from '@/components/layout/Logo';
import Reveal from '@/components/ui/Reveal';

const buildCards = [
  { title: 'Website', href: '/catalog/websites', description: 'Modern responsive websites for any business.' },
  { title: 'Web App', href: '/catalog/web-apps', description: 'Complex web applications with dashboards.' },
  { title: 'Software', href: '/catalog/software', description: 'Desktop apps and custom business software.' },
  { title: 'Bot', href: '/catalog/bots', description: 'Telegram & Discord automation and support.' },
  { title: 'CRM', href: '/catalog/web-apps', description: 'Customer management systems for your team.' },
  { title: 'E-commerce', href: '/catalog/websites', description: 'Online stores with payment integration.' },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          <div className="container relative py-24 md:py-36">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="mb-8 animate-fade-in">
                <Logo
                  size={96}
                  className="w-20 h-20 md:w-24 md:h-24 drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                />
              </div>

              <div className="mb-4 animate-fade-in-up">
                <h2 className="text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase">
                  KOSTEX
                </h2>
                <p className="text-xs md:text-sm text-[var(--text-muted)] tracking-[0.35em] uppercase mt-2">
                  Digital Products Studio
                </p>
              </div>

              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--purple)] to-transparent my-8 animate-fade-in" />

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
                We build digital
                <br />
                <span className="bg-gradient-to-r from-[var(--purple)] to-[var(--purple-neon)] bg-clip-text text-transparent">
                  products
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mb-10 animate-fade-in-up">
                Websites, Web Apps, Software, Bots and custom digital solutions — built for your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
                <Button href="/builder">Start a Project</Button>
                <Button variant="outline" href="/portfolio">Explore Projects</Button>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE BUILD */}
        <section className="container py-20 md:py-28">
          <Reveal>
            <div className="text-center mb-16">
              <Badge>What we build</Badge>
              <h2 className="section-title mt-4">What do you want to build?</h2>
              <p className="section-subtitle mx-auto">
                Choose a category and start creating your digital product.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildCards.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <Link href={item.href} className="block h-full">
                  <Card className="h-full transition-all duration-300 group">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--purple)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-muted)]">{item.description}</p>
                    <div className="mt-4 text-sm text-[var(--purple)] opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore →
                    </div>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container py-20 md:py-28">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-8 py-16 md:py-24 text-center">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 60%)',
                }}
              />
              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Ready to build your project?
                </h2>
                <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto mb-8">
                  Configure your product, see the estimated price, and place an order in minutes.
                </p>
                <Button href="/builder">Start Building</Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}