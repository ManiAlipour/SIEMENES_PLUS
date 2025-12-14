import AuthLayout from "@/components/layouts/auth/AuthLayout";
import AuthForm from "@/components/layouts/auth/AuthForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <AuthLayout title="ورود">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </AuthLayout>
  );
}
