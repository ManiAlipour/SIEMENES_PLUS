import DashboardProvider from "@/components/providers/DashboardProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
