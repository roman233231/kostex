'use client';

import Card from '@/components/ui/Card';
import Reveal from '@/components/ui/Reveal';

export default function FilesPage() {
  return (
    <div>
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-[var(--text-muted)] mt-1">
            Files shared between you and KOSTEX
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Card hover={false} className="text-center py-12">
          <div className="text-4xl mb-3">📁</div>
          <h2 className="text-lg font-semibold mb-2">No files yet</h2>
          <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
            Files will appear here once you share them with us, or we deliver project files.
          </p>
        </Card>
      </Reveal>
    </div>
  );
}