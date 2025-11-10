import UserDashboard from "@/components/layouts/dash/user/pages";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // const c = await cookies();
  // const token = c.get("token")?.value;

  // if (!token) redirect("/");

  return <UserDashboard />;
}
