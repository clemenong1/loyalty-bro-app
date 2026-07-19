import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/hooks/use-auth';

/** Redirects an already-authenticated user away from /login and /signup. */
export function AuthOnlyRoute({ children }: PropsWithChildren) {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen bg-cream" />;
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
