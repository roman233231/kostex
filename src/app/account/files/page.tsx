'use client';

import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { FolderOpen } from 'lucide-react';

export default function FilesPage() {
  const { t } = useLanguage();

  return (
    <div className="animate-slide-up">
      <Reveal>
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            {t('account.files')}
          </h1>
          <p className="text-lg text-[var(--text-3)]">Файли, макети та документи ваших проєктів</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="glass-card rounded-[2rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 relative z-10 animate-float shadow-[0_15px_40px_-10px_rgba(59,130,246,0.6)]" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
            <FolderOpen size={40} />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 text-[var(--text)]">
            {t('account.noFiles')}
          </h2>
          <p className="text-base text-[var(--text-3)] max-w-md mx-auto relative z-10">
            {t('account.noFilesDesc')}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
