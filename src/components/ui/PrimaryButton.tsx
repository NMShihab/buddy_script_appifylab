"use client";

interface PrimaryButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function PrimaryButton({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-sm border border-transparent bg-primary py-3 text-base font-medium text-white transition-shadow hover:shadow-hover disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
