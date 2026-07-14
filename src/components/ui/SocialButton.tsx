"use client";

import Image from "next/image";

interface SocialButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

export default function SocialButton({
  icon,
  label,
  onClick,
}: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center rounded-sm border border-border-page bg-[var(--card-bg)] px-[60px] py-3"
    >
      <Image
        src={icon}
        alt=""
        width={20}
        height={20}
        className="mr-2 !h-5 !w-5 flex-none"
      />
      <span className="flex-none text-base font-medium leading-[1.4] text-text-brown">
        {label}
      </span>
    </button>
  );
}
