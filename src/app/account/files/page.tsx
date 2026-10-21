'use client';

import Card from '@/components/ui/Card';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';

export default function FilesPage() {
  const { t } = useLanguage();

  return (
    <div>
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t('account.files')}</h1>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Card hover={false} className="text-center py-12">
          <div className="text-4xl mb-3">📁</div>
          <h2 className="text-lg font-semibold mb-2">{t('account.noFiles')}</h2>
          <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
            {t('account.noFilesDesc')}
          </p>
        </Card>
      </Reveal>
    </div>
  );
}