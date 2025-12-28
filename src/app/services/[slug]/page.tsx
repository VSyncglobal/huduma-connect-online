"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthModal } from '@/store/useAuthModal';
import { 
  ArrowLeft, CheckCircle2, User, 
  Loader2, CreditCard, UploadCloud, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SERVICE_CATEGORIES } from '@/data/services'; // Fallback only
import toast from 'react-hot-toast'; // IMPORT TOAST

// Define the shape of our Service data
interface ServiceItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  price: number;
  requirements: string[];
  formFields: any[]; // Mapped from DB 'form_fields'
}

export default function ServiceApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const { openModal } = useAuthModal();
  
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State - Added idNumber here/page.tsx]
  const [applicantBasic, setApplicantBasic] = useState({
    fullName: '', 
    phoneNumber: '', 
    email: '',
    idNumber: '' // <--- ADDED: Required by Database
  });
  const [customData, setCustomData] = useState<Record<string, any>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // 1. FETCH SERVICE FROM DB (With Static Fallback)
  useEffect(() => {
    const fetchServiceData = async () => {
      if (!params.slug) return;
      const slug = params.slug as string;

      try {
        // A. Try Database First
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .single();

        if (data) {
          setService({
            ...data,
            formFields: data.form_fields || []
          });
        } else {
          // B. Fallback to Static File (Legacy support)
          let found: any = null;
          for (const cat of SERVICE_CATEGORIES) {
            const item = cat.items.find((s: any) => (s.slug || s.id) === slug);
            if (item) found = item;
          }
          
          if (found) {
             setService({
               ...found,
               formFields: found.formFields || []
             });
          } else {
            toast.error("Service not found");
            router.push('/');
          }
        }
      } catch (err) {
        console.error("Service Load Error:", err);
      } finally {
        setLoadingService(false);
      }
    };

    fetchServiceData();
  }, [params.slug, router]);

  // 2. Auto-fill User Data
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setApplicantBasic(prev => ({ 
          ...prev, 
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || ''
        }));
      }
    });
  }, []);

  const handleCustomInput = (id: string, value: string) => {
    setCustomData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = async (fieldId: string, file: File) => {
    setUploadingField(fieldId);
    const toastId = toast.loading("Uploading document...");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${fieldId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage.from('application-uploads').upload(filePath, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('application-uploads').getPublicUrl(filePath);
      setCustomData(prev => ({ ...prev, [fieldId]: publicUrl }));
      toast.success("Attached successfully", { id: toastId });

    } catch (err: any) {
      toast.error(`Upload Error: ${err.message}`, { id: toastId });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { 
      toast.error("Please login to continue");
      openModal('signin'); 
      return; 
    }

    // Validation
    if (!applicantBasic.phoneNumber) { toast.error("Phone number is required."); return; }
    if (!applicantBasic.idNumber) { toast.error("ID Number is required."); return; } // <--- Added Check
    
    // Validate Required Dynamic Fields
    for (const field of service?.formFields || []) {
      if (field.required && !customData[field.id]) {
        toast.error(`Please complete: ${field.label}`);
        return;
      }
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Processing Application...");

    try {
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          serviceId: service?.id,
          serviceTitle: service?.title,
          price: service?.price,
          applicantData: {
            ...applicantBasic, // Now includes idNumber
            customFields: customData
          },
          userId: session.user.id, 
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      // SUCCESS!
      toast.success(`Application Sent! Check phone (${applicantBasic.phoneNumber}) for PIN.`, { id: toastId, duration: 5000 });
      
      // REDIRECT TO DASHBOARD
      router.push('/dashboard');

    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingService) return (
    <div className="h-screen flex items-center justify-center bg-silver-100">
      <Loader2 className="h-8 w-8 animate-spin text-huduma-black" />
    </div>
  );

  if (!service) return null;

  return (
    <div className="min-h-screen bg-silver-100 pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/#services" className="inline-flex items-center text-gray-500 hover:text-black mb-8 transition-colors text-sm font-bold">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Info */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-2 block">{service.category}</span>
              <h1 className="text-3xl font-bold text-huduma-black mb-4">{service.title}</h1>
              <p className="text-gray-500 mb-6">{service.description}</p>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2 text-sm uppercase">Requirements</h3>
                <ul className="space-y-1">
                  {service.requirements?.map((req, i) => (
                    <li key={i} className="flex items-center text-sm text-blue-800">
                      <CheckCircle2 className="h-4 w-4 mr-2" /> {req}
                    </li>
                  ))}
                  {(!service.requirements || service.requirements.length === 0) && (
                    <li className="text-sm text-blue-800 italic">No specific requirements listed.</li>
                  )}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-6">
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-huduma-black text-white p-8 rounded-2xl shadow-2xl">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <User className="mr-2 h-5 w-5" /> Applicant Details
              </h3>

              <div className="space-y-5">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold">Full Name</label>
                    <input 
                      type="text" value={applicantBasic.fullName}
                      onChange={(e) => setApplicantBasic({...applicantBasic, fullName: e.target.value})}
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:bg-white/20 text-sm"
                    />
                  </div>
                  
                  {/* Two Column Row for ID and Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold">ID Number <span className="text-red-400">*</span></label>
                      <input 
                        type="text" value={applicantBasic.idNumber}
                        onChange={(e) => setApplicantBasic({...applicantBasic, idNumber: e.target.value})}
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:bg-white/20 text-sm"
                        placeholder="Required"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-bold">M-Pesa Number <span className="text-red-400">*</span></label>
                      <input 
                        type="tel" value={applicantBasic.phoneNumber} placeholder="07XX..."
                        onChange={(e) => setApplicantBasic({...applicantBasic, phoneNumber: e.target.value})}
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:bg-white/20 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 my-4" />

                {/* DYNAMIC FIELDS ENGINE */}
                {service.formFields?.map((field: any) => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold flex justify-between">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    
                    {field.type === 'file' ? (
                      <div className="relative">
                        <input 
                          type="file" id={field.id} className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(field.id, e.target.files[0])}
                        />
                        <label 
                          htmlFor={field.id}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${customData[field.id] ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400'}`}
                        >
                          <span className="text-sm">
                            {uploadingField === field.id ? 'Uploading...' : customData[field.id] ? 'File Attached' : 'Tap to Upload'}
                          </span>
                          {uploadingField === field.id ? <Loader2 className="h-4 w-4 animate-spin" /> : customData[field.id] ? <Check className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
                        </label>
                      </div>
                    ) : field.type === 'select' ? (
                       <select
                        value={customData[field.id] || ''}
                        onChange={(e) => handleCustomInput(field.id, e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none bg-transparent"
                       >
                         <option value="" className="text-black">Select Option...</option>
                         {field.options?.map((opt: string) => <option key={opt} value={opt} className="text-black">{opt}</option>)}
                       </select>
                    ) : (
                      <input 
                        type={field.type} 
                        value={customData[field.id] || ''}
                        onChange={(e) => handleCustomInput(field.id, e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    )}
                    {field.helperText && <p className="text-[10px] text-gray-500">{field.helperText}</p>}
                  </div>
                ))}
                
                {(!service.formFields || service.formFields.length === 0) && (
                   <p className="text-sm text-gray-400 italic">No additional details required for this service.</p>
                )}

                <button 
                  onClick={handleSubmit} disabled={isSubmitting}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl mt-6 hover:bg-gray-200 transition-all flex items-center justify-center"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (
                    <>
                       <CreditCard className="mr-2 h-5 w-5" />
                       Pay KES {(service.price + 150).toLocaleString()}
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