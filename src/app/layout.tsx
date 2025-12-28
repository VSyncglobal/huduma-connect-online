import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ShinyFooter } from "@/components/layout/ShinyFooter";

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
        {/* Fixed Header is always present */}
        <Header />
        
        {/* Main Content Area */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Global Footer */}
        <ShinyFooter />
      </body>
    </html>
  );
}