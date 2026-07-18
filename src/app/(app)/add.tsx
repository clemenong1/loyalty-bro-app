import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { useBusinessSearch, useCreateMembership } from '@/hooks/use-memberships';
import type { BenefitType, BusinessCategory, Tables } from '@/types/database';

const CATEGORIES: { label: string; value: BusinessCategory }[] = [
  { label: 'Retail', value: 'retail' },
  { label: 'Food & Beverage', value: 'fnb' },
];

const BENEFIT_TYPES: { label: string; value: BenefitType }[] = [
  { label: 'Use now', value: 'immediate' },
  { label: 'Next purchase', value: 'next_purchase' },
  { label: 'Points', value: 'points' },
  { label: 'Tier', value: 'tier' },
];

export default function AddMembershipScreen() {
  const [businessName, setBusinessName] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<Tables<'businesses'> | null>(null);
  const [category, setCategory] = useState<BusinessCategory>('retail');
  const [benefitType, setBenefitType] = useState<BenefitType>('immediate');
  const [benefitDescription, setBenefitDescription] = useState('');
  const [redeemableBy, setRedeemableBy] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: suggestions } = useBusinessSearch(selectedBusiness ? '' : businessName);
  const createMembership = useCreateMembership();

  async function handleSubmit() {
    setError(null);
    if (!businessName.trim()) {
      setError('Business name is required');
      return;
    }
    if (!benefitDescription.trim()) {
      setError('Benefit description is required');
      return;
    }

    try {
      await createMembership.mutateAsync({
        businessId: selectedBusiness?.id,
        businessName: businessName.trim(),
        category,
        benefitType,
        benefitDescription: benefitDescription.trim(),
        redeemableBy: redeemableBy.trim() || undefined,
      });
      setBusinessName('');
      setSelectedBusiness(null);
      setBenefitDescription('');
      setRedeemableBy('');
      router.replace('/(app)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.title}>
          Add membership
        </ThemedText>

        <ThemedText type="smallBold">Business name</ThemedText>
        <ThemedTextInput
          style={styles.input}
          placeholder="e.g. Blue Bottle Coffee"
          value={businessName}
          onChangeText={(text) => {
            setBusinessName(text);
            setSelectedBusiness(null);
          }}
        />
        {!selectedBusiness && suggestions && suggestions.length > 0 && (
          <View style={styles.suggestions}>
            {suggestions.map((b) => (
              <Pressable
                key={b.id}
                style={styles.suggestionRow}
                onPress={() => {
                  setSelectedBusiness(b);
                  setBusinessName(b.name);
                  setCategory(b.category as BusinessCategory);
                }}
              >
                <ThemedText>{b.name}</ThemedText>
                <ThemedText themeColor="textSecondary" type="small">
                  {b.category === 'fnb' ? 'F&B' : 'Retail'}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        )}

        <ThemedText type="smallBold" style={styles.sectionLabel}>
          Category
        </ThemedText>
        <View style={styles.pillRow}>
          {CATEGORIES.map((c) => (
            <Pill key={c.value} label={c.label} selected={category === c.value} onPress={() => setCategory(c.value)} />
          ))}
        </View>

        <ThemedText type="smallBold" style={styles.sectionLabel}>
          Benefit
        </ThemedText>
        <View style={styles.pillRow}>
          {BENEFIT_TYPES.map((b) => (
            <Pill
              key={b.value}
              label={b.label}
              selected={benefitType === b.value}
              onPress={() => setBenefitType(b.value)}
            />
          ))}
        </View>

        <ThemedTextInput
          style={styles.input}
          placeholder="e.g. 10% off next purchase"
          value={benefitDescription}
          onChangeText={setBenefitDescription}
        />

        {benefitType === 'next_purchase' && (
          <>
            <ThemedText type="smallBold" style={styles.sectionLabel}>
              Redeemable by (optional)
            </ThemedText>
            <ThemedTextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={redeemableBy}
              onChangeText={setRedeemableBy}
            />
          </>
        )}

        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        <Pressable style={styles.button} onPress={handleSubmit} disabled={createMembership.isPending}>
          {createMembership.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Save membership</ThemedText>
          )}
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

function Pill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.pill, selected && styles.pillSelected]} onPress={onPress}>
      <ThemedText style={selected ? styles.pillTextSelected : undefined} type="small">
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 12,
  },
  sectionLabel: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  suggestions: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: '#D0D0D5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillSelected: {
    backgroundColor: '#3c87f7',
    borderColor: '#3c87f7',
  },
  pillTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#3c87f7',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#d92d20',
  },
});
