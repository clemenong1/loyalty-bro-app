import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { InfoTooltip } from '@/components/info-tooltip';
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

  const activeCount = memberships?.filter((m) => m.status === 'active').length ?? 0;
  const unredeemedCount =
    memberships?.reduce((sum, m) => sum + m.benefits.filter((b) => !b.redeemed_at).length, 0) ?? 0;
  const hasMemberships = !!memberships && memberships.length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-14">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="flex items-center font-script text-4xl text-primary">
          Wallet
          <InfoTooltip label="What is the Wallet?">
            Every loyalty membership you've added lives here. Tap a card to see its benefits and mark
            them as redeemed once you've used them.
          </InfoTooltip>
        </h1>
        <div className="flex items-center gap-4">
          <button
            className="text-sm font-semibold text-ink/60 disabled:opacity-50"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? 'Refreshing…' : 'Refresh'}
          </button>
          <button className="text-sm font-semibold text-primary" onClick={() => supabase.auth.signOut()}>
            Log out
          </button>
        </div>
      </div>

      {hasMemberships && (
        <p className="mb-4 text-sm font-semibold text-ink/60">
          {activeCount} active ·{' '}
          <span className={unredeemedCount > 0 ? 'text-primary' : undefined}>
            {unredeemedCount} unredeemed benefit{unredeemedCount === 1 ? '' : 's'}
          </span>
        </p>
      )}

      <input
        className="mb-4 w-full rounded-xl border-2 border-ink/15 px-3 py-2.5 text-base placeholder:text-ink/40 focus:border-primary focus:outline-none"
        placeholder="Search your memberships..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoCapitalize="none"
      />

      <div className="flex flex-col gap-3 pb-6">
        {!isLoading && !hasMemberships && (
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <p className="font-display text-lg font-bold text-ink">Your wallet's empty</p>
            <p className="max-w-xs text-sm text-ink/60">
              Add every loyalty card and perk you've signed up for — we'll keep track of what's active
              and what's still unredeemed, so nothing goes to waste.
            </p>
            <Link
              to="/add"
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/30 transition hover:brightness-95"
            >
              Add your first membership
            </Link>
          </div>
        )}
        {!isLoading && hasMemberships && filtered.length === 0 && (
          <p className="mt-12 text-center text-ink/50">No memberships match "{search}".</p>
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
      className="flex flex-col gap-1 rounded-2xl border-2 border-ink/10 p-4 transition hover:border-primary/40"
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-bold text-ink">
          {membership.business.name}
        </span>
        <StatusBadge status={membership.status} />
      </div>
      <span className="text-sm text-ink/50">
        {membership.business.category === 'fnb' ? 'Food & Beverage' : 'Retail'}
      </span>
      {unredeemedCount > 0 && (
        <span className="mt-1 text-sm font-semibold text-primary">
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
      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
        isActive ? 'bg-ink text-white' : 'border-2 border-ink/30 text-ink/50'
      }`}
    >
      {isActive ? 'Active' : 'Expired'}
    </span>
  );
}
