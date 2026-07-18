import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { BenefitType, BusinessCategory, Tables } from '@/types/database';
import { useAuth } from './use-auth';

export type MembershipWithDetails = Tables<'memberships'> & {
  business: Tables<'businesses'>;
  benefits: Tables<'benefits'>[];
};

const MEMBERSHIPS_KEY = ['memberships'];

export function useMembershipsQuery() {
  const { session } = useAuth();

  return useQuery({
    queryKey: MEMBERSHIPS_KEY,
    enabled: !!session,
    queryFn: async (): Promise<MembershipWithDetails[]> => {
      const { data, error } = await supabase
        .from('memberships')
        .select('*, business:businesses(*), benefits(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as MembershipWithDetails[];
    },
  });
}

export function useMembershipQuery(id: string) {
  return useQuery({
    queryKey: [...MEMBERSHIPS_KEY, id],
    queryFn: async (): Promise<MembershipWithDetails> => {
      const { data, error } = await supabase
        .from('memberships')
        .select('*, business:businesses(*), benefits(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as MembershipWithDetails;
    },
  });
}

export function useBusinessSearch(query: string) {
  return useQuery({
    queryKey: ['businesses', 'search', query],
    enabled: query.trim().length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .ilike('name', `%${query.trim()}%`)
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
}

type CreateMembershipInput = {
  businessId?: string;
  businessName: string;
  category: BusinessCategory;
  benefitType: BenefitType;
  benefitDescription: string;
  redeemableBy?: string;
};

export function useCreateMembership() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateMembershipInput) => {
      if (!session) throw new Error('Not authenticated');

      let businessId = input.businessId;

      if (!businessId) {
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .insert({ name: input.businessName, category: input.category })
          .select()
          .single();
        if (businessError) throw businessError;
        businessId = business.id;
      }

      const { data: membership, error: membershipError } = await supabase
        .from('memberships')
        .insert({ user_id: session.user.id, business_id: businessId })
        .select()
        .single();
      if (membershipError) throw membershipError;

      const { error: benefitError } = await supabase.from('benefits').insert({
        membership_id: membership.id,
        type: input.benefitType,
        description: input.benefitDescription,
        redeemable_by: input.redeemableBy ?? null,
      });
      if (benefitError) throw benefitError;

      return membership;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_KEY });
    },
  });
}

export function useToggleBenefitRedeemed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ benefitId, redeemed }: { benefitId: string; redeemed: boolean }) => {
      const { error } = await supabase
        .from('benefits')
        .update({ redeemed_at: redeemed ? new Date().toISOString() : null })
        .eq('id', benefitId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERSHIPS_KEY });
    },
  });
}
