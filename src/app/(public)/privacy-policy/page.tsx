// FILE: src/app/(public)/privacy-policy/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Phone, Mail, Globe } from 'lucide-react';
import { Container } from '@/components/ui/layout';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      
      {/* 1. Navigation (Sticky Top) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 py-4">
        <Container>
          <div className="flex items-center justify-between">
             <Link 
               href="/" 
               className="text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-2"
             >
               <ArrowLeft className="h-4 w-4" />
               Back to Home
             </Link>
             <span className="text-xs font-mono text-gray-400 uppercase tracking-widest hidden md:block">
               Legal Reference
             </span>
          </div>
        </Container>
      </nav>

      {/* 2. Main Content */}
      <main className="flex-grow pt-32 pb-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            
            {/* Header Section */}
            <header className="mb-12 border-b border-gray-100 pb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-6 border border-blue-100">
                <ShieldCheck className="h-3 w-3" />
                Data Protection Act 2019 Compliant
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black mb-6 uppercase">
                Privacy Policy & Data Protection Statement
              </h1>
              
              {/* Meta Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase">Effective Date</span>
                  <span className="text-black font-medium">29th December 2025</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase">Domain</span>
                  <span className="text-black font-medium">huduma.online</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase">Data Controller</span>
                  <span className="text-black font-medium">huduma.online</span>
                </div>
              </div>
            </header>

            {/* Content Body */}
            <article className="space-y-10 text-base md:text-lg leading-relaxed text-gray-600">
              
              {/* Introduction */}
              <section>
                <p className="mb-6">
                  At <strong>huduma.online</strong>, we value your privacy above all else. This policy outlines how we handle your personal information in strict compliance with the Data Protection Act, 2019 of Kenya.
                </p>
                
                {/* Privacy First Callout */}
                <div className="p-6 bg-gray-900 text-gray-300 rounded-xl shadow-lg">
                  <h4 className="flex items-center gap-2 font-bold text-white text-lg mb-2">
                    <Lock className="h-5 w-5 text-green-400" />
                    Our "Privacy-First" Model
                  </h4>
                  <p className="text-sm md:text-base leading-relaxed">
                    We process your data solely to deliver the service you requested, and we do not retain your private information longer than necessary.
                  </p>
                </div>
              </section>

              {/* 1. Information We Collect */}
              <section>
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">1. Information We Collect</h3>
                <p className="mb-4">We collect information only on a lawful, consent basis.</p>
                <ul className="list-none space-y-4 pl-0">
                  <li className="pl-4 border-l-2 border-gray-200">
                    <strong className="text-black block mb-1">Personal Information</strong>
                    When you submit a form, request a service, or sign up for updates, we may ask for your name, mobile number, email address, physical address, or legal identification (ID/Passport) required to process your request.
                  </li>
                  <li className="pl-4 border-l-2 border-gray-200">
                    <strong className="text-black block mb-1">Professional Details</strong>
                    If you are using our Business Process Outsourcing (BPO) services, we may process professional details provided by you to facilitate recruitment or service delivery.
                  </li>
                  <li className="pl-4 border-l-2 border-gray-200">
                    <strong className="text-black block mb-1">Technical Data</strong>
                    We use cookies and local storage to ensure the security and performance of our website.
                  </li>
                </ul>
              </section>

              {/* 2. How We Use Your Information */}
              <section>
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">2. How We Use Your Information</h3>
                <p className="mb-4">We use your data strictly for the purpose it was collected. We do not sell, rent, or trade your personal information.</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <strong className="text-black block mb-1">Service Delivery</strong>
                    To fulfill the specific task, enquiry, or BPO service you requested via huduma.online.
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <strong className="text-black block mb-1">Communication</strong>
                    To contact you regarding the status of your service.
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg border border-gray-100 md:col-span-2">
                    <strong className="text-black block mb-1">Legal Compliance</strong>
                    To verify identity as required by Kenyan law during the provision of sensitive services.
                  </li>
                </ul>
              </section>

              {/* 3. Data Retention & Deletion */}
              <section>
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">3. Data Retention & Deletion (Our Promise)</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-black shrink-0" />
                    <div>
                      <strong className="text-black">Immediate Deletion:</strong> Once your application is processed and the service is fully delivered, we erase your personal data from our active systems.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-black shrink-0" />
                    <div>
                      <strong className="text-black">Zero Spam:</strong> You will not receive marketing emails, unsolicited texts, or promotional calls from us after your service is complete.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-black shrink-0" />
                    <div>
                      <strong className="text-black">Exceptions:</strong> We retain data only if required by law (e.g., for tax records or legal compliance). In such cases, data is archived securely and is not accessible for general business use.
                    </div>
                  </li>
                </ul>
              </section>

              {/* 4. Cookies */}
              <section>
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">4. Cookies</h3>
                <p>We use cookies to improve your experience (e.g., remembering your session). You can choose to disable cookies in your browser settings, though this may affect how the website functions.</p>
              </section>

              {/* 5. Security Measures */}
              <section>
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">5. Security Measures</h3>
                <p className="mb-4">We employ high-standard security protocols to protect your information while it is in our care.</p>
                <ul className="space-y-2 pl-5 list-disc marker:text-gray-300">
                  <li><strong>Encryption:</strong> huduma.online uses SSL (Secure Socket Layer) technology to encrypt your data during transmission.</li>
                  <li><strong>Internal Security:</strong> Our servers are protected by firewalls. Access to personal data is restricted to authorized personnel of huduma.online.</li>
                </ul>
              </section>

              {/* 6. Your Rights */}
              <section>
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">6. Your Rights (Kenya Data Protection Act)</h3>
                <p className="mb-4">As a user, you have the right to:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="border border-gray-200 p-3 rounded-lg"><strong className="text-black">Access:</strong> Request a copy of the data we hold about you (before it is deleted).</div>
                  <div className="border border-gray-200 p-3 rounded-lg"><strong className="text-black">Rectify:</strong> Correct any errors in your information.</div>
                  <div className="border border-gray-200 p-3 rounded-lg"><strong className="text-black">Erasure:</strong> Request that we delete your data immediately.</div>
                  <div className="border border-gray-200 p-3 rounded-lg"><strong className="text-black">Object:</strong> Oppose the processing of your data for any purpose other than the agreed service.</div>
                </div>
              </section>

              {/* 7. Third-Party Disclosure */}
              <section>
                <h3 className="text-xl font-bold text-black mb-4 uppercase tracking-wide">7. Third-Party Disclosure</h3>
                <p>We do not share your data with third parties, except if required by Kenyan law, a court order, or to protect the rights and safety of huduma.online. We are not affiliated with Alientec Computers.</p>
              </section>

              <div className="border-t border-gray-200 my-10" />

              {/* 8. Contact Us */}
              <section className="bg-neutral-900 text-white p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wide">8. Contact Us</h3>
                <p className="mb-6 text-gray-400">If you have questions regarding this policy or your data privacy, please contact:</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <div>
                      <span className="block text-xs text-gray-500 uppercase font-bold">Data Controller</span>
                      <span className="font-medium">huduma.online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <span className="block text-xs text-gray-500 uppercase font-bold">Phone</span>
                      <a href="tel:0111990661" className="font-medium hover:text-green-400 transition-colors">0111 990 661</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <span className="block text-xs text-gray-500 uppercase font-bold">Email</span>
                      <a href="mailto:chegesammwel@gmail.com" className="font-medium hover:text-green-400 transition-colors">chegesammwel@gmail.com</a>
                    </div>
                  </div>
                </div>
              </section>

            </article>
          </div>
        </Container>
      </main>
      
    </div>
  );
}