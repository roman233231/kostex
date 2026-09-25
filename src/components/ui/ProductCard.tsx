'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import TiltCard from './TiltCard';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useLanguage();

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <TiltCard className="h-full" intensity={5}>
        <div className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-500 hover:border-[var(--border-purple)] hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.35)] group">
          {/* Preview area */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)]">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
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
                <span className="relative text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text)]/20 uppercase px-4 text-center">
                  {product.category.replace('-', ' ')}
                </span>
              </div>
            )}

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category chip — top-left */}
            <div className="absolute top-3 left-3 md:top-4 md:left-4 inline-flex px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] md:text-xs font-medium uppercase tracking-wider">
              {product.category.replace('-', ' ')}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4 md:p-5">
            <h3 className="text-base md:text-lg font-semibold mb-1.5 md:mb-2 group-hover:text-[var(--purple)] transition-colors leading-snug">
              {product.title}
            </h3>

            <p className="text-xs md:text-sm text-[var(--text-muted)] flex-1 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="mt-4 pt-3.5 md:mt-5 md:pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
                  {t('common.from')}
                </div>
                <div className="text-sm md:text-base font-bold truncate">
                  {product.startingPrice.toLocaleString('uk-UA')} ₴
                </div>
              </div>
              <div className="text-right min-w-0">
                <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
                  {t('common.estimated')}
                </div>
                <div className="text-xs md:text-sm font-medium truncate">
                  {product.estimatedTime}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}