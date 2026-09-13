import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const services = [
  {
    title: 'Websites',
    description: 'Landing pages, business sites, e-commerce, blogs and corporate websites.',
    features: ['Responsive design', 'SEO optimized', 'Fast loading', 'CMS integration'],
  },
  {
    title: 'Web Apps',
    description: 'Custom dashboards, CRM, booking systems, SaaS platforms.',
    features: ['User accounts', 'Database', 'Admin panel', 'API integration'],
  },
  {
    title: 'Software',
    description: 'Desktop apps, business software, utilities and custom solutions.',
    features: ['Windows/macOS', 'Offline mode', 'Cloud sync', 'Custom logic'],
  },
  {
    title: 'Bots',
    description: 'Telegram, Discord and automation bots for business.',
    features: ['Automation', 'Support', 'Notifications', 'Integrations'],
  },
  {
    title: 'CRM',
    description: 'Customer relationship management systems tailored to your workflow.',
    features: ['Clients', 'Deals', 'Tasks', 'Reports'],
  },
  {
    title: 'E-commerce',
    description: 'Online stores with payment integration and inventory management.',
    features: ['Catalog', 'Cart', 'Payments', 'Shipping'],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Badge>Services</Badge>
        <h1 className="text-5xl font-bold mt-4">What we do</h1>
        <p className="text-lg text-white/60 mt-4 max-w-2xl">
          We build digital products for businesses of any size.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col">
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-white/60 mt-2 flex-1">{service.description}</p>
              <ul className="mt-4 space-y-1">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-bright"></span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button href="/builder">Start a Project</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}