"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, ChevronRight, X, MessageSquare, ArrowUpRight, Landmark, Car, GraduationCap, Palette, FileText, CreditCard, Laptop } from 'lucide-react';
import { SERVICE_CATEGORIES as STATIC_CATEGORIES, ServiceCategory } from '@/data/services'; 
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Icon Mapping
const ICON_MAP: Record<string, any> = {
  'Government & Official': Landmark, 'Immigration': Landmark, 'Civil Registration': Landmark, 'Business': Landmark, 'KRA': Landmark,
  'NTSA & Transport': Car, 'NTSA': Car,
  'Academic & Professional': GraduationCap, 'Education': GraduationCap,
  'Design & Media': Palette, 'Design': Palette,
  'Admin & Documents': FileText, 'Admin': FileText,
  'Payments & Banking': CreditCard, 'Utilities': CreditCard,
  'Online Training': Laptop, 'Training': Laptop
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>(STATIC_CATEGORIES);

  // FETCH SERVICES FROM DB
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data: dbServices, error } = await supabase
          .from('services')
          .select('*')
          .order('title', { ascending: true });

        if (error || !dbServices) return;

        const grouped: Record<string, ServiceCategory> = {};
        STATIC_CATEGORIES.forEach(cat => { grouped[cat.title] = { ...cat, items: [] }; });

        dbServices.forEach((service: any) => {
          const catName = service.category || 'Other';
          if (!grouped[catName]) {
            grouped[catName] = {
              id: catName.toLowerCase().replace(/ /g, '-'),
              title: catName,
              icon: ICON_MAP[catName] || Landmark,
              description: 'Custom Services',
              items: []
            };
          }
          grouped[catName].items.push({
            id: service.id,
            slug: service.slug,
            category: service.category,
            title: service.title,
            description: service.description,
            price: service.price,
            requirements: service.requirements || [],
            turnaround: service.turnaround || 'Standard',
            formFields: service.form_fields
          });
        });
        setCategories(Object.values(grouped).filter(c => c.items.length > 0));
      } catch (err) { console.error("Failed to load services", err); }
    };
    fetchServices();
  }, []);

  const filteredCategories = searchQuery 
    ? categories.filter(cat => 
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cat.items.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categories;

  return (
    <div className="flex flex-col">
      
      {/* --- NEW HERO SECTION --- */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        
        {/* 1. Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')", // Ensure this file exists in public/images/
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* 2. Dark Overlay (Adjust opacity 0.6 as needed) */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* 3. Left-Aligned Content */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-left"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Digital Services <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                Simplified
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
              Access eCitizen, KRA, NTSA, and professional document services in one secure, automated platform.
            </p>

            {/* Search Bar */}
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="text"
                placeholder="What do you need? (e.g., Passport, KRA, CV)"
                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-black placeholder-gray-500 transition-all text-base"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICE GRID SECTION */}
      <section id="services" className="py-24 px-6 md:px-12 relative z-10 bg-silver-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 border-b border-gray-200 pb-6">
            <h2 className="text-3xl font-bold mb-2 text-huduma-black">Service Catalog</h2>
            <p className="text-gray-500">Select a category to view available services.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredCategories.map((category, index) => (
              <ServiceCard 
                key={category.id} 
                data={category} 
                index={index} 
                onClick={() => setSelectedCategory(category)} 
              />
            ))}
            
            {filteredCategories.length === 0 && (
               <div className="col-span-full text-center py-20 text-gray-400">
                 No services found matching "{searchQuery}". Try a different term.
               </div>
            )}
          </div>

          {/* CUSTOM REQUEST BANNER */}
          <div className="mt-8 bg-black rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <MessageSquare className="text-gray-400 h-6 w-6" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Can't find what you're looking for?</h3>
                </div>
                <p className="text-gray-400 max-w-lg">
                  We handle custom government requests, specialized affidavits, and complex registrations. 
                  Tell us what you need, and we'll get it done.
                </p>
              </div>
              <Link href="/custom-request">
                <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center">
                  Make Custom Request
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* --- SERVICE SELECTION MODAL --- */}
      <AnimatePresence>
        {selectedCategory && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCategory(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto">
                <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                        {React.createElement(selectedCategory.icon, { className: "h-6 w-6 text-black" })}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedCategory.title}</h2>
                        <p className="text-sm text-gray-500">Select a specific service to proceed</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="h-5 w-5 text-gray-400" /></button>
                </div>
                <div className="overflow-y-auto p-6 space-y-3">
                  {selectedCategory.items.map((service, i) => (
                    <Link key={i} href={`/services/${service.slug || service.id}`} className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-black hover:shadow-md transition-all bg-white">
                      <div><h3 className="font-bold text-gray-900 group-hover:text-black mb-1">{service.title}</h3><p className="text-xs text-gray-500">{service.description || `Processing time: ${service.turnaround}`}</p></div>
                      <div className="flex items-center gap-4"><span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-colors">KES {service.price.toLocaleString()}</span><ArrowUpRight className="h-5 w-5 text-gray-300 group-hover:text-black" /></div>
                    </Link>
                  ))}
                  {selectedCategory.items.length === 0 && <div className="text-center py-8 text-gray-400">No services currently available in this category.</div>}
                </div>
                <div className="p-4 bg-gray-50 text-center border-t border-gray-100"><button onClick={() => setSelectedCategory(null)} className="text-sm font-bold text-gray-500 hover:text-black">Cancel</button></div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

// Service Card Component
const ServiceCard = ({ data, index, onClick }: { data: any, index: number, onClick: () => void }) => {
  const Icon = data.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group bg-white p-8 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
    >
      <div className="h-12 w-12 bg-silver-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-huduma-black group-hover:text-white transition-colors duration-300">
        <Icon className="h-6 w-6 text-huduma-black group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-huduma-black">{data.title}</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-grow">{data.description}</p>
      <div className="space-y-2 border-t border-gray-100 pt-4 mb-4">
        {data.items?.slice(0, 3).map((item: any, i: number) => (
          <div key={i} className="flex items-center text-sm text-gray-400"><div className="h-1 w-1 bg-gray-300 rounded-full mr-2"></div>{item.title}</div>
        ))}
        {data.items?.length > 3 && <div className="text-xs text-gray-400 pl-3">+ {data.items.length - 3} more...</div>}
      </div>
      <div className="mt-auto flex items-center text-sm font-bold text-black bg-gray-50 px-4 py-3 rounded-lg group-hover:bg-black group-hover:text-white transition-colors justify-between">Start Application <ChevronRight className="h-4 w-4" /></div>
    </motion.div>
  );
};