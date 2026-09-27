'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PortfolioItem } from '@/types/portfolio';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';

interface PortfolioCardProps {
  item: PortfolioItem;
  index?: number;
}

const categoryColors: Record<string, { color1: string; color2: string; glow: string }> = {
  websites: { color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  'web-apps': { color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  software: { color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  bots: { color1: '#10B981', color2: '#14B8A6', glow: 'rgba(16,185,129,0.5)' },
  crm: { color1: '#F59E0B', color2: '#F97316', glow: 'rgba(245,158,11,0.5)' },
  ecommerce: { color1: '#D946EF', color2: '#A855F7', glow: 'rgba(217,70,239,0.5)' },
};

export default function PortfolioCard({ item, index = 0 }: PortfolioCardProps) {
  const { t } = useLanguage();

  const colors = categoryColors[item.category] || categoryColors.websites;

  return (
    <Link href={`/portfolio/${item.slug}`} className="block h-full">
      <div
        className="color-card h-full"
        style={
          {
            '--card-color-1': colors.color1,
            '--card-color-2': colors.color2,
            '--card-glow': colors.glow,
          } as React.CSSProperties
        }
      >
        <div className="color-card-inner !p-0">
          <div className="color-card-content">
            {/* Preview */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.color1}22, ${colors.color2}22)`,
                  }}
                >
                  <span className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text)]/30 uppercase px-4 text-center">
                    {item.title}
                  </span>
                </div>
              )}

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, ${colors.color1}40, transparent 50%)`,
                }}
              />

              <div
                className="absolute top-3 left-3 px-3 py-1.5 rounded-full backdrop-blur-md border text-white text-[10px] md:text-xs font-bold uppercase tracking-wider"
                style={{
                  background: `${colors.color1}cc`,
                  borderColor: `${colors.color1}66`,
                }}
              >
                {item.category.replace('-', ' ')}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-base md:text-lg font-bold mb-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs md:text-sm text-[var(--text-muted)] flex-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <span
                  style={{
                    background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('portfolio.viewCase')}
                </span>
                <ArrowRight size={14} style={{ color: colors.color1 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}