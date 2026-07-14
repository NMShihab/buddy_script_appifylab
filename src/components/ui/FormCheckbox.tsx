"use client";

interface FormCheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function FormCheckbox({
  id,
  label,
  checked,
  onChange,
}: FormCheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 rounded border-text-gray accent-primary"
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm font-normal leading-[1.4] text-text-body"
      >
        {label}
      </label>
    </div>
  );
}
