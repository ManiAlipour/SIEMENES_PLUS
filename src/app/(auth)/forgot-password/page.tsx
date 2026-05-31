import AuthLayout from "@/components/layouts/auth/AuthLayout";
import ForgotPasswordForm from "@/components/layouts/auth/ForgetPasswordForm";
import React from "react";

export default function ForgetPasswordPage() {
  return (
    <AuthLayout title="فراموشی رمز عبور">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
