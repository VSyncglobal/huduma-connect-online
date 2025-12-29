"use client";
import React from 'react';
import Link from 'next/link';
import { MessageCircle, ShieldCheck } from 'lucide-react';

export const ShinyFooter = () => {
  return (
    <footer className="relative w-full bg-black text-white pt-20 pb-10 overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-black via-gray-500 to-black opacity-50" />
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#1a1a1a] to-black opacity-80 pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight mb-4 text-gray-100">
              HUDUMA CONNECT<span className="block text-sm font-normal text-gray-400 mt-1">ONLINE CYBER</span>
            </h3>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-6">
              Bridging the gap between Kenyan citizens and digital government services. Secure, fast, and reliable processing.
            </p>
          </div>

          {/* Services Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/#services" className="hover:text-white transition-colors">Browse Services</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Track Application</Link></li>
            </ul>
          </div>

          {/* Contact / WhatsApp Section */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Support Center</h4>
            <div className="flex flex-col gap-4">
              <p className="text-gray-500 text-xs">Need instant assistance?</p>
              
              {/* Active WhatsApp Button */}
              <a 
                href="https://wa.me/254111990661" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <span className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                  +254 111 990 661
                </span>
              </a>

              <a 
                href="https://wa.me/254111990661" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-gray-400 hover:text-white transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with an Agent
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar - RESTRUCTURED AS REQUESTED */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Left: Brand Identity */}
          <div className="text-gray-500 text-xs text-center md:text-left w-full md:w-auto font-medium tracking-wide">
            huduma.online
          </div>

          {/* Center: Privacy Policy (The Focus) */}
          <div className="flex-1 flex justify-center w-full md:w-auto">
             <Link href="/privacy-policy" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group">
               <ShieldCheck className="h-4 w-4 group-hover:text-green-400 transition-colors" />
               <span className="underline underline-offset-4">Privacy Policy</span>
             </Link>
          </div>

          {/* Right: Copyright */}
          <div className="text-gray-600 text-xs text-center md:text-right w-full md:w-auto">
            &copy; {new Date().getFullYear()} All rights reserved.
          </div>
          
        </div>
      </div>
    </footer>
  );
};