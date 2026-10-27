'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const countries = [
  { code: 'UA', dial: '+380', flag: '🇺🇦', name: 'Україна', placeholder: '50 123 45 67' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'США', placeholder: '202 555 0123' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'Велика Британія', placeholder: '7400 123456' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Німеччина', placeholder: '151 23456789' },
  { code: 'PL', dial: '+48', flag: '🇵🇱', name: 'Польща', placeholder: '512 345 678' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'Франція', placeholder: '6 12 34 56 78' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'Іспанія', placeholder: '612 34 56 78' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Італія', placeholder: '312 345 6789' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Канада', placeholder: '416 555 0123' },
  { code: 'KZ', dial: '+7', flag: '🇰🇿', name: 'Казахстан', placeholder: '701 234 56 78' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Туреччина', placeholder: '532 123 45 67' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'ОАЕ', placeholder: '50 123 4567' },
  { code: 'GE', dial: '+995', flag: '🇬🇪', name: 'Грузія', placeholder: '555 123 456' },
  { code: 'MD', dial: '+373', flag: '🇲🇩', name: 'Молдова', placeholder: '60 123 456' },
  { code: 'IL', dial: '+972', flag: '🇮🇱', name: 'Ізраїль', placeholder: '50 123 4567' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'Китай', placeholder: '131 2345 6789' },
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'Індія', placeholder: '98765 43210' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Японія', placeholder: '90 1234 5678' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function PhoneInput({ value, onChange, label = 'Номер телефону' }: PhoneInputProps) {
  const [country, setCountry] = useState(countries[0]);
  const [number, setNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value && value.startsWith('+')) {
      const sorted = [...countries].sort((a, b) => b.dial.length - a.dial.length);
      const found = sorted.find((c) => value.startsWith(c.dial));
      if (found) {
        setCountry(found);
        setNumber(value.slice(found.dial.length).replace(/\D/g, ''));
        return;
      }
    }
    if (!value) setNumber('');
  }, []);

  const handleNumberChange = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (country.code === 'UA' && digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, 15);
    setNumber(digits);
    onChange(digits ? `${country.dial}${digits}` : '');
  };

  const handleCountryChange = (c: typeof countries[0]) => {
    setCountry(c);
    setIsOpen(false);
    onChange(number ? `${c.dial}${number}` : '');
  };

  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-4)] mb-2 block">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-full px-3 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center gap-2 hover:border-[var(--accent)]/50 transition-all min-w-[110px]"
          >
            <span className="text-lg leading-none">{country.flag}</span>
            <span className="text-sm font-semibold text-[var(--text)]">{country.dial}</span>
            <ChevronDown
              size={14}
              className={`text-[var(--text-3)] transition-transform ml-auto ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <div className="absolute top-full mt-2 left-0 z-50 w-72 max-h-80 overflow-y-auto rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl animate-slide-up" style={{ animationDuration: '0.15s' }}>
                {countries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountryChange(c)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-2)] transition-colors text-left ${
                      c.code === country.code ? 'bg-[var(--accent)]/10' : ''
                    }`}
                  >
                    <span className="text-xl">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[var(--text)] truncate">{c.name}</div>
                      <div className="text-xs text-[var(--text-3)]">{c.dial}</div>
                    </div>
                    {c.code === country.code && (
                      <span className="text-[var(--accent)] font-bold text-sm">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <input
          type="tel"
          inputMode="numeric"
          value={number}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder={country.placeholder}
          className="flex-1 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-4)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>
      <p className="text-[10px] text-[var(--text-4)] mt-1.5">
        Повний номер: <span className="font-mono">{country.dial}{number || '...'}</span>
      </p>
    </div>
  );
}
