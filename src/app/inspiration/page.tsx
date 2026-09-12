import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function InspirationPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-2xl">
        <Badge>Inspiration</Badge>
        <h1 className="text-5xl font-bold mt-4">Find your inspiration</h1>
        <p className="text-white/60 mt-4 mb-8">
          Found a website you like? Tell us what you like about it and we'll create something inspired by your references.
        </p>

        <div className="space-y-4">
          <Input label="Reference URL" placeholder="https://example.com" />
          <Textarea label="What I like" placeholder="I like the navigation and hero section..." />
          <Button>Submit Reference</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}