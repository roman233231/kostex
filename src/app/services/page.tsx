import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

const services = [
  {
    title: 'Websites',
    description: 'Landing pages, business sites, e-commerce, blogs and corporate websites.',
    features: ['Responsive design', 'SEO optimized', 'Fast loading', 'CMS integration'],
    href: '/catalog/websites',
  },
  {
    title: 'Web Apps',
    description: 'Custom dashboards, CRM, booking systems, SaaS platforms.',
    features: ['User accounts', 'Database', 'Admin panel', 'API integration'],
    href: '/catalog/web-apps',
  },
  {
    title: 'Software',
    description: 'Desktop apps, business software, utilities and custom solutions.',
    features: ['Windows/macOS', 'Offline mode', 'Cloud sync', 'Custom logic'],
    href: '/catalog/software',
  },
  {
    title: 'Bots',
    description: 'Telegram, Discord and automation bots for business.',
    features: ['Automation', 'Support', 'Notifications', 'Integrations'],
    href: '/catalog/bots',
  },
  {
    title: 'CRM',
    description: 'Customer relationship management systems tailored to your workflow.',
    features: ['Clients', 'Deals', 'Tasks', 'Reports'],
    href: '/catalog/web-apps',
  },
  {
    title: 'E-commerce',
    description: 'Online stores with payment integration and inventory management.',
    features: ['Catalog', 'Cart', 'Payments', 'Shipping'],
    href: '/catalog/websites',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Reveal>
          <div className="mb-16 max-w-3xl">
            <Badge>Services</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mt-4 tracking-tight">
              What we do
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4">
              We build digital products for businesses of any size. Choose a direction and start your project.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 60}>
              <Card className="flex flex-col h-full group transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--purple)] transition-colors">
                  {service.title}
                </h3>
                <p className="text-[var(--text-muted)] mb-5 flex-1">{service.description}</p>
                <ul className="space-y-1.5 mb-6">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--purple-bright)] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" href={service.href} className="w-full">
                  Explore
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not sure what you need?
            </h2>
            <p className="text-[var(--text-muted)] mb-6 max-w-xl mx-auto">
              Start with a base product and customize it — we'll help you decide.
            </p>
            <Button href="/builder">Open Builder</Button>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}