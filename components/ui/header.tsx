"use client";

import Image from 'next/image';
import { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';
import { Nav } from './nav';  
import { WelcomeMessage } from './welcome';



export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Logo and Brand Name */}
                <div className="flex items-center space-x-3">
                    <Image src="/logo.svg" alt="Logo" width={50} height={50} />
                    <span className="text-2xl font-sans font-bold text-gray-700">Funds Haven</span>
                </div>

                {/* Hamburger Menu for Mobile */}
                <div className="lg:hidden">
                    <button onClick={toggleMenu} className="text-gray-600 hover:text-[#009dff] transition-all duration-300">
                        <HiMenu className="w-6 h-6" />
                    </button>
                </div>

                {/* Desktop Navigation */}
                <Nav />

                {/* User Profile Section */}
                <div className="flex items-center space-x-4">
                    <button className="text-gray-600 hover:text-[#009dff] transition-all duration-300">
                        <FaBell className="w-6 h-6" />
                    </button>
                    
                    
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center" />  
                    
                    {  
                    /* Placeholder
                    <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">U</span>
                    </div> */} 
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white shadow-md">
                    <Nav isMobile />
                    {/* <div className="flex items-center space-x-4 p-4">
                        <button className="text-gray-600 hover:text-[#009dff] transition-all duration-300">
                            <FaBell className="w-6 h-6" />
                        </button>
                        <ClerkLoaded><UserButton afterSignOutUrl="/" /></ClerkLoaded>
                        <ClerkLoading>
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center" />  
                        </ClerkLoading>
                    </div> */}
                </div>
            )}
        </header>
        
        </>
    );
};