'use client';

import { useEffect, useState } from 'react';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders } from '@/services/order';
import { FolderOpen, ExternalLink, FileText } from 'lucide-react';

export default function FilesPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [files, setFiles] = useState<{url: string, orderTitle: string, orderId: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchFiles = async () => {
      try {
        const orders = await getUserOrders(currentUser.uid);
        const allFiles: {url: string, orderTitle: string, orderId: string}[] = [];
        
        orders.forEach(order => {
          if (order.references && order.references.length > 0) {
            order.references.forEach(ref => {
              if (ref.startsWith('http')) {
                 allFiles.push({ url: ref, orderTitle: order.productTitle || 'Проєкт', orderId: order.id! });
              }
            });
          }
        });
        setFiles(allFiles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [currentUser]);

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

      {loading ? (
        <div className="text-center py-20 text-[var(--text-3)]">Завантаження...</div>
      ) : files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, i) => (
            <Reveal key={i} delay={i * 50}>
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="glass-card p-6 rounded-2xl flex flex-col h-full hover:border-[var(--accent)] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <h3 className="font-bold text-[var(--text)] mb-1 line-clamp-1 break-all">{file.url}</h3>
                <p className="text-xs text-[var(--text-3)] mb-4 flex-1">До замовлення: {file.orderTitle}</p>
                <div className="flex items-center justify-between text-xs font-medium text-[var(--accent)] mt-auto pt-4 border-t border-[var(--border)]">
                  Відкрити посилання <ExternalLink size={14} />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
