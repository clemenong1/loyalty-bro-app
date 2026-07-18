import { Redirect, Stack } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';

export default function AuthLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <ThemedView style={{ flex: 1 }} />;
  }

  if (session) {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
