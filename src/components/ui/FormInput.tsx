"use client";

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  className = "",
}: FormInputProps) {
  return (
    <div className={`mb-3.5 ${className}`}>
      <label className="mb-2 block text-base font-medium leading-[1.4] text-text-label">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-sm border border-[var(--input-border)] bg-[var(--input-bg)] px-4 text-sm leading-[1.4] text-text-body placeholder:text-[13px] placeholder:font-normal placeholder:leading-[1.4] placeholder:text-text-body focus:border-primary dark:text-white"
      />
    </div>
  );
}
