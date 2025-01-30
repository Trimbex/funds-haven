
import { FC } from 'react';
import { usePathname } from 'next/navigation';

interface NavProps {
  isMobile?: boolean;
  className?: string;
}

export const Nav: FC<NavProps> = ({ isMobile = false, className = '' }) => {

  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/transactions', label: 'Transactions' },
    { href: '/categories', label: 'Categories' },
    { href: '/accounts', label: 'Accounts' },
    { href: '/settings', label: 'Settings' },
  ];

  const baseClasses = isMobile 
    ? 'flex flex-col space-y-4 p-4' 
    : 'hidden lg:flex lg:items-center lg:space-x-6 lg:flex-grow lg:justify-center';

  return (
    <nav className={`${baseClasses} ${className}`}>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <a
            key={link.label}
            href={link.href}
            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-all duration-300 
              ${isActive ? 'text-[#009dff] bg-gray-100' : 'text-gray-600 hover:text-[#009dff] hover:bg-gray-100'}`}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
};
