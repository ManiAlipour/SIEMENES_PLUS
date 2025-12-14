import AuthLayout from "@/components/layouts/auth/AuthLayout";
import AuthForm from "@/components/layouts/auth/AuthForm";
import { Suspense } from "react";

export default function VerifyPage() {
  return (
    <AuthLayout title="تأیید حساب کاربری">
      <Suspense>
        <AuthForm mode="verify" />
      </Suspense>
    </AuthLayout>
  );
}
