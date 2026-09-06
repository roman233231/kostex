interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export default function Textarea({ label, placeholder, value, onChange, className = '' }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-white/80">{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`textarea ${className}`}
      />
    </div>
  );
}