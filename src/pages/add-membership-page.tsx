import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InfoTooltip } from '@/components/info-tooltip';
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

export function AddMembershipPage() {
  const navigate = useNavigate();
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
      navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-14 pb-10">
      <h1 className="mb-4 font-script text-4xl text-primary">Add membership</h1>

      <div className="flex flex-col gap-2">
        <span className="font-display text-sm font-bold text-ink">Business name</span>
        <input
          className="rounded-xl border-2 border-ink/15 px-3 py-3 text-base placeholder:text-ink/40 focus:border-primary focus:outline-none"
          placeholder="e.g. Blue Bottle Coffee"
          value={businessName}
          onChange={(e) => {
            setBusinessName(e.target.value);
            setSelectedBusiness(null);
          }}
        />
        {!selectedBusiness && suggestions && suggestions.length > 0 && (
          <div className="rounded-xl border-2 border-ink/10">
            {suggestions.map((b) => (
              <button
                key={b.id}
                type="button"
                className="flex w-full items-center justify-between p-2.5 text-left"
                onClick={() => {
                  setSelectedBusiness(b);
                  setBusinessName(b.name);
                  setCategory(b.category as BusinessCategory);
                }}
              >
                <span>{b.name}</span>
                <span className="text-sm text-ink/50">
                  {b.category === 'fnb' ? 'F&B' : 'Retail'}
                </span>
              </button>
            ))}
          </div>
        )}

        <span className="mt-2 font-display text-sm font-bold text-ink">Category</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Pill
              key={c.value}
              label={c.label}
              selected={category === c.value}
              onClick={() => setCategory(c.value)}
            />
          ))}
        </div>

        <span className="mt-2 flex items-center font-display text-sm font-bold text-ink">
          Benefit
          <InfoTooltip label="What do these mean?">
            <strong>Use now</strong> — redeemable anytime.
            <br />
            <strong>Next purchase</strong> — only valid on your next visit.
            <br />
            <strong>Points</strong> — earned toward a reward over time.
            <br />
            <strong>Tier</strong> — a status perk tied to your membership level.
          </InfoTooltip>
        </span>
        <div className="flex flex-wrap gap-2">
          {BENEFIT_TYPES.map((b) => (
            <Pill
              key={b.value}
              label={b.label}
              selected={benefitType === b.value}
              onClick={() => setBenefitType(b.value)}
            />
          ))}
        </div>

        <input
          className="mt-2 rounded-xl border-2 border-ink/15 px-3 py-3 text-base placeholder:text-ink/40 focus:border-primary focus:outline-none"
          placeholder="e.g. 10% off next purchase"
          value={benefitDescription}
          onChange={(e) => setBenefitDescription(e.target.value)}
        />

        {benefitType === 'next_purchase' && (
          <>
            <span className="mt-2 font-display text-sm font-bold text-ink">
              Redeemable by (optional)
            </span>
            <input
              className="rounded-xl border-2 border-ink/15 px-3 py-3 text-base placeholder:text-ink/40 focus:border-primary focus:outline-none"
              placeholder="YYYY-MM-DD"
              value={redeemableBy}
              onChange={(e) => setRedeemableBy(e.target.value)}
            />
          </>
        )}

        {error ? <p className="text-sm font-medium text-primary">{error}</p> : null}

        <button
          className="mt-4 rounded-full bg-primary py-3.5 text-center font-display font-bold text-white shadow-md shadow-primary/30 transition hover:brightness-95 disabled:opacity-60"
          onClick={handleSubmit}
          disabled={createMembership.isPending}
        >
          {createMembership.isPending ? 'Saving…' : 'Save membership'}
        </button>
      </div>
    </div>
  );
}

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        selected ? 'bg-primary text-white' : 'bg-ink text-white'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
