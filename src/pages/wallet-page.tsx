import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useMembershipsQuery, type MembershipWithDetails } from '@/hooks/use-memberships';
import { supabase } from '@/lib/supabase';

export function WalletPage() {
  const { data: memberships, isLoading, isRefetching, refetch } = useMembershipsQuery();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!memberships) return [];
    const q = search.trim().toLowerCase();
    if (!q) return memberships;
    return memberships.filter((m) => m.business.name.toLowerCase().includes(q));
  }, [memberships, search]);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-14">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Wallet</h1>
        <div className="flex items-center gap-4">
          <button
            className="text-sm text-primary disabled:opacity-50"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? 'Refreshing…' : 'Refresh'}
          </button>
          <button className="text-sm text-primary" onClick={() => supabase.auth.signOut()}>
            Log out
          </button>
        </div>
      </div>

      <input
        className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base placeholder:text-gray-400 dark:border-gray-700 dark:bg-transparent"
        placeholder="Search your memberships..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoCapitalize="none"
      />

      <div className="flex flex-col gap-2.5 pb-6">
        {!isLoading && filtered.length === 0 && (
          <p className="mt-12 text-center text-gray-500 dark:text-gray-400">
            No memberships yet. Add one from the Add tab.
          </p>
        )}
        {filtered.map((item) => (
          <MembershipCard key={item.id} membership={item} />
        ))}
      </div>
    </div>
  );
}

function MembershipCard({ membership }: { membership: MembershipWithDetails }) {
  const unredeemedCount = membership.benefits.filter((b) => !b.redeemed_at).length;

  return (
    <Link
      to={`/membership/${membership.id}`}
      className="flex flex-col gap-1 rounded-lg border border-gray-200 p-3.5 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">{membership.business.name}</span>
        <StatusBadge status={membership.status} />
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {membership.business.category === 'fnb' ? 'Food & Beverage' : 'Retail'}
      </span>
      {unredeemedCount > 0 && (
        <span className="mt-1 text-sm text-primary">
          {unredeemedCount} unredeemed benefit{unredeemedCount > 1 ? 's' : ''}
        </span>
      )}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'active';
  return (
    <span
      className="rounded-md px-2 py-0.5 text-xs font-semibold"
      style={{
        backgroundColor: isActive ? '#e6f4ea' : '#fbe9e7',
        color: isActive ? '#1e7e34' : '#c0392b',
      }}
    >
      {isActive ? 'Active' : 'Expired'}
    </span>
  );
}
