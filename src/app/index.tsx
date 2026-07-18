import { Redirect } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';

export default function Index() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <ThemedView style={{ flex: 1 }} />;
  }

  return <Redirect href={session ? '/(app)' : '/(auth)/login'} />;
}
