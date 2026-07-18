export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      benefits: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          membership_id: string;
          redeemable_by: string | null;
          redeemed_at: string | null;
          type: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          membership_id: string;
          redeemable_by?: string | null;
          redeemed_at?: string | null;
          type: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          membership_id?: string;
          redeemable_by?: string | null;
          redeemed_at?: string | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'benefits_membership_id_fkey';
            columns: ['membership_id'];
            isOneToOne: false;
            referencedRelation: 'memberships';
            referencedColumns: ['id'];
          },
        ];
      };
      businesses: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          is_claimed: boolean;
          location: string | null;
          logo_url: string | null;
          name: string;
          owner_id: string | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          is_claimed?: boolean;
          location?: string | null;
          logo_url?: string | null;
          name: string;
          owner_id?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          is_claimed?: boolean;
          location?: string | null;
          logo_url?: string | null;
          name?: string;
          owner_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'businesses_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      memberships: {
        Row: {
          barcode_payload: string | null;
          business_id: string;
          created_at: string;
          id: string;
          joined_date: string;
          notes: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          barcode_payload?: string | null;
          business_id: string;
          created_at?: string;
          id?: string;
          joined_date?: string;
          notes?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          barcode_payload?: string | null;
          business_id?: string;
          created_at?: string;
          id?: string;
          joined_date?: string;
          notes?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'memberships_business_id_fkey';
            columns: ['business_id'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'memberships_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          account_type: string;
          created_at: string;
          display_name: string | null;
          email: string;
          id: string;
        };
        Insert: {
          account_type?: string;
          created_at?: string;
          display_name?: string | null;
          email: string;
          id: string;
        };
        Update: {
          account_type?: string;
          created_at?: string;
          display_name?: string | null;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database['public'];

export type Tables<T extends keyof DefaultSchema['Tables']> = DefaultSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof DefaultSchema['Tables']> = DefaultSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof DefaultSchema['Tables']> = DefaultSchema['Tables'][T]['Update'];

export type BusinessCategory = 'retail' | 'fnb';
export type MembershipStatus = 'active' | 'expired';
export type BenefitType = 'immediate' | 'next_purchase' | 'points' | 'tier';
