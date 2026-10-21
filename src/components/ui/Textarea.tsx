interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  required?: boolean;
  name?: string;
}

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  name,
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
          {required && <span className="text-[var(--purple)] ml-0.5">*</span>}
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`textarea ${className}`}
      />
    </div>
  );
}