'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createGeneralReview } from '@/services/review';
import Button from './Button';
import Textarea from './Textarea';
import { Star, Send, Check, X } from 'lucide-react';

interface GeneralReviewFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function GeneralReviewForm({ onSuccess, onCancel }: GeneralReviewFormProps) {
  const { currentUser, appUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (text.trim().length < 10) {
      setError('Відгук має містити мінімум 10 символів');
      return;
    }
    setSending(true);
    setError('');
    try {
      await createGeneralReview({
        userId: currentUser.uid,
        userName: appUser?.displayName || currentUser.email || 'Клієнт',
        userEmail: currentUser.email || undefined,
        rating,
        text: text.trim(),
      });
      setDone(true);
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Помилка надсилання');
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="p-6 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent-border)] text-center">
        <Check size={32} className="text-[var(--accent-2)] mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-1">Дякуємо за відгук!</h3>
        <p className="text-sm text-[var(--text-3)]">Він з'явиться на сайті після модерації.</p>
        {onCancel && (
          <Button onClick={onCancel} variant="outline" className="mt-4">
            Закрити
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Залишити відгук</h3>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-[var(--text-3)] hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-[var(--text-4)] mb-2 block">Оцінка</label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => {
            const filled = i <= (hovered || rating);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110"
                aria-label={`${i} з 5`}
              >
                <Star
                  size={28}
                  fill={filled ? 'var(--gold)' : 'transparent'}
                  stroke={filled ? 'var(--gold)' : 'var(--text-3)'}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
          <span className="ml-2 text-sm text-[var(--text-3)]">{rating}/5</span>
        </div>
      </div>

      <Textarea
        label="Ваш відгук"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Розкажіть про ваш досвід співпраці з KOSTEX..."
        required
      />

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={sending} className="w-full sm:w-auto">
        {sending ? 'Надсилаємо...' : 'Надіслати відгук'}
        <Send size={16} />
      </Button>
    </form>
  );
}
