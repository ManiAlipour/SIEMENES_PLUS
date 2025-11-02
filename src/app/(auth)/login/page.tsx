import AuthLayout from "@/components/layouts/auth/AuthLayout";
import AuthForm from "@/components/layouts/auth/AuthForm";

export default function LoginPage() {
  return (
    <AuthLayout title="ورود">
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
