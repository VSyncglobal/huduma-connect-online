"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthModal } from '@/store/useAuthModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, Loader2, X, AlertCircle } from 'lucide-react';

export const LoginModal = () => {
  const { isOpen, closeModal, view, openModal } = useAuthModal();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  // Sync internal state with global view request
  useEffect(() => {
    setIsSignUp(view === 'signup');
  }, [view]);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setFormData({ email: '', password: '', fullName: '' });
    }
  }, [isOpen]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // SIGN UP
        const { error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.fullName } }
        });
        if (authError) throw authError;
        alert("Account created! Please check your email.");
        setIsSignUp(false);
      } else {
        // SIGN IN
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (authError) throw authError;
        
        // Success: Close Modal & Refresh Page State
        closeModal();
        window.location.reload(); // Ensures header updates
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100 pointer-events-auto relative">
              
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-huduma-black mb-2">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-gray-500 text-sm">
                  {isSignUp ? "Join Huduma Connect today." : "Access your secure dashboard."}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" required placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                      type="email" required placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                      type="password" required placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full bg-huduma-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center mt-6"
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                    <>{isSignUp ? "Create Account" : "Sign In"} <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-bold text-huduma-black hover:underline focus:outline-none"
                >
                  {isSignUp ? "Already have an account? Sign In" : "New here? Create Account"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};