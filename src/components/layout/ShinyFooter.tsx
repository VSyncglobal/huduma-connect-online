"use client";
import React from 'react';

export const ShinyFooter = () => {
  return (
    <footer className="relative w-full bg-black text-white pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-black via-gray-500 to-black opacity-50" />
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#1a1a1a] to-black opacity-80 pointer-events-none" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight mb-4 text-gray-100">
              HUDUMA CONNECT<span className="block text-sm font-normal text-gray-400 mt-1">ONLINE CYBER</span>
            </h3>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed">Bridging the gap between Kenyan citizens and digital services.</p>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>eCitizen & Immigration</li><li>KRA iTax</li><li>NTSA Transport</li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Connect</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>WhatsApp Support</li><li>Track Application</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; 2025 Huduma Connect Online Cyber.</p>
        </div>
      </div>
    </footer>
  );
};
