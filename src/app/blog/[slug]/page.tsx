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
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';

const categoryColors: Record<string, { color1: string; color2: string; glow: string }> = {
  Business: { color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  Tips: { color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  Guide: { color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  Design: { color1: '#10B981', color2: '#14B8A6', glow: 'rgba(16,185,129,0.5)' },
  Tech: { color1: '#F59E0B', color2: '#F97316', glow: 'rgba(245,158,11,0.5)' },
};

export default function BlogPostPage() {
  const { lang } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const title = lang === 'uk' ? post.titleUk : post.titleEn;
  const content = lang === 'uk' ? post.contentUk : post.contentEn;
  const colors = categoryColors[post.category] || categoryColors.Business;

  return (
    <>
      <Navbar />
      <main className="container py-12 md:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <Reveal>
          <article className="max-w-3xl mx-auto">
            <span
              className="inline-flex px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-5"
              style={{
                background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`,
                boxShadow: `0 8px 20px -8px ${colors.glow}`,
              }}
            >
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-5">
              {title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-[var(--text-faint)] flex-wrap mb-10">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(post.date).toLocaleDateString(
                  lang === 'uk' ? 'uk-UA' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--text-faint)]" />
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readingTime} min read
              </span>
            </div>

            <div className="space-y-5 md:space-y-6">
              {content.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* CTA */}
            <div
              className="mt-12 md:mt-16 rounded-3xl overflow-hidden relative"
              style={
                {
                  '--card-color-1': colors.color1,
                  '--card-color-2': colors.color2,
                  '--card-glow': colors.glow,
                } as React.CSSProperties
              }
            >
              <div className="color-card">
                <div className="color-card-inner !p-8 md:!p-10">
                  <div className="color-card-content text-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-3">
                      {lang === 'uk' ? 'Потрібен сайт або додаток?' : 'Need a website or app?'}
                    </h3>
                    <p className="text-sm md:text-base text-[var(--text-muted)] mb-6 max-w-md mx-auto">
                      {lang === 'uk'
                        ? 'Налаштуйте свій проєкт у конструкторі та побачте ціну одразу.'
                        : 'Configure your project in the builder and see the price instantly.'}
                    </p>
                    <Link href="/builder">
                      <Button>
                        {lang === 'uk' ? 'Почати проєкт' : 'Start a Project'}
                        <ArrowRight size={18} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}