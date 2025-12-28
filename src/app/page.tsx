"use client";

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, ArrowRight, ChevronRight } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/data/services';

export default function Home() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);
  
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic for the search bar
  const filteredCategories = searchQuery 
    ? SERVICE_CATEGORIES.filter(cat => 
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cat.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : SERVICE_CATEGORIES;

  return (
    <div className="flex flex-col">
      
      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex flex-col justify-center items-center px-6 pt-20 overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="text-center max-w-4xl z-10"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-huduma-black"
          >
            Digital Services. <br />
            <span className="text-gray-400">Simplified.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto"
          >
            Access eCitizen, KRA, NTSA, and professional document services in one secure platform.
          </motion.p>

          {/* SEARCH COMPONENT */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative max-w-xl mx-auto w-full"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text"
              placeholder="What do you need? (e.g., Passport, KRA Returns, CV)"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-black/5 focus:border-gray-400 outline-none transition-all text-base"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </motion.div>
        </motion.div>

        {/* AMBIENT BACKGROUND ELEMENTS */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl opacity-60 mix-blend-overlay" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gray-200 rounded-full blur-3xl opacity-30" />
        </div>
      </section>

      {/* SERVICE GRID SECTION */}
      <section id="services" className="py-24 px-6 md:px-12 relative z-10 bg-silver-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 border-b border-gray-200 pb-6">
            <h2 className="text-3xl font-bold mb-2 text-huduma-black">Service Catalog</h2>
            <p className="text-gray-500">Select a category to begin your application.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, index) => (
              <ServiceCard key={category.id} data={category} index={index} />
            ))}
            
            {filteredCategories.length === 0 && (
               <div className="col-span-full text-center py-20 text-gray-400">
                 No services found matching "{searchQuery}". Try a different term.
               </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// Internal Component: Service Card
const ServiceCard = ({ data, index }: { data: any, index: number }) => {
  const Icon = data.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-white p-8 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
    >
      <div className="h-12 w-12 bg-silver-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-huduma-black group-hover:text-white transition-colors duration-300">
        <Icon className="h-6 w-6 text-huduma-black group-hover:text-white transition-colors" />
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-huduma-black">{data.title}</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-grow">
        {data.description}
      </p>

      <div className="space-y-2 border-t border-gray-100 pt-4">
        {data.services.slice(0, 3).map((svc: string, i: number) => (
          <div key={i} className="flex items-center text-sm text-gray-600">
            <ChevronRight className="h-3 w-3 mr-2 text-gray-300" />
            {svc}
          </div>
        ))}
        {data.services.length > 3 && (
          <div className="text-xs text-gray-400 pl-5 pt-1">
            + {data.services.length - 3} more services
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center text-sm font-semibold text-huduma-black opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
        Start Application <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    </motion.div>
  );
};