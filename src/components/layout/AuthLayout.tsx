"use client";

import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration: string;
}

export default function AuthLayout({
  children,
  illustration,
}: AuthLayoutProps) {
  return (
    <section className="relative z-[1] min-h-screen bg-[var(--page-bg)] py-[100px] max-md:py-[50px]">
      {/* Shape 1 — top left */}
      <div className="absolute left-0 top-0 z-[-1]">
        <Image
          src="/assets/images/shape1.svg"
          alt=""
          width={200}
          height={200}
        />
      </div>
      {/* Shape 2 — top right */}
      <div className="absolute right-5 top-0 z-[-1]">
        <Image
          src="/assets/images/shape2.svg"
          alt=""
          width={200}
          height={200}
        />
      </div>
      {/* Shape 3 — bottom right */}
      <div className="absolute bottom-0 right-[327px] z-[-1]">
        <Image
          src="/assets/images/shape3.svg"
          alt=""
          width={200}
          height={200}
        />
      </div>

      <div className="mx-auto max-w-330 px-3">
        <div className="flex flex-wrap items-center">
          {/* Left — illustration (8/12 cols on lg+) */}
          <div className="w-full lg:w-8/12">
            <div className="flex justify-center">
              <Image
                src={illustration}
                alt="Illustration"
                width={500}
                height={500}
                className="h-auto w-full max-w-[633px]"
                priority
              />
            </div>
          </div>

          {/* Right — form card (4/12 cols on lg+) */}
          <div className="w-full max-md:mt-7.5 lg:w-4/12">
            <div className="rounded-sm bg-[var(--card-bg)] p-12 max-md:text-center">
              {/* Logo */}
              <div className="mb-7 flex justify-center">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Buddy Script"
                  width={161}
                  height={40}
                  className="h-auto! w-auto! max-w-40.25"
                />
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
