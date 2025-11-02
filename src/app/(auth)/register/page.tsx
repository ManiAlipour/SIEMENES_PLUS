import AuthLayout from "@/components/layouts/auth/AuthLayout";
import AuthForm from "@/components/layouts/auth/AuthForm";

export default function RegisterPage() {
  return (
    <AuthLayout title="ثبت نام">
      <AuthForm mode="register" />
    </AuthLayout>
  );
}
