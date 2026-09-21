'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="grid-bg" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.15), transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative text-center max-w-lg">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Something went wrong
        </h1>
        <p className="text-[var(--text-muted)] mb-8">
          We've encountered an unexpected error. Try refreshing the page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}