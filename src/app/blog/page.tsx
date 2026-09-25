'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { blogPosts } from '@/data/blog';

export default function BlogPage() {
  const { lang } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="container py-12 md:py-16">
        <Reveal>
          <div className="mb-10 md:mb-14 max-w-3xl">
            <Badge>Blog</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              {lang === 'uk' ? 'Корисні статті' : 'Useful articles'}
            </h1>
            <p className="text-base md:text-lg text-[var(--text-muted)] mt-3 md:mt-4">
              {lang === 'uk'
                ? 'Поради для бізнесу, кейси та ідеї від KOSTEX.'
                : 'Business tips, cases and ideas from KOSTEX.'}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 80}>
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <Card className="h-full flex flex-col group">
                  <div className="inline-flex self-start px-2.5 py-1 rounded-full bg-[var(--purple-soft)] border border-[var(--border-purple)] text-[var(--purple-bright)] text-[11px] md:text-xs font-medium mb-3 md:mb-4">
                    {post.category}
                  </div>

                  <h2 className="text-base md:text-xl font-bold mb-2.5 md:mb-3 group-hover:text-[var(--purple)] transition-colors leading-snug">
                    {lang === 'uk' ? post.titleUk : post.titleEn}
                  </h2>

                  <p className="text-xs md:text-sm text-[var(--text-muted)] flex-1 leading-relaxed line-clamp-3">
                    {lang === 'uk' ? post.excerptUk : post.excerptEn}
                  </p>

                  <div className="mt-4 md:mt-5 pt-3.5 md:pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] md:text-xs text-[var(--text-faint)]">
                    <span>
                      {new Date(post.date).toLocaleDateString(
                        lang === 'uk' ? 'uk-UA' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      )}
                    </span>
                    <span>{post.readingTime} min</span>
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}