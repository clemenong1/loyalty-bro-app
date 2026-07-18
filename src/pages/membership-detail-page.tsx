import { useNavigate, useParams } from 'react-router-dom';

import { useMembershipQuery, useToggleBenefitRedeemed } from '@/hooks/use-memberships';
import type { Tables } from '@/types/database';

const BENEFIT_TYPE_LABELS: Record<string, string> = {
  immediate: 'Use now',
  next_purchase: 'Next purchase',
  points: 'Points',
  tier: 'Tier',
};

export function MembershipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: membership, isLoading } = useMembershipQuery(id!);
  const toggleRedeemed = useToggleBenefitRedeemed();

  if (isLoading || !membership) {
    return <div className="flex min-h-screen items-center justify-center">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-14 pb-10">
      <button className="mb-2 text-sm text-primary" onClick={() => navigate(-1)}>
        ← Back to wallet
      </button>

      <h1 className="text-2xl font-semibold">{membership.business.name}</h1>
      <p className="mb-4 text-gray-500 dark:text-gray-400">
        {membership.business.category === 'fnb' ? 'Food & Beverage' : 'Retail'} · Joined{' '}
        {new Date(membership.joined_date).toLocaleDateString()} ·{' '}
        {membership.status === 'active' ? 'Active' : 'Expired'}
      </p>

      <h2 className="mb-1 mt-4 text-sm font-bold">Benefits</h2>
      {membership.benefits.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No benefits recorded.</p>
      ) : (
        membership.benefits.map((benefit) => (
          <BenefitRow
            key={benefit.id}
            benefit={benefit}
            onToggle={(redeemed) => toggleRedeemed.mutate({ benefitId: benefit.id, redeemed })}
          />
        ))
      )}
    </div>
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
    <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <div className="flex flex-1 flex-col gap-0.5">
        <span>{benefit.description}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {BENEFIT_TYPE_LABELS[benefit.type] ?? benefit.type}
          {benefit.redeemable_by ? ` · by ${new Date(benefit.redeemable_by).toLocaleDateString()}` : ''}
        </span>
      </div>
      <button
        className={`whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-sm ${
          isRedeemed
            ? 'border-green-700 bg-green-50 text-green-700'
            : 'border-gray-300 dark:border-gray-700'
        }`}
        onClick={() => onToggle(!isRedeemed)}
      >
        {isRedeemed ? 'Redeemed' : 'Mark redeemed'}
      </button>
    </div>
  );
}
