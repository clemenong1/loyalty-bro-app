import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMembershipQuery, useToggleBenefitRedeemed } from '@/hooks/use-memberships';
import type { Tables } from '@/types/database';

const BENEFIT_TYPE_LABELS: Record<string, string> = {
  immediate: 'Use now',
  next_purchase: 'Next purchase',
  points: 'Points',
  tier: 'Tier',
};

export default function MembershipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: membership, isLoading } = useMembershipQuery(id);
  const toggleRedeemed = useToggleBenefitRedeemed();

  if (isLoading || !membership) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <ThemedText type="linkPrimary">← Back to wallet</ThemedText>
        </Pressable>

        <ThemedText type="title" style={styles.title}>
          {membership.business.name}
        </ThemedText>
        <ThemedText themeColor="textSecondary">
          {membership.business.category === 'fnb' ? 'Food & Beverage' : 'Retail'} · Joined{' '}
          {new Date(membership.joined_date).toLocaleDateString()} ·{' '}
          {membership.status === 'active' ? 'Active' : 'Expired'}
        </ThemedText>

        <ThemedText type="smallBold" style={styles.sectionLabel}>
          Benefits
        </ThemedText>
        {membership.benefits.length === 0 ? (
          <ThemedText themeColor="textSecondary">No benefits recorded.</ThemedText>
        ) : (
          membership.benefits.map((benefit) => (
            <BenefitRow
              key={benefit.id}
              benefit={benefit}
              onToggle={(redeemed) => toggleRedeemed.mutate({ benefitId: benefit.id, redeemed })}
            />
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

function BenefitRow({
  benefit,
  onToggle,
}: {
  benefit: Tables<'benefits'>;
  onToggle: (redeemed: boolean) => void;
}) {
  const isRedeemed = !!benefit.redeemed_at;

  return (
    <View style={styles.benefitRow}>
      <View style={styles.benefitInfo}>
        <ThemedText>{benefit.description}</ThemedText>
        <ThemedText themeColor="textSecondary" type="small">
          {BENEFIT_TYPE_LABELS[benefit.type] ?? benefit.type}
          {benefit.redeemable_by ? ` · by ${new Date(benefit.redeemable_by).toLocaleDateString()}` : ''}
        </ThemedText>
      </View>
      <Pressable
        style={[styles.redeemButton, isRedeemed && styles.redeemButtonActive]}
        onPress={() => onToggle(!isRedeemed)}
      >
        <ThemedText style={isRedeemed ? styles.redeemTextActive : undefined} type="small">
          {isRedeemed ? 'Redeemed' : 'Mark redeemed'}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 8,
  },
  backLink: {
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
  },
  sectionLabel: {
    marginTop: 16,
    marginBottom: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  benefitInfo: {
    flex: 1,
    gap: 2,
  },
  redeemButton: {
    borderWidth: 1,
    borderColor: '#D0D0D5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  redeemButtonActive: {
    backgroundColor: '#e6f4ea',
    borderColor: '#1e7e34',
  },
  redeemTextActive: {
    color: '#1e7e34',
  },
});
