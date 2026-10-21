'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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

  if (!post) notFound();

  const title = lang === 'uk' ? post.titleUk : post.titleEn;
  const content = lang === 'uk' ? post.contentUk : post.contentEn;
  const colors = categoryColors[post.category] || categoryColors.Business;

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <Link href="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-sm font-medium text-[var(--text-3)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all mb-10 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>
        </Reveal>

        <Reveal delay={50}>
          <article className="max-w-3xl mx-auto">
            <span className="inline-flex px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-6 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`, boxShadow: `0 8px 20px -8px ${colors.glow}` }}>
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-6 text-[var(--text)]">
              {title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-[var(--text-3)] flex-wrap mb-12 pb-8 border-b border-[var(--border)]">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--surface-2)]">
                <Calendar size={14} />
                {new Date(post.date).toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--surface-2)]">
                <Clock size={14} />
                {post.readingTime} min read
              </span>
            </div>

            <div className="space-y-6 md:space-y-8">
              {content.map((paragraph, i) => (
                <p key={i} className="text-base md:text-lg text-[var(--text-2)] leading-[1.8] font-normal">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 md:mt-20">
              <div className="glass-card rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[80px] opacity-30" style={{ background: colors.glow }} />
                
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text)] relative z-10">
                  {lang === 'uk' ? 'Потрібен сайт або додаток?' : 'Need a website or app?'}
                </h3>
                <p className="text-base text-[var(--text-3)] mb-8 max-w-md mx-auto relative z-10">
                  {lang === 'uk'
                    ? 'Налаштуйте свій проєкт у конструкторі та побачте ціну одразу.'
                    : 'Configure your project in the builder and see the price instantly.'}
                </p>
                <Link href="/builder" className="relative z-10">
                  <Button className="btn-tactile rounded-full px-8 py-4 text-lg shadow-[0_0_20px_var(--accent)]">
                    {lang === 'uk' ? 'Почати проєкт' : 'Start a Project'}
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
