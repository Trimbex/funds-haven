"use client";

import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { User, Search, Settings } from 'lucide-react';
import { Button } from './button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/20 backdrop-blur-xl bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions, categories..."
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 rounded-xl"
            >
              <FaBell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 rounded-xl"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
            
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
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