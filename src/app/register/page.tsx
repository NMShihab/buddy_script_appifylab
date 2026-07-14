"use client";

import dynamic from "next/dynamic";

const AuthLayout = dynamic(() => import("@/components/layout/AuthLayout"), {
  ssr: false,
});
const RegisterForm = dynamic(() => import("@/components/auth/RegisterForm"), {
  ssr: false,
});

export default function RegisterPage() {
  return (
    <AuthLayout
      illustration="/assets/images/registration.png"
      darkIllustration="/assets/images/registration1.png"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
