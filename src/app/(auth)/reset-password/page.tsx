import AuthLayout from "@/components/layouts/auth/AuthLayout";
import ResetPasswordForm from "@/components/layouts/auth/ResetPassword";
import { Suspense } from "react";

export const metadata = {
  title: "تغییر رمز عبور | Control Room",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="تغییر رمز">
      <div className="w-full max-w-[450px] bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50">
        <Suspense
          fallback={<div className="text-center">در حال بارگذاری...</div>}
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
