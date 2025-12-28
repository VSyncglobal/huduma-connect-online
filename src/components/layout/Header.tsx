"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthModal } from '@/store/useAuthModal';
import { supabase } from '@/lib/supabase';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const { openModal } = useAuthModal();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. Listen for Scroll Events to toggle transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Real-time Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    window.location.reload();
  };

  return (
    <motion.nav 
      initial={{ y: -100 }} 
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ease-in-out flex justify-between items-center
        ${isScrolled 
          ? 'py-4 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm' // Scrolled State (White)
          : 'py-6 bg-transparent border-transparent' // Top State (Transparent)
        }
      `}
    >
      {/* Logo Text - Changes color based on scroll */}
      <Link 
        href="/" 
        className={`font-bold text-lg tracking-tight cursor-pointer transition-colors
          ${isScrolled ? 'text-black' : 'text-white'}
        `}
      >
        HUDUMA CONNECT
      </Link>
      
      {/* Navigation Links */}
      <div className={`hidden md:flex gap-8 text-sm font-medium transition-colors
        ${isScrolled ? 'text-gray-600' : 'text-gray-300'}
      `}>
        <Link href="/#services" className={`transition-colors ${isScrolled ? 'hover:text-black' : 'hover:text-white'}`}>Services</Link>
        <Link href="/dashboard" className={`transition-colors ${isScrolled ? 'hover:text-black' : 'hover:text-white'}`}>Track Status</Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          // LOGGED IN STATE
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border shadow-sm transition-all
                ${isScrolled 
                  ? 'bg-black text-white border-black hover:bg-gray-800' 
                  : 'bg-white text-black border-white hover:bg-gray-200'}
              `}>
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            </Link>
            <button 
              onClick={handleLogout}
              className={`p-2 rounded-full transition-colors
                ${isScrolled ? 'text-red-500 hover:bg-red-50' : 'text-white hover:bg-white/20'}
              `}
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          // LOGGED OUT STATE
          <button 
            onClick={() => openModal('signin')}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2
              ${isScrolled 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-white text-black hover:bg-gray-200'}
            `}
          >
            <User className="h-4 w-4" /> Portal Login
          </button>
        )}
      </div>
    </motion.nav>
  );
};