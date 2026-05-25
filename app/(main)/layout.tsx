'use client';
import { useAuth } from '@/hooks/useAuth';
import { StudentSidebar } from '@/components/student-sidebar';
import { BuddySidebar } from '@/components/buddy-sidebar';
import { Header } from '@/components/header';
import Loader from '@/components/ui/loader';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, getSelectedRole, loading } = useAuth();
  const role = getSelectedRole();

  if (loading) return <Loader />;
  if (!user) return null;

  const Sidebar = role === 'student' ? StudentSidebar : role === 'buddy' ? BuddySidebar : null;
  if (!Sidebar) return <div className="p-4">Неизвестная роль</div>;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
