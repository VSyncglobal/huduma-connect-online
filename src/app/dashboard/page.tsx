"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthModal } from '@/store/useAuthModal';
import { useRouter } from 'next/navigation';
import { 
  Loader2, FileText, Clock, CheckCircle2, 
  XCircle, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Application {
  id: string;
  service_title: string;
  status: 'pending_payment' | 'processing' | 'completed' | 'rejected';
  price_paid: number;
  created_at: string;
  applicant_name: string;
  mpesa_reference?: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const { openModal } = useAuthModal();
  
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/');
        setTimeout(() => openModal('signin'), 500);
        return;
      }

      setUserProfile(session.user);

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setApplications(data || []);
      
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 mr-2" />;
      case 'processing': return <Loader2 className="h-4 w-4 mr-2 animate-spin" />;
      case 'rejected': return <XCircle className="h-4 w-4 mr-2" />;
      default: return <Clock className="h-4 w-4 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-silver-100">
        <Loader2 className="h-8 w-8 animate-spin text-huduma-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-silver-100 pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-huduma-black">My Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Welcome back, {userProfile?.user_metadata?.full_name || 'User'}.
            </p>
          </div>
          <Link href="/#services">
             <button className="bg-huduma-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all mt-4 md:mt-0">
               + New Application
             </button>
          </Link>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          // FIX: This was incorrectly closed with </Link> before. Now fixed to </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"
          >
            <div className="h-16 w-16 bg-silver-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No applications yet</h3>
            <p className="text-gray-500 mb-6">Start your first service application today.</p>
            <Link href="/#services" className="text-blue-600 font-bold hover:underline">
              Browse Services
            </Link>
          </motion.div> 
        ) : (
          <div className="space-y-4">
            {applications.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  {/* Left: Info */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-silver-50 rounded-lg flex items-center justify-center text-huduma-black group-hover:bg-huduma-black group-hover:text-white transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-huduma-black">{app.service_title}</h3>
                      <div className="text-sm text-gray-500 flex items-center gap-3">
                        <span>ID: {app.id.slice(0, 8).toUpperCase()}</span>
                        <span className="hidden md:inline">•</span>
                        <span>{new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Action */}
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className={`flex items-center px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status.replace('_', ' ')}
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}