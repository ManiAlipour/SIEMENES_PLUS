import AuthLayout from "@/components/layouts/auth/AuthLayout";
import AuthForm from "@/components/layouts/auth/AuthForm";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <AuthLayout title="ثبت نام">
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </AuthLayout>
  );
}
