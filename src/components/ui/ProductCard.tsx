'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import TiltCard from './TiltCard';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

// Кольори для кожної категорії
const categoryColors: Record<string, { color1: string; color2: string; glow: string }> = {
  websites: { color1: '#8B5CF6', color2: '#A855F7', glow: 'rgba(139,92,246,0.5)' },
  'web-apps': { color1: '#3B82F6', color2: '#06B6D4', glow: 'rgba(59,130,246,0.5)' },
  software: { color1: '#EC4899', color2: '#F43F5E', glow: 'rgba(236,72,153,0.5)' },
  bots: { color1: '#10B981', color2: '#14B8A6', glow: 'rgba(16,185,129,0.5)' },
  crm: { color1: '#F59E0B', color2: '#F97316', glow: 'rgba(245,158,11,0.5)' },
  ecommerce: { color1: '#D946EF', color2: '#A855F7', glow: 'rgba(217,70,239,0.5)' },
};

const emojiByCategory: Record<string, string> = {
  websites: '🌐',
  'web-apps': '⚡',
  software: '💻',
  bots: '🤖',
  crm: '📊',
  ecommerce: '🛒',
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t, tProduct } = useLanguage();

  const title = tProduct(product.slug, 'title', product.title);
  const shortDescription = tProduct(
    product.slug,
    'shortDescription',
    product.shortDescription
  );

  const colors =
    categoryColors[product.category] || categoryColors.websites;
  const emoji = emojiByCategory[product.category] || '📦';

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
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
            {/* Preview area */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${colors.color1}22, ${colors.color2}22)`,
                  }}
                >
                  <span className="text-6xl md:text-7xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                    {emoji}
                  </span>
                </div>
              )}

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, ${colors.color1}40, transparent 50%)`,
                }}
              />

              {/* Category chip */}
              <div
                className="absolute top-3 left-3 px-3 py-1.5 rounded-full backdrop-blur-md border text-white text-[10px] md:text-xs font-bold uppercase tracking-wider"
                style={{
                  background: `${colors.color1}cc`,
                  borderColor: `${colors.color1}66`,
                }}
              >
                {product.category.replace('-', ' ')}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-base md:text-lg font-bold mb-2 leading-snug">
                {title}
              </h3>

              <p className="text-xs md:text-sm text-[var(--text-muted)] flex-1 line-clamp-2 leading-relaxed">
                {shortDescription}
              </p>

              <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
                    {t('common.from')}
                  </div>
                  <div
                    className="text-base md:text-lg font-bold truncate"
                    style={{
                      background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
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

              <div className="mt-4 flex items-center gap-2 text-sm font-semibold opacity-100 transition-opacity">
                <span
                  style={{
                    background: `linear-gradient(135deg, ${colors.color1}, ${colors.color2})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('common.viewDetails')}
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