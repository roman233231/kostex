'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { blogPosts } from '@/data/blog';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

const categoryColors: Record<string, { color1: string; color2: string; glow: string }> = {
  Business: { color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  Tips: { color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  Guide: { color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  Design: { color1: '#10B981', color2: '#14B8A6', glow: 'rgba(16,185,129,0.5)' },
  Tech: { color1: '#F59E0B', color2: '#F97316', glow: 'rgba(245,158,11,0.5)' },
};

export default function BlogPage() {
  const { lang } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="container py-24 md:py-32 min-h-screen">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge>Blog</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-6 tracking-tight text-gradient-animated">
              {lang === 'uk' ? 'Корисні статті' : 'Useful articles'}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-3)]">
              {lang === 'uk' ? 'Поради для бізнесу, кейси та ідеї від KOSTEX.' : 'Business tips, cases and ideas from KOSTEX.'}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => {
            const colors = categoryColors[post.category] || categoryColors.Business;
            return (
              <Reveal key={post.slug} delay={i * 70}>
                <Link href={`/blog/${post.slug}`} className="block h-full group">
                  <div className="glass-card rounded-3xl p-8 h-full flex flex-col relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2">
                    {/* Декоративне світло */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-opacity duration-500" style={{ background: colors.glow }} />

                    <div className="mb-6 relative z-10">
                      <span className="inline-flex px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`, boxShadow: `0 8px 20px -8px ${colors.glow}` }}>
                        {post.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 leading-snug text-[var(--text)] group-hover:text-[var(--accent)] transition-colors relative z-10">
                      {lang === 'uk' ? post.titleUk : post.titleEn}
                    </h2>

                    <p className="text-sm text-[var(--text-3)] flex-1 line-clamp-3 leading-relaxed mb-6 relative z-10">
                      {lang === 'uk' ? post.excerptUk : post.excerptEn}
                    </p>

                    <div className="pt-5 border-t border-[var(--border)] flex items-center justify-between text-xs font-medium text-[var(--text-4)] relative z-10">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(post.date).toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} />{post.readingTime} min</span>
                      </div>
                      <ArrowRight size={16} style={{ color: colors.color1 }} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
