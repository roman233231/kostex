'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div
        className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-500 hover:border-[var(--purple)]/40 hover:-translate-y-1"
        style={{ transitionDelay: `${index * 30}ms` }}
      >
        {/* Preview area */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
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
              <span className="relative text-5xl font-bold tracking-tight text-[var(--text)]/20 uppercase">
                {product.category}
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <div className="inline-flex self-start px-2.5 py-1 rounded-full bg-[var(--purple)]/10 border border-[var(--purple)]/20 text-[var(--purple-bright)] text-xs font-medium capitalize">
            {product.category.replace('-', ' ')}
          </div>

          <h3 className="text-lg font-semibold mt-3 mb-2 group-hover:text-[var(--purple)] transition-colors">
            {product.title}
          </h3>

          <p className="text-sm text-[var(--text-muted)] flex-1 line-clamp-2">
            {product.shortDescription}
          </p>

          <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div>
              <div className="text-sm text-[var(--text-faint)]">From</div>
              <div className="text-base font-bold">
                {product.startingPrice.toLocaleString('uk-UA')} ₴
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--text-faint)]">Est.</div>
              <div className="text-sm font-medium">{product.estimatedTime}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}