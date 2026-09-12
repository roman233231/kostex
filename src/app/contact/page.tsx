import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-2xl">
        <Badge>Contact</Badge>
        <h1 className="text-5xl font-bold mt-4">Get in touch</h1>
        <p className="text-white/60 mt-4 mb-8">
          Have a question or want to discuss a project? Send us a message.
        </p>

        <div className="space-y-4">
          <Input label="Your name" placeholder="John Doe" />
          <Input label="Email" type="email" placeholder="john@example.com" />
          <Textarea label="Message" placeholder="Tell us about your project..." />
          <Button>Send Message</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}