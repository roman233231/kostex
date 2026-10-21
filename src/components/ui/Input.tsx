interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  name?: string;
}

export default function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  className = '',
  required = false,
  name,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
          {required && <span className="text-[var(--purple)] ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`input ${className}`}
      />
    </div>
  );
}