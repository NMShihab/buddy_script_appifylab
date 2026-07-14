"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Welcome text */}
      <p className="mb-2 text-center text-base font-normal leading-[1.4] text-[var(--text-primary)]">
        Welcome back
      </p>
      <h4 className="mb-[50px] text-center text-[28px] font-semibold text-[var(--text-heading)]">
        Login to your account
      </h4>

      {/* Google sign-in button */}
      <button
        type="button"
        className="mb-10 flex w-full items-center justify-center rounded-[6px] border border-[#F0F2F5] bg-[var(--card-bg)] px-[60px] py-3 dark:border-[#3a4559]"
      >
        <Image
          src="/assets/images/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="mr-2 h-5 w-5"
        />
        <span className="flex-none text-base font-medium leading-[1.4] text-[var(--text-primary)]">
          Or sign-in with google
        </span>
      </button>

      {/* Or divider */}
      <div className="relative mb-10 text-center">
        <span className="relative z-[1] inline-block bg-[var(--card-bg)] px-3 text-sm font-normal leading-[1.4] text-[#C4C4C4]">
          Or
        </span>
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#DFDFDF] dark:bg-[rgba(237,239,241,0.25)]" />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-[6px] bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-3.5">
          <label className="mb-2 block text-base font-medium leading-[1.4] text-[var(--text-muted)]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-[6px] border border-[#F5F5F5] bg-[var(--card-bg)] px-4 text-sm text-[var(--text-primary)] placeholder:text-[13px] placeholder:text-[var(--text-primary)] focus:border-primary dark:border-[#3a4559] dark:bg-[var(--input-bg)]"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3.5">
          <label className="mb-2 block text-base font-medium leading-[1.4] text-[var(--text-muted)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-[6px] border border-[#F5F5F5] bg-[var(--card-bg)] px-4 text-sm text-[var(--text-primary)] placeholder:text-[13px] placeholder:text-[var(--text-primary)] focus:border-primary dark:border-[#3a4559] dark:bg-[var(--input-bg)]"
            required
          />
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-[#C4C4C4] accent-primary"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm font-normal leading-[1.4] text-[var(--text-primary)]"
            >
              Remember me
            </label>
          </div>
          <p className="text-sm leading-[1.4] text-primary cursor-pointer">
            Forgot password?
          </p>
        </div>

        {/* Login button */}
        <div className="mb-[60px] mt-10">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[6px] bg-primary border border-transparent px-[116px] py-3 text-base font-medium text-white transition-shadow hover:shadow-[0px_8px_24px_rgba(149,157,165,0.2)] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login now"}
          </button>
        </div>
      </form>

      {/* Create account link */}
      <div className="text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create New Account
          </Link>
        </p>
      </div>
    </>
  );
}
