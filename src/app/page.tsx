import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)]">
      <div className="text-center">
        <div className="mx-auto mb-6 w-48">
          <Image
            src="/assets/images/logo.svg"
            alt="Buddy Script"
            width={192}
            height={48}
            priority
          />
        </div>
        <h1 className="mb-2 text-3xl font-semibold text-[var(--text-heading)]">
          Welcome to Buddy Script
        </h1>
        <p className="mb-8 text-base text-[var(--text-secondary)]">
          Connect, Share, and Engage with your community
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-primary px-8 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
