'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

export default function InspirationPage() {
  const [url, setUrl] = useState('');
  const [likes, setLikes] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-5xl">
        <Reveal>
          <div className="mb-12">
            <Badge>Inspiration</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mt-4 tracking-tight">
              Find your inspiration
            </h1>
            <p className="text-lg text-[var(--text-muted)] mt-4 max-w-2xl">
              Found a website you like? Tell us what you like about it and we&apos;ll create something inspired by your references.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Reveal delay={100} className="lg:col-span-3">
            <Card hover={false}>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">✨</div>
                  <h2 className="text-xl font-semibold mb-2">Thanks for the reference!</h2>
                  <p className="text-[var(--text-muted)] mb-6">
                    We&apos;ll include this in your project when you place an order.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button href="/builder">Start a Project</Button>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>
                      Add another
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Reference URL"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                  <Textarea
                    label="What I like about it"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                    placeholder="I like the navigation and hero section. I want a similar structure but in purple/black."
                    required
                  />
                  <Textarea
                    label="Additional notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any other details..."
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    Submit Reference
                  </Button>
                </form>
              )}
            </Card>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-2 space-y-6">
            <Card hover={false}>
              <h3 className="text-lg font-semibold mb-3">How it works</h3>
              <ol className="space-y-3 text-sm text-[var(--text-muted)]">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--purple)]/15 text-[var(--purple-bright)] flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    1
                  </span>
                  Paste a link to a website you like
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--purple)]/15 text-[var(--purple-bright)] flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    2
                  </span>
                  Tell us what you like about it
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--purple)]/15 text-[var(--purple-bright)] flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    3
                  </span>
                  We create something inspired by it
                </li>
              </ol>
            </Card>
            <Card hover={false} className="border-[var(--purple)]/30">
              <p className="text-sm text-[var(--text-muted)]">
                <strong className="text-[var(--text)]">Note:</strong> We use references for design inspiration only. We never copy other sites, branding, or protected assets.
              </p>
            </Card>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}