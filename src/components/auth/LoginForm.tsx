"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import FormInput from "@/components/ui/FormInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SocialButton from "@/components/ui/SocialButton";
import OrDivider from "@/components/ui/OrDivider";
import FormCheckbox from "@/components/ui/FormCheckbox";
import ErrorAlert from "@/components/ui/ErrorAlert";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
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
      {/* _mar_b8 */}
      <p className="mb-2 text-center text-base font-normal leading-[1.4] text-text-body">
        Welcome back
      </p>
      {/* _titl4 _mar_b50 → font-size:28px, mb:50px */}
      <h4 className="mb-[50px] text-center text-[28px] font-medium leading-[1.2] text-text-heading max-[575px]:text-[22px]">
        Login to your account
      </h4>

      {/* _mar_b40 */}
      <div className="mb-10">
        <SocialButton
          icon="/assets/images/google.svg"
          label="Or sign-in with google"
        />
      </div>

      {/* _mar_b40 */}
      <div className="mb-10">
        <OrDivider />
      </div>

      <ErrorAlert message={error} />

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />

        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />

        {/* Remember me row + Forgot password */}
        <div className="flex items-center justify-between max-md:flex-col max-md:gap-2">
          <FormCheckbox
            id="remember"
            label="Remember me"
            checked={remember}
            onChange={setRemember}
          />
          <p className="cursor-pointer text-sm leading-[1.4] text-primary max-[575px]:ml-2 max-[575px]:text-xs md:ml-[23px]">
            Forgot password?
          </p>
        </div>

        {/* _mar_t40 _mar_b60 */}
        <div className="mb-[60px] mt-10">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login now"}
          </PrimaryButton>
        </div>
      </form>

      {/* Bottom link — font-size:14px */}
      <div className="text-center">
        <p className="text-sm text-text-light">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create New Account
          </Link>
        </p>
      </div>
    </>
  );
}
