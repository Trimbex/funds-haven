"use client";

import { useState } from 'react';
import { Bell, User, Search, Settings } from 'lucide-react';
import { Button } from './button';
import { useNotifications } from '@/app/hooks/useNotifications';
import Link from 'next/link';

export const Header = () => {
  const { unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-30 border-b border-white/20 backdrop-blur-xl bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex justify-between items-center">
          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions, categories..."
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Mobile Search Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 rounded-xl"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Notification Bell */}
            <Link href="/inbox">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Settings Button - Hidden on mobile */}
            <Link href="/settings" className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 rounded-xl"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            
            {/* User Profile */}
            <div className="flex items-center space-x-2 lg:space-x-3 p-2 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer group">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900">Saif</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};