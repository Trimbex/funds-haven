
import { FC } from 'react';

interface NavProps {
  isMobile?: boolean;
  className?: string;
}

export const Nav: FC<NavProps> = ({ isMobile = false, className = '' }) => {
  const navLinks = [
    { href: '#', label: 'Dashboard' },
    { href: '#', label: 'Transactions' },
    { href: '#', label: 'Categories' },
    { href: '/settings', label: 'Settings' },
  ];

  const baseClasses = isMobile 
    ? 'flex flex-col space-y-4 p-4' 
    : 'hidden lg:flex lg:items-center lg:space-x-6 lg:flex-grow lg:justify-center';

  return (
    <nav className={`${baseClasses} ${className}`}>
      {navLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-lg font-semibold text-gray-600 hover:text-[#009dff] hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-300"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};