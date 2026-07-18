import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/index.css';

const root = createRoot(document.getElementById('root')!);

import('@/root')
  .then(({ default: Root }) => {
    root.render(
      <StrictMode>
        <Root />
      </StrictMode>,
    );
  })
  .catch((err: unknown) => {
    // Renders a visible message instead of a blank page when the app fails to
    // load at startup (e.g. a missing Supabase env var on this deployment).
    root.render(
      <div style={{ padding: 24, fontFamily: 'sans-serif', color: '#fff', background: '#000', minHeight: '100vh' }}>
        <h1 style={{ fontSize: 20 }}>Loyalty Bro failed to start</h1>
        <p>{err instanceof Error ? err.message : String(err)}</p>
      </div>,
    );
  });
