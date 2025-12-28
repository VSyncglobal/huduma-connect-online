import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* This ensures the admin page renders correctly within the app structure */}
      {children}
    </div>
  );
}