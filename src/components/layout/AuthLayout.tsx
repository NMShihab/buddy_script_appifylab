"use client";

import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration: string;
  darkIllustration?: string;
}

export default function AuthLayout({
  children,
  illustration,
  darkIllustration,
}: AuthLayoutProps) {
  const { theme } = useTheme();

  return (
    <section className="relative z-[1] min-h-screen bg-[var(--page-bg)] py-[100px]">
      {/* Background shapes */}
      <div className="absolute left-0 top-0 z-[-1]">
        {theme === "dark" ? (
          <Image
            src="/assets/images/dark_shape.svg"
            alt=""
            width={200}
            height={200}
            className="block"
          />
        ) : (
          <Image
            src="/assets/images/shape1.svg"
            alt=""
            width={200}
            height={200}
            className="block"
          />
        )}
      </div>
      <div className="absolute right-5 top-0 z-[-1]">
        {theme === "dark" ? (
          <Image
            src="/assets/images/dark_shape1.svg"
            alt=""
            width={200}
            height={200}
            className="block opacity-5"
          />
        ) : (
          <Image
            src="/assets/images/shape2.svg"
            alt=""
            width={200}
            height={200}
            className="block"
          />
        )}
      </div>
      <div className="absolute bottom-0 right-[327px] z-[-1]">
        {theme === "dark" ? (
          <Image
            src="/assets/images/dark_shape2.svg"
            alt=""
            width={200}
            height={200}
            className="block opacity-5"
          />
        ) : (
          <Image
            src="/assets/images/shape3.svg"
            alt=""
            width={200}
            height={200}
            className="block"
          />
        )}
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          {/* Left side - Illustration */}
          <div className="w-full lg:w-8/12">
            <div className="flex items-center justify-center">
              {theme === "dark" && darkIllustration ? (
                <Image
                  src={darkIllustration}
                  alt="Illustration"
                  width={633}
                  height={500}
                  className="max-w-[633px] w-full h-auto"
                  priority
                />
              ) : (
                <Image
                  src={illustration}
                  alt="Illustration"
                  width={633}
                  height={500}
                  className="max-w-[633px] w-full h-auto"
                  priority
                />
              )}
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-4/12">
            <div className="rounded-[6px] bg-[var(--card-bg)] p-12">
              {/* Logo */}
              <div className="mb-7 flex justify-center">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Buddy Script"
                  width={161}
                  height={40}
                  className="max-w-[161px]"
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
