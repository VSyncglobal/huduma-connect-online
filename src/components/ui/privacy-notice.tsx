// FILE: src/components/ui/privacy-notice.tsx
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock } from 'lucide-react';

export const DataPrivacyNotice = () => {
  return (
    <div className="my-6 p-6 rounded-2xl bg-white border border-gray-200 flex items-start gap-5 max-w-2xl shadow-lg">
      {/* Icon container */}
      <div className="flex-shrink-0 p-3 bg-blue-50 rounded-full border border-blue-100 flex items-center justify-center">
        <ShieldCheck className="h-6 w-6 text-blue-600" />
      </div>

      <div className="flex-1 space-y-2">
        <h4 className="text-sm md:text-base font-semibold text-gray-900 flex items-center gap-2">
          Strict Data Protection Act (2019) Compliance
          <Lock className="h-4 w-4 text-gray-400" />
        </h4>

        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
          We operate on a <strong className="text-gray-900">"Service-Only"</strong> data policy. Your information is used strictly to fulfil this request and is 
          <span className="text-gray-900 font-semibold"> permanently erased </span> 
          from our active systems thereafter. We <span className="italic">never</span> sell or share your data.
        </p>

        <div className="pt-1">
          <Link 
            href="/privacy-policy" 
            target="_blank"
            className="text-xs md:text-sm font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors flex items-center gap-1"
          >
            Read our full Data & Privacy Terms
            <span aria-hidden="true" className="text-blue-700 hover:text-blue-900">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
