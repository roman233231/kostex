'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Якщо сталася помилка завантаження чанку (через оновлення сайту),
    // автоматично перезавантажуємо сторінку
    const isChunkError =
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to load chunk') ||
      error.message.includes('Loading CSS chunk');

    if (isChunkError) {
      window.location.reload();
    }
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
          <h2>Щось пішло не так</h2>
          <p>Спробуйте оновити сторінку.</p>
          <button
            onClick={() => reset()}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            Оновити
          </button>
        </div>
      </body>
    </html>
  );
}
