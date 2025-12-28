"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthModal } from '@/store/useAuthModal';
import { 
  ArrowLeft, MessageSquare, UploadCloud, 
  Send, Loader2, FileText, User, Phone 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileUpload } from '@/components/forms/FileUpload';
import { useRouter } from 'next/navigation';

export default function CustomRequestPage() {
  const router = useRouter();
  const { openModal } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    requestTitle: '',
    description: '',
    documents: [] as string[]
  });

  // Auto-fill user data
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setFormData(prev => ({ 
          ...prev, 
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || ''
        }));
      }
    });
  }, []);

  const handleSubmit = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { openModal('signin'); return; }

    if (!formData.requestTitle || !formData.description || !formData.phoneNumber) {
      alert("Please provide a title, description, and phone number.");
      return;
    }

    setIsLoading(true);

    try {
      // We re-use the same API, but with a special ID
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          serviceId: 'custom-request', // Special Flag
          serviceTitle: `Custom: ${formData.requestTitle}`,
          price: 0, // Price is 0 because you will quote them later
          userId: session.user.id,
          applicantData: {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            idNumber: 'N/A',
            notes: formData.description,
            documents: formData.documents,
            // Store the full description in the custom fields for the admin view
            customFields: {
              request_details: formData.description,
              client_proposal: "Waiting for Admin Quote"
            } 
          }, 
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      alert(`Request Received! Application ID: ${result.applicationId}. We will call you shortly with a quote.`);
      router.push('/dashboard');

    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-silver-100 pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/#services" className="inline-flex items-center text-gray-500 hover:text-black mb-8 transition-colors text-sm font-bold">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Services
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left: Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-huduma-black text-white p-6 rounded-2xl">
              <MessageSquare className="h-8 w-8 mb-4 text-gray-300" />
              <h2 className="text-xl font-bold mb-2">Custom Request</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Can't find the service you need? Describe it here. We handle specialized government, legal, and business processing requests.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">How it works</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><span className="font-bold text-black">1.</span> Describe your need</li>
                <li className="flex gap-2"><span className="font-bold text-black">2.</span> Attach any docs</li>
                <li className="flex gap-2"><span className="font-bold text-black">3.</span> We call with a quote</li>
                <li className="flex gap-2"><span className="font-bold text-black">4.</span> You pay & we process</li>
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Request Details</h3>
              
              <div className="space-y-5">
                
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input 
                        type="tel" 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Request Content */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Service Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Affidavit for lost ID"
                    value={formData.requestTitle}
                    onChange={(e) => setFormData({...formData, requestTitle: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Detailed Description</label>
                  <textarea 
                    rows={5}
                    placeholder="Please explain exactly what you need..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none resize-none"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Supporting Documents (Optional)</label>
                  <FileUpload 
                    onUploadComplete={(urls) => setFormData({...formData, documents: urls})}
                  />
                </div>

                {/* Submit */}
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-huduma-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center mt-4"
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Submit Request
                    </>
                  )}
                </button>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}