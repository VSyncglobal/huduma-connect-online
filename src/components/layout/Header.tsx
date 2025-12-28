"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const Header = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-[#F3F4F6]/80 border-b border-white/50"
    >
      <Link href="/" className="font-bold text-lg tracking-tight text-black cursor-pointer">
        HUDUMA CONNECT
      </Link>
      
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        <Link href="#services" className="hover:text-black transition-colors">Services</Link>
        <Link href="#" className="hover:text-black transition-colors">Track Status</Link>
        <Link href="#" className="hover:text-black transition-colors">Pricing</Link>
      </div>

      <button className="bg-black text-white px-5 py-2 text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
        Portal Login
      </button>
    </motion.nav>
  );
};