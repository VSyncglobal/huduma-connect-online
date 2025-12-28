import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ShinyFooter } from "@/components/layout/ShinyFooter";
import { LoginModal } from "@/components/auth/LoginModal"; // <--- FIXED: Points to your existing file
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Huduma Connect | Online Cyber Services Kenya",
  description: "Secure, automated processing for eCitizen, KRA, NTSA, and professional document services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-silver-100 text-huduma-charcoal antialiased selection:bg-gray-300`}>
        {/* Toast Notifications Configuration */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '16px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: 'black' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: 'black' },
            },
          }}
        />

        {/* Global Modal */}
        <LoginModal /> 
        
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <ShinyFooter />
      </body>
    </html>
  );
}