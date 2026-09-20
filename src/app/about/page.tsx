import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

const values = [
  {
    title: 'Premium Quality',
    description: 'Every project is built with attention to detail, clean code, and modern design.',
  },
  {
    title: 'Fast Delivery',
    description: 'We value your time — most projects are delivered within 1-3 weeks.',
  },
  {
    title: 'Transparent Process',
    description: 'You see the price, timeline, and progress at every step through your account.',
  },
  {
    title: 'Custom Approach',
    description: 'No templates forced on you — we build exactly what your business needs.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <Badge>About</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mt-4 tracking-tight">
              We build digital products that work
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-6">
              KOSTEX is a digital products studio. We create websites, web apps, software, bots, and custom digital solutions for businesses of any size.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <Reveal delay={0}>
            <Card hover={false} className="text-center py-8">
              <div className="text-4xl font-bold text-[var(--purple-bright)]">50+</div>
              <div className="text-sm text-[var(--text-muted)] mt-2 uppercase tracking-wider">
                Projects Delivered
              </div>
            </Card>
          </Reveal>
          <Reveal delay={80}>
            <Card hover={false} className="text-center py-8">
              <div className="text-4xl font-bold text-[var(--purple-bright)]">7–14</div>
              <div className="text-sm text-[var(--text-muted)] mt-2 uppercase tracking-wider">
                Days Average Delivery
              </div>
            </Card>
          </Reveal>
          <Reveal delay={160}>
            <Card hover={false} className="text-center py-8">
              <div className="text-4xl font-bold text-[var(--purple-bright)]">100%</div>
              <div className="text-sm text-[var(--text-muted)] mt-2 uppercase tracking-wider">
                Custom Made
              </div>
            </Card>
          </Reveal>
        </div>

        <Reveal>
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our values</h2>
            <p className="text-[var(--text-muted)]">
              What makes KOSTEX different from a typical web studio.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <Card hover={false} className="h-full">
                <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
                <p className="text-[var(--text-muted)]">{v.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to work with us?</h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-xl mx-auto">
              Start your project in the builder, or contact us for a custom solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/builder">Start a Project</Button>
              <Button variant="outline" href="/contact">Contact Us</Button>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}