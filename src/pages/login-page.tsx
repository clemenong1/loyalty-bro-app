import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthOnlyRoute } from '@/components/auth-only-route';
import { supabase } from '@/lib/supabase';

export function LoginPage() {
  return (
    <AuthOnlyRoute>
      <LoginForm />
    </AuthOnlyRoute>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setError(null);
    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate('/', { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 p-6">
      <h1 className="text-center text-3xl font-semibold">Loyalty Bro</h1>
      <h2 className="mb-4 text-center text-lg font-semibold">Log in</h2>

      <input
        className="rounded-lg border border-gray-300 px-3 py-3 text-base placeholder:text-gray-400 dark:border-gray-700 dark:bg-transparent"
        placeholder="Email"
        type="email"
        autoCapitalize="none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="rounded-lg border border-gray-300 px-3 py-3 text-base placeholder:text-gray-400 dark:border-gray-700 dark:bg-transparent"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        className="mt-2 rounded-lg bg-primary py-3.5 font-semibold text-white disabled:opacity-60"
        onClick={handleLogin}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in…' : 'Log in'}
      </button>

      <Link to="/signup" className="mt-4 self-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account? Sign up
      </Link>
    </div>
  );
}
