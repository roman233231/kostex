'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PortfolioItem } from '@/types/portfolio';
import TiltCard from './TiltCard';
import { useLanguage } from '@/context/LanguageContext';

interface PortfolioCardProps {
  item: PortfolioItem;
  index?: number;
}

export default function PortfolioCard({ item, index = 0 }: PortfolioCardProps) {
  const { t } = useLanguage();

  return (
    <Link href={`/portfolio/${item.slug}`} className="block h-full">
      <TiltCard className="h-full" intensity={5}>
        <div className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-500 hover:border-[var(--border-purple)] hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.35)] group">
          {/* Preview */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)]">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.3) 0%, transparent 70%)',
                  }}
                />
                <span className="relative text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--text)]/20 uppercase px-4 text-center">
                  {item.title}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category chip */}
            <div className="absolute top-3 left-3 md:top-4 md:left-4 inline-flex px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] md:text-xs font-medium uppercase tracking-wider">
              {item.category.replace('-', ' ')}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4 md:p-5">
            <h3 className="text-base md:text-lg font-semibold mb-1.5 md:mb-2 group-hover:text-[var(--purple)] transition-colors leading-snug">
              {item.title}
            </h3>

            <p className="text-xs md:text-sm text-[var(--text-muted)] flex-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            <div className="mt-4 text-xs md:text-sm text-[var(--purple)] flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-all">
              {t('portfolio.viewCase')}
            </div>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}