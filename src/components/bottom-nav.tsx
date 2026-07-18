import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Wallet' },
  { to: '/add', label: 'Add' },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-sm font-medium ${
              isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
