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
        <h1 className="text-center text-3xl font-semibold">Check your email</h1>
        <p className="mb-4 text-center">
          We sent a confirmation link to {email}. Confirm it, then log in.
        </p>
        <button
          className="rounded-lg bg-primary py-3.5 font-semibold text-white"
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
      <h1 className="text-center text-3xl font-semibold">Loyalty Bro</h1>
      <h2 className="mb-4 text-center text-lg font-semibold">Sign up</h2>

      <input
        className="rounded-lg border border-gray-300 px-3 py-3 text-base placeholder:text-gray-400 dark:border-gray-700 dark:bg-transparent"
        placeholder="Email"
        type="email"
        required
        autoCapitalize="none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="rounded-lg border border-gray-300 px-3 py-3 text-base placeholder:text-gray-400 dark:border-gray-700 dark:bg-transparent"
        placeholder="Password (min 6 characters)"
        type="password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        className="mt-2 rounded-lg bg-primary py-3.5 font-semibold text-white disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing up…' : 'Sign up'}
      </button>

      <Link to="/login" className="mt-4 self-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account? Log in
      </Link>
    </form>
  );
}
