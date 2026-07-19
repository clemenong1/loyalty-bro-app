import { useState, type FormEvent } from 'react';
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

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
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
    <form
      className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 p-6"
      onSubmit={handleLogin}
    >
      <h1 className="text-center font-script text-6xl leading-tight text-primary">Loyalty Bro</h1>
      <h2 className="mb-4 text-center font-display text-lg font-bold text-ink">Log in</h2>

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
        placeholder="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error ? <p className="text-sm font-medium text-primary">{error}</p> : null}

      <button
        type="submit"
        className="mt-2 rounded-full bg-primary py-3.5 font-display font-bold text-white shadow-md shadow-primary/30 transition hover:brightness-95 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in…' : 'Log in'}
      </button>

      <Link to="/signup" className="mt-4 self-center text-sm text-ink/60">
        Don&apos;t have an account? <span className="font-semibold text-primary">Sign up</span>
      </Link>
    </form>
  );
}
