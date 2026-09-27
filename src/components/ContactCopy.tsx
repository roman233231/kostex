'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface ContactCopyProps {
  value: string;
  label: string;
}

export default function ContactCopy({ value, label }: ContactCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--purple-bright)] transition-colors"
      aria-label={`Копіювати ${label}`}
    >
      <span className="font-medium truncate">{value}</span>
      <span className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check size={14} className="text-green-400" />
        ) : (
          <Copy size={14} />
        )}
      </span>
    </button>
  );
}