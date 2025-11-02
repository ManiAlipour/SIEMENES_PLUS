import AuthLayout from "@/components/layouts/auth/AuthLayout";
import AuthForm from "@/components/layouts/auth/AuthForm";

export default function VerifyPage() {
  return (
    <AuthLayout title="تأیید حساب کاربری">
      <AuthForm mode="verify" />
    </AuthLayout>
  );
}
