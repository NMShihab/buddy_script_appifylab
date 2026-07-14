"use client";

import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration: string;
  classIllustration: string | undefined
}

export default function AuthLayout({
  children,
  illustration,
  classIllustration
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

      <div className="mx-auto max-w-[1320px] px-3">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-8/12">
            <div className="flex justify-center">
              
              <Image
                src={illustration}
                alt="Illustration"
                width={633}
                height={633}
                className={`h-auto w-full ${classIllustration?classIllustration:""}`}
                priority
              />
            </div>
          </div>

          <div className="w-full max-xl:mt-[30px] xl:w-4/12">
            <div className="rounded-[6px] bg-[var(--card-bg)] p-12 max-xl:text-center">
              <div className="mb-7 flex justify-center">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Buddy Script"
                  width={161}
                  height={40}
                  className="h-auto w-auto max-w-[161px]"
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
