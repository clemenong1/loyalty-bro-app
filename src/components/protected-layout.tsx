import { Navigate, Outlet } from 'react-router-dom';

import { BottomNav } from '@/components/bottom-nav';
import { useAuth } from '@/hooks/use-auth';

export function ProtectedLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen bg-white dark:bg-black" />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-white pb-16 text-black dark:bg-black dark:text-white">
      <Outlet />
      <BottomNav />
    </div>
  );
}
