import { Redirect, Tabs } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';

export default function AppLayout() {
  const { session, isLoading } = useAuth();
  const theme = useTheme();

  if (isLoading) {
    return <ThemedView style={{ flex: 1 }} />;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3c87f7',
        tabBarStyle: { backgroundColor: theme.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Wallet' }} />
      <Tabs.Screen name="add" options={{ title: 'Add' }} />
      <Tabs.Screen name="membership/[id]" options={{ href: null }} />
    </Tabs>
  );
}
