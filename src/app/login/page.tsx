"use client";

import dynamic from "next/dynamic";

const AuthLayout = dynamic(() => import("@/components/layout/AuthLayout"), {
  ssr: false,
});
const LoginForm = dynamic(() => import("@/components/auth/LoginForm"), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <AuthLayout illustration="/assets/images/login.png" classIllustration="max-w-[633px] ">
      <LoginForm />
    </AuthLayout>
  );
}
