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
      <button className="mb-2 text-sm font-semibold text-primary" onClick={() => navigate(-1)}>
        ← Back to wallet
      </button>

      <h1 className="font-display text-2xl font-bold text-ink dark:text-white">
        {membership.business.name}
      </h1>
      <p className="mb-4 text-ink/50 dark:text-white/50">
        {membership.business.category === 'fnb' ? 'Food & Beverage' : 'Retail'} · Joined{' '}
        {new Date(membership.joined_date).toLocaleDateString()} ·{' '}
        {membership.status === 'active' ? 'Active' : 'Expired'}
      </p>

      <h2 className="mb-1 mt-4 font-display text-sm font-bold text-ink dark:text-white">Benefits</h2>
      {membership.benefits.length === 0 ? (
        <p className="text-ink/50 dark:text-white/50">No benefits recorded.</p>
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
    <div className="mb-2 flex items-center justify-between gap-2 rounded-2xl border-2 border-ink/10 p-3 dark:border-white/15">
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-ink dark:text-white">{benefit.description}</span>
        <span className="text-sm text-ink/50 dark:text-white/50">
          {BENEFIT_TYPE_LABELS[benefit.type] ?? benefit.type}
          {benefit.redeemable_by ? ` · by ${new Date(benefit.redeemable_by).toLocaleDateString()}` : ''}
        </span>
      </div>
      <button
        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold transition ${
          isRedeemed ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-primary text-white'
        }`}
        onClick={() => onToggle(!isRedeemed)}
      >
        {isRedeemed ? 'Redeemed' : 'Mark redeemed'}
      </button>
    </div>
  );
}
