import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Wallet' },
  { to: '/add', label: 'Add' },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex gap-2 bg-ink p-2">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `flex-1 rounded-full py-2.5 text-center text-sm font-bold transition ${
              isActive ? 'bg-primary text-white' : 'text-white/50 hover:text-white/80'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
