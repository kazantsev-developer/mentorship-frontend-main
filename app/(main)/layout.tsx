"use client";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/navigation/sidebar";
import Header from "@/components/navigation/header";
import Loader from "@/components/ui/loader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, getSelectedRole } = useAuth();
  const role = getSelectedRole();

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-6">{children}</main>
      </div>
    </div>
  );
}
