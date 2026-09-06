import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KOSTEX',
  description: 'Digital Products Studio',
  url: 'https://kostex.example.com',
  logo: 'https://kostex.example.com/logo.png', // заміни на свій логотип
};

export default function Home() {
  return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <Navbar />
      <main className="container py-16">
        <section className="text-center mb-16">
          <Badge>Digital Products Studio</Badge>
          <h1 className="text-5xl md:text-7xl font-bold mt-6 mb-4">
            We build digital<br />products
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            Websites, Web Apps, Software, Bots and custom digital solutions.
          </p>
          <div className="flex gap-4 justify-center">
            <Button href="/builder">Start a Project</Button>
            <Button variant="outline" href="/portfolio">Explore Projects</Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-xl font-semibold mb-2">Website</h3>
            <p className="text-white/60">Modern responsive websites for any business.</p>
          </Card>
          <Card>
            <h3 className="text-xl font-semibold mb-2">Web App</h3>
            <p className="text-white/60">Complex web applications with dashboards.</p>
          </Card>
          <Card>
            <h3 className="text-xl font-semibold mb-2">Bot</h3>
            <p className="text-white/60">Telegram & Discord automation and support.</p>
          </Card>
        </section>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Get in touch</h2>
            <Input label="Your name" placeholder="John Doe" />
            <Input label="Email" type="email" placeholder="john@example.com" />
            <Textarea label="Message" placeholder="Tell us about your project..." />
            <Button>Send Message</Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}