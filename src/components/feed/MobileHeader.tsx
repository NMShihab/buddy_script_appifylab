"use client";

import Image from "next/image";
import Link from "next/link";

export default function MobileHeader() {
  return (
    <div className="fixed left-0 right-0 top-0 z-[1030] bg-[var(--card-bg)] lg:hidden">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between py-3">
          <Link href="/feed">
            <Image
              src="/assets/images/logo.svg"
              alt="Buddy Script"
              width={110}
              height={28}
              className="h-auto w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <button type="button" className="p-1 text-text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                <circle cx="7" cy="7" r="6" stroke="currentColor" />
                <path stroke="currentColor" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
