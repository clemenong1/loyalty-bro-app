import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { useMembershipsQuery, type MembershipWithDetails } from '@/hooks/use-memberships';
import { supabase } from '@/lib/supabase';

export default function WalletScreen() {
  const { data: memberships, isLoading, isRefetching, refetch } = useMembershipsQuery();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!memberships) return [];
    const q = search.trim().toLowerCase();
    if (!q) return memberships;
    return memberships.filter((m) => m.business.name.toLowerCase().includes(q));
  }, [memberships, search]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Wallet
        </ThemedText>
        <Pressable onPress={() => supabase.auth.signOut()}>
          <ThemedText type="linkPrimary">Log out</ThemedText>
        </Pressable>
      </View>

      <ThemedTextInput
        style={styles.search}
        placeholder="Search your memberships..."
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListEmptyComponent={
          !isLoading ? (
            <ThemedText themeColor="textSecondary" style={styles.empty}>
              No memberships yet. Add one from the Add tab.
            </ThemedText>
          ) : null
        }
        renderItem={({ item }) => <MembershipCard membership={item} />}
      />
    </ThemedView>
  );
}

function MembershipCard({ membership }: { membership: MembershipWithDetails }) {
  const unredeemedCount = membership.benefits.filter((b) => !b.redeemed_at).length;

  return (
    <Link href={`/(app)/membership/${membership.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedText type="smallBold">{membership.business.name}</ThemedText>
          <StatusBadge status={membership.status} />
        </View>
        <ThemedText themeColor="textSecondary" type="small">
          {membership.business.category === 'fnb' ? 'Food & Beverage' : 'Retail'}
        </ThemedText>
        {unredeemedCount > 0 && (
          <ThemedText type="small" style={[styles.benefitCount, { color: '#3c87f7' }]}>
            {unredeemedCount} unredeemed benefit{unredeemedCount > 1 ? 's' : ''}
          </ThemedText>
        )}
      </Pressable>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'active';
  return (
    <View style={[styles.badge, { backgroundColor: isActive ? '#e6f4ea' : '#fbe9e7' }]}>
      <ThemedText style={{ color: isActive ? '#1e7e34' : '#c0392b', fontSize: 12, fontWeight: '600' }}>
        {isActive ? 'Active' : 'Expired'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  search: {
    borderWidth: 1,
    borderColor: '#D0D0D5',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  list: {
    gap: 10,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 14,
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  benefitCount: {
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 48,
  },
});
