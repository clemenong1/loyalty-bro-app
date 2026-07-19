import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

export function InfoTooltip({ label, children }: PropsWithChildren<{ label: string }>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block align-middle">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-ink/15 text-[10px] font-bold leading-none text-ink/60 transition hover:bg-ink/25"
      >
        ?
      </button>
      {open && (
        <span className="absolute left-0 top-full z-10 mt-1.5 w-52 rounded-xl border-2 border-ink/10 bg-cream p-3 text-left font-sans text-xs font-normal leading-snug text-ink/80 shadow-lg">
          {children}
        </span>
      )}
    </span>
  );
}
