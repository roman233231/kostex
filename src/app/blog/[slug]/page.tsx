'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { blogPosts } from '@/data/blog';

export default function BlogPostPage() {
  const { lang, t } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const title = lang === 'uk' ? post.titleUk : post.titleEn;
  const content = lang === 'uk' ? post.contentUk : post.contentEn;

  return (
    <>
      <Navbar />
      <main className="container py-16">
        <Link
          href="/blog"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors inline-flex items-center gap-1"
        >
          ← Back to Blog
        </Link>

        <Reveal>
          <article className="max-w-3xl mx-auto mt-8">
            <Badge>{post.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mt-4 tracking-tight leading-[1.1]">
              {title}
            </h1>
            <div className="flex items-center gap-4 mt-5 text-sm text-[var(--text-faint)]">
              <span>
                {new Date(post.date).toLocaleDateString(
                  lang === 'uk' ? 'uk-UA' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--text-faint)]" />
              <span>{post.readingTime} min read</span>
            </div>

            <div className="mt-10 space-y-6">
              {content.map((paragraph, i) => (
                <p key={i} className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-14 p-8 rounded-2xl border border-[var(--border-purple)] bg-gradient-to-b from-[var(--purple-soft)] to-transparent text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                {lang === 'uk' ? 'Потрібен сайт або додаток?' : 'Need a website or app?'}
              </h3>
              <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
                {lang === 'uk'
                  ? 'Налаштуйте свій проєкт у конструкторі та побачте ціну одразу.'
                  : 'Configure your project in the builder and see the price instantly.'}
              </p>
              <Link href="/builder">
                <Button>{lang === 'uk' ? 'Почати проєкт' : 'Start a Project'}</Button>
              </Link>
            </div>
          </article>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}