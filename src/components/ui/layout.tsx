import React from 'react';

// Standardized Container to prevent content from stretching too wide
export const Container = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  return (
    <div className={`max-w-7xl mx-auto px-6 md:px-12 w-full ${className}`}>
      {children}
    </div>
  );
};

// Standardized Section wrapper for vertical spacing
export const Section = ({ 
  children, 
  className = "",
  id = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
  id?: string;
}) => {
  return (
    <section id={id} className={`py-12 md:py-24 w-full ${className}`}>
      {children}
    </section>
  );
};