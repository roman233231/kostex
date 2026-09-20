'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PortfolioItem } from '@/types/portfolio';

interface PortfolioCardProps {
  item: PortfolioItem;
  index?: number;
}

export default function PortfolioCard({ item, index = 0 }: PortfolioCardProps) {
  return (
    <Link href={`/portfolio/${item.slug}`} className="block group">
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-500 hover:border-[var(--purple)]/40 hover:-translate-y-1">
        {/* Preview */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)]">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.25) 0%, transparent 70%)',
                }}
              />
              <span className="relative text-4xl md:text-5xl font-bold tracking-tight text-[var(--text)]/15 uppercase px-4 text-center">
                {item.title}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <div className="inline-flex self-start px-2.5 py-1 rounded-full bg-[var(--purple)]/10 border border-[var(--purple)]/20 text-[var(--purple-bright)] text-xs font-medium capitalize">
            {item.category.replace('-', ' ')}
          </div>

          <h3 className="text-lg font-semibold mt-3 mb-2 group-hover:text-[var(--purple)] transition-colors">
            {item.title}
          </h3>

          <p className="text-sm text-[var(--text-muted)] flex-1 line-clamp-2">
            {item.description}
          </p>

          <div className="mt-4 text-sm text-[var(--purple)] opacity-0 group-hover:opacity-100 transition-opacity">
            View case →
          </div>
        </div>
      </div>
    </Link>
  );
}