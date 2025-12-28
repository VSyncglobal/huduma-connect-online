#!/bin/bash

echo "🚀 Initializing HUDUMA CONNECT Configuration..."

# 1. Update Tailwind Config (Silver & Black Palette)
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        silver: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
        },
        huduma: {
          black: '#000000',
          charcoal: '#1a1a1a',
          glass: 'rgba(243, 244, 246, 0.8)',
        }
      },
      backgroundImage: {
        'shiny-footer': 'linear-gradient(to bottom, #1a1a1a, #000000)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
EOF

# 2. Update Global CSS (Scroll & Variables)
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #F3F4F6;
  --foreground: #1a1a1a;
}

html {
  scroll-behavior: smooth;
  background-color: var(--background);
}

body {
  color: var(--foreground);
  background: var(--background);
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #F3F4F6; }
::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
EOF

# 3. Create Data Directory
mkdir -p src/data

# 4. Create Service Data File
cat > src/data/services.ts << 'EOF'
import { Landmark, FileText, Car, GraduationCap, Palette, CreditCard } from 'lucide-react';

export const SERVICE_CATEGORIES = [
  {
    id: 'gov-official',
    title: 'Government & Official',
    icon: Landmark,
    description: 'eCitizen, KRA, Immigration & Civil Registration.',
    services: ['Passport Application', 'Birth/Death Certificates', 'Good Conduct', 'KRA Returns & PIN', 'Company Registration', 'Land Search']
  },
  {
    id: 'transport',
    title: 'NTSA & Transport',
    icon: Car,
    description: 'Vehicle management and licensing services.',
    services: ['Smart DL Application', 'Logbook Search', 'Transfer of Ownership', 'PSV Badge', 'Inspection Booking']
  },
  {
    id: 'academic',
    title: 'Academic & Professional',
    icon: GraduationCap,
    description: 'KUCCPS, HELB, and Research Assistance.',
    services: ['HELB Application', 'KUCCPS Placement', 'Research Assistance', 'Assignment Typing', 'Exam Registration']
  },
  {
    id: 'media-design',
    title: 'Design & Media',
    icon: Palette,
    description: 'Creative branding and digital assets.',
    services: ['Graphic Design', 'Logo Creation', 'Business Cards', 'Photo Editing', 'Social Media Ads']
  },
  {
    id: 'digital-admin',
    title: 'Admin & Documents',
    icon: FileText,
    description: 'Typing, formatting, and proofreading.',
    services: ['CV/Résumé Writing', 'Report Typing', 'Data Entry', 'Proposal Writing', 'Document Conversion']
  },
  {
    id: 'payments',
    title: 'Payments & Banking',
    icon: CreditCard,
    description: 'Utility bills and banking support.',
    services: ['Token/Bill Payment', 'Online Banking Setup', 'NSSF/NHIF Returns']
  }
];
EOF

# 5. Create Components Directory
mkdir -p src/components/layout

# 6. Create Shiny Footer Component
cat > src/components/layout/ShinyFooter.tsx << 'EOF'
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
EOF

echo "✅ Configuration Complete. Silver-White Theme Applied."
