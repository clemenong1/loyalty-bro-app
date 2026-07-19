import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthOnlyRoute } from '@/components/auth-only-route';
import { supabase } from '@/lib/supabase';

export function SignupPage() {
  return (
    <AuthOnlyRoute>
      <SignupForm />
    </AuthOnlyRoute>
  );
}

function SignupForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setIsSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      navigate('/', { replace: true });
      return;
    }
    setCheckEmail(true);
  }

  if (checkEmail) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 p-6">
        <h1 className="text-center font-display text-2xl font-bold text-ink">
          Check your email
        </h1>
        <p className="mb-4 text-center text-ink/70">
          We sent a confirmation link to {email}. Confirm it, then log in.
        </p>
        <button
          className="rounded-full bg-primary py-3.5 font-display font-bold text-white shadow-md shadow-primary/30 transition hover:brightness-95"
          onClick={() => navigate('/login', { replace: true })}
        >
          Back to log in
        </button>
      </div>
    );
  }

  return (
    <form
      className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 p-6"
      onSubmit={handleSignup}
    >
      <h1 className="text-center font-script text-6xl leading-tight text-primary">Loyalty Bro</h1>
      <h2 className="mb-4 text-center font-display text-lg font-bold text-ink">Sign up</h2>

      <input
        className="rounded-xl border-2 border-ink/15 px-3 py-3 text-base placeholder:text-ink/40 focus:border-primary focus:outline-none"
        placeholder="Email"
        type="email"
        required
        autoCapitalize="none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="rounded-xl border-2 border-ink/15 px-3 py-3 text-base placeholder:text-ink/40 focus:border-primary focus:outline-none"
        placeholder="Password (min 6 characters)"
        type="password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error ? <p className="text-sm font-medium text-primary">{error}</p> : null}

      <button
        type="submit"
        className="mt-2 rounded-full bg-primary py-3.5 font-display font-bold text-white shadow-md shadow-primary/30 transition hover:brightness-95 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing up…' : 'Sign up'}
      </button>

      <Link to="/login" className="mt-4 self-center text-sm text-ink/60">
        Already have an account? <span className="font-semibold text-primary">Log in</span>
      </Link>
    </form>
  );
}
