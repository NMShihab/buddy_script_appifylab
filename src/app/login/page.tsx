"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";

const AuthLayout = dynamic(() => import("@/components/layout/AuthLayout"), {
  ssr: false,
});
const LoginForm = dynamic(() => import("@/components/auth/LoginForm"), {
  ssr: false,
});

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/feed");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthLayout illustration="/assets/images/login.png" classIllustration="max-w-[633px] ">
      <LoginForm />
    </AuthLayout>
  );
}
