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

export default function RegisterForm() {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the terms & conditions");
      return;
    }

    setLoading(true);
    try {
      await register({ firstName, lastName, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="mb-2 text-center text-base font-normal leading-[1.4] text-text-body">
        Get Started Now
      </p>
      <h4 className="mb-12.5 text-center text-[28px] font-medium leading-[1.2] text-text-heading max-[575px]:text-[22px] ">
        Registration
      </h4>

      <div className="mb-10">
        <SocialButton
          icon="/assets/images/google.svg"
          label="Register with google"
        />
      </div>

      <div className="mb-10">
        <OrDivider />
      </div>

      <ErrorAlert message={error} />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="First Name"
            type="text"
            value={firstName}
            onChange={setFirstName}
            required
          />
          <FormInput
            label="Last Name"
            type="text"
            value={lastName}
            onChange={setLastName}
            required
          />
        </div>

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

        <FormInput
          label="Repeat Password"
          type="password"
          value={repeatPassword}
          onChange={setRepeatPassword}
          required
        />

        <FormCheckbox
          id="terms"
          label="I agree to terms & conditions"
          checked={agreeTerms}
          onChange={setAgreeTerms}
        />

        <div className="mb-16 mt-10">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register now"}
          </PrimaryButton>
        </div>
      </form>

      <div className="text-center">
        <p className="text-sm text-text-light">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
