import { Navigate, Outlet } from 'react-router-dom';

import { BottomNav } from '@/components/bottom-nav';
import { useAuth } from '@/hooks/use-auth';

export function ProtectedLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen bg-cream" />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-cream pb-16 text-ink">
      <Outlet />
      <BottomNav />
    </div>
  );
}
