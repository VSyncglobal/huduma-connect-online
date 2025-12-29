"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Search, Plus, Edit2, X, Save, Loader2, FileText, 
  ExternalLink, Eye, Trash2, GripVertical, Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// --- INTERFACES ---

interface Application {
  id: string;
  service_title: string;
  applicant_name: string;
  applicant_phone: string;
  applicant_id_number: string;
  status: string;
  created_at: string;
  admin_notes?: string;
  price_paid: number;
  custom_fields?: Record<string, any>; 
  documents?: string[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'file' | 'textarea' | 'select';
  required: boolean;
  helperText?: string;
  options?: string[];
}

interface Service {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  govt_cost: number;   // NEW: Official Government Charge
  service_fee: number; // NEW: Your Platform Fee
  form_fields: FormField[];
}

// --- HELPER COMPONENTS ---

const Tabs = ({ active, setActive }: { active: string, setActive: (t: string) => void }) => (
  <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
    {['orders', 'services'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActive(tab)}
        className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
          active === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const DocumentPreview = ({ url, label }: { url: string, label: string }) => {
  const isImage = url.match(/\.(jpeg|jpg|png|webp)$/i);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 flex justify-between items-center border-b border-gray-100">
        <span className="truncate max-w-[150px]" title={label}>{label}</span>
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
           <ExternalLink className="h-3 w-3" /> Open
        </a>
      </div>
      <div className="h-40 overflow-hidden flex items-center justify-center bg-gray-100 p-2 relative group">
        {isImage ? (
          <img src={url} alt={label} className="max-w-full max-h-full object-contain" />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
             <FileText className="h-10 w-10 mb-2" />
             <span className="text-[10px] uppercase font-bold">Document File</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <a href={url} target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                <Eye className="h-4 w-4" /> View Full
            </a>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Data State
  const [applications, setApplications] = useState<Application[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  // Edit/Modal State
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editingService, setEditingService] = useState<any | null>(null);
  
  // Buffers
  const [noteBuffer, setNoteBuffer] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // AUTH CHECK
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/'); return; }
      
      const allowed = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',');
      if (!session.user.email || !allowed.includes(session.user.email)) {
        toast.error("Access Denied"); 
        router.push('/dashboard'); 
        return;
      }
      setIsAdmin(true);
      fetchData(session.access_token);
    };
    checkAuth();
  }, [activeTab]);

  const fetchData = async (token: string) => {
    setLoading(true);
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
      if (activeTab === 'orders') {
        const res = await fetch('/api/admin/applications', { headers });
        
        // FIX: Check if the response is actually OK before parsing
        if (!res.ok) {
            console.error("Failed to fetch orders:", await res.text());
            setApplications([]); // Fallback to empty
            return;
        }

        const data = await res.json();
        
        // DEBUGGING: This helps check if data is actually arriving
        console.log("Fetched Orders:", data);

        if (Array.isArray(data)) {
            setApplications(data);
        } else {
            console.error("Orders data is not an array", data);
            setApplications([]);
        }
      } else {
        const res = await fetch('/api/admin/services', { headers });
        const data = await res.json();
        if (Array.isArray(data)) setServices(data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // --- ORDER MANAGEMENT ---

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    // Optimistic Update
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    if (selectedApp && selectedApp.id === id) setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);

    try {
      await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ id, status: newStatus })
      });
      toast.success(`Status updated to ${newStatus}`);
    } catch (e) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    setIsUpdating(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    setApplications(prev => prev.map(app => app.id === selectedApp.id ? { ...app, admin_notes: noteBuffer } : app));

    try {
      await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ id: selectedApp.id, status: selectedApp.status, notes: noteBuffer })
      });
      toast.success("Notes saved");
    } catch (e) {
      toast.error("Failed to save notes");
    } finally {
      setIsUpdating(false);
    }
  };

  const openAppDetails = (app: Application) => {
    setSelectedApp(app);
    setNoteBuffer(app.admin_notes || '');
  };

  // --- SERVICE MANAGEMENT & FORM BUILDER ---

  const handleSaveService = async () => {
    setIsUpdating(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const method = editingService.id ? 'PATCH' : 'POST';
    const payload = {
      ...editingService,
      slug: editingService.slug || editingService.title?.toLowerCase().replace(/ /g, '-'),
      form_fields: editingService.form_fields || [],
      // Ensure we send numbers
      govt_cost: Number(editingService.govt_cost) || 0,
      service_fee: Number(editingService.service_fee) || 0
    };

    try {
      await fetch('/api/admin/services', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify(payload)
      });
      toast.success(editingService.id ? "Service Updated" : "Service Created");
      setEditingService(null);
      fetchData(session!.access_token);
    } catch (e) {
      toast.error("Failed to save service");
    } finally {
      setIsUpdating(false);
    }
  };

  // Quick edit for Service Fee (Profit) only
  const handleFeeUpdate = async (service: Service, newFee: number) => {
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, service_fee: newFee } : s));
  };

  const saveQuickFee = async (service: Service) => {
    const { data: { session } } = await supabase.auth.getSession();
    try {
      await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ id: service.id, service_fee: service.service_fee })
      });
      toast.success("Service Fee Updated");
    } catch (e) {
      toast.error("Failed to update fee");
    }
  };

  // Field Manipulation Functions
  const addField = () => {
    setEditingService((prev: any) => ({
      ...prev,
      form_fields: [
        ...(prev.form_fields || []),
        { id: `field_${Date.now()}`, label: 'New Field', type: 'text', required: true }
      ]
    }));
  };

  const removeField = (index: number) => {
    setEditingService((prev: any) => ({
      ...prev,
      form_fields: prev.form_fields.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateField = (index: number, key: string, value: any) => {
    setEditingService((prev: any) => {
      const newFields = [...prev.form_fields];
      newFields[index] = { ...newFields[index], [key]: value };
      if (key === 'label') {
        newFields[index].id = value.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
      }
      return { ...prev, form_fields: newFields };
    });
  };

  // --- RENDER ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (!isAdmin) return <div className="p-10 text-center">Verifying Access...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Command</h1>
            <p className="text-gray-500 text-sm">Manage Orders & Catalog</p>
          </div>
          {activeTab === 'services' && (
            <button 
              onClick={() => setEditingService({ category: 'General', govt_cost: 0, service_fee: 150, form_fields: [] })}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Service
            </button>
          )}
        </div>

        <Tabs active={activeTab} setActive={setActiveTab} />

        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin mx-auto h-8 w-8 text-gray-400" /></div>
        ) : (
          <>
            {/* === ORDERS VIEW === */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[200px]">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Total Paid</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">
                                No orders found.
                            </td>
                        </tr>
                    ) : (
                        applications.map(app => (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-xs font-mono text-gray-500">#{app.id.slice(0,8)}</td>
                            <td className="px-6 py-4 font-medium">{app.service_title}</td>
                            <td className="px-6 py-4 text-sm">{app.applicant_name}<br/><span className="text-gray-400 text-xs">{app.applicant_phone}</span></td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(app.status)}`}>{app.status}</span></td>
                            <td className="px-6 py-4 text-sm font-bold">
                            {/* FIXED: Added safety check (app.price_paid || 0) to prevent crash on null */}
                            {app.price_paid === 0 ? <span className="text-gray-400 text-[10px]">QUOTE PENDING</span> : `KES ${(app.price_paid || 0).toLocaleString()}`}
                            </td>
                            <td className="px-6 py-4 text-right">
                            <button onClick={() => openAppDetails(app)} className="text-blue-600 font-bold text-xs hover:underline">Manage</button>
                            </td>
                        </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* === SERVICES VIEW === */}
            {activeTab === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map(svc => {
                  const total = (svc.govt_cost || 0) + (svc.service_fee || 0);
                  return (
                    <div key={svc.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm group hover:border-black transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{svc.category}</span>
                        <button onClick={() => setEditingService(svc)} className="text-gray-400 hover:text-black transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{svc.title}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{svc.description}</p>
                      
                      <div className="mt-auto border-t border-gray-100 pt-3">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-gray-400">Total Customer Price:</span>
                            <span className="font-bold text-black">KES {total.toLocaleString()}</span>
                        </div>
                        
                        {/* Quick Service Fee Editor */}
                        <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-gray-500">My Fee</span>
                          <div className="flex items-center gap-2">
                             <input 
                              type="number" 
                              value={svc.service_fee}
                              onChange={(e) => handleFeeUpdate(svc, parseInt(e.target.value))}
                              className="w-20 border border-gray-200 rounded px-2 py-1 text-xs font-bold focus:outline-none focus:border-black text-right"
                            />
                            <button 
                              onClick={() => saveQuickFee(svc)}
                              className="text-[10px] bg-black text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-400 text-right mt-1">
                            Govt Cost: KES {svc.govt_cost?.toLocaleString() || 0}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* === SERVICE EDIT MODAL (VISUAL BUILDER) === */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto flex flex-col">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingService.id ? 'Edit Service' : 'New Service'}</h2>
                <button onClick={() => setEditingService(null)}><X className="h-5 w-5" /></button>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Service Title</label>
                  <input className="w-full border p-2 rounded-lg" value={editingService.title || ''} onChange={e => setEditingService({...editingService, title: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Category</label>
                    <input className="w-full border p-2 rounded-lg" value={editingService.category || ''} onChange={e => setEditingService({...editingService, category: e.target.value})} />
                </div>
                
                {/* PRICING SPLIT */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Calculator className="h-4 w-4 text-blue-600" />
                        <h3 className="text-sm font-bold text-blue-900">Price Configuration</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-500">Govt Official Cost</label>
                            <input 
                                type="number" 
                                className="w-full border border-gray-300 p-2 rounded-lg bg-white" 
                                value={editingService.govt_cost || 0} 
                                onChange={e => setEditingService({...editingService, govt_cost: parseInt(e.target.value) || 0})} 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-500">My Service Fee</label>
                            <input 
                                type="number" 
                                className="w-full border border-gray-300 p-2 rounded-lg bg-white font-bold text-black" 
                                value={editingService.service_fee || 0} 
                                onChange={e => setEditingService({...editingService, service_fee: parseInt(e.target.value) || 0})} 
                            />
                        </div>
                         <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Total Customer Price</label>
                            <div className="w-full bg-gray-200 border border-gray-200 p-2 rounded-lg text-gray-500 font-bold">
                                KES {((editingService.govt_cost || 0) + (editingService.service_fee || 0)).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-blue-600 mt-2">
                        * The customer will see the Total Price. The breakdown is shown on details.
                    </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Description</label>
                  <textarea className="w-full border p-2 rounded-lg h-20" value={editingService.description || ''} onChange={e => setEditingService({...editingService, description: e.target.value})} />
                </div>
              </div>

              {/* VISUAL FORM BUILDER */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold uppercase text-gray-700">Requirements & Fields</h3>
                    <button onClick={addField} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center hover:bg-blue-700">
                      <Plus className="h-3 w-3 mr-1" /> Add Field
                    </button>
                 </div>

                 <div className="space-y-3">
                    {editingService.form_fields?.length === 0 && (
                      <div className="text-center text-gray-400 text-sm py-4 italic">No fields defined yet. Click Add Field.</div>
                    )}

                    {editingService.form_fields?.map((field: FormField, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                         <div className="cursor-move text-gray-300"><GripVertical className="h-4 w-4" /></div>
                         
                         {/* Label Edit */}
                         <div className="flex-grow">
                           <input 
                             placeholder="Field Label (e.g. Upload ID)" 
                             className="w-full text-sm font-medium focus:outline-none border-b border-transparent focus:border-blue-500"
                             value={field.label}
                             onChange={(e) => updateField(idx, 'label', e.target.value)}
                           />
                         </div>

                         {/* Type Select */}
                         <select 
                           className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1"
                           value={field.type}
                           onChange={(e) => updateField(idx, 'type', e.target.value)}
                         >
                           <option value="text">Text Input</option>
                           <option value="file">File Upload</option>
                           <option value="date">Date Picker</option>
                           <option value="textarea">Long Text</option>
                           <option value="number">Number</option>
                         </select>

                         {/* Required Toggle */}
                         <button 
                           onClick={() => updateField(idx, 'required', !field.required)}
                           className={`text-xs px-2 py-1 rounded font-bold border ${field.required ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                         >
                           {field.required ? 'Required' : 'Optional'}
                         </button>

                         {/* Delete */}
                         <button onClick={() => removeField(idx)} className="text-gray-400 hover:text-red-500">
                           <Trash2 className="h-4 w-4" />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={handleSaveService} disabled={isUpdating} className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 flex justify-center items-center transition-all">
                  {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save Service Changes'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* === ORDER DETAILS MODAL (SIDEBAR) === */}
      <AnimatePresence>
        {selectedApp && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div><h2 className="text-xl font-bold text-gray-900">{selectedApp.service_title}</h2><p className="text-sm text-gray-500 font-mono">ID: {selectedApp.id}</p></div>
                <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-gray-200 rounded-full"><X className="h-5 w-5 text-gray-500" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${getStatusColor(selectedApp.status)}`}>{selectedApp.status}</span>
                  <div className="flex gap-2">
                    {selectedApp.status !== 'processing' && <button onClick={() => handleUpdateStatus(selectedApp.id, 'processing')} className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700">Mark Processing</button>}
                    {selectedApp.status !== 'completed' && <button onClick={() => handleUpdateStatus(selectedApp.id, 'completed')} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700">Complete</button>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] uppercase font-bold text-gray-400">Name</label><div className="font-medium">{selectedApp.applicant_name}</div></div>
                    <div><label className="text-[10px] uppercase font-bold text-gray-400">Phone</label><div className="font-medium">{selectedApp.applicant_phone}</div></div>
                    <div><label className="text-[10px] uppercase font-bold text-gray-400">ID</label><div className="font-medium">{selectedApp.applicant_id_number}</div></div>
                    {selectedApp.custom_fields && Object.entries(selectedApp.custom_fields).map(([k, v]) => typeof v === 'string' && !v.startsWith('http') && (
                        <div key={k}><label className="text-[10px] uppercase font-bold text-gray-400">{k.replace(/_/g, ' ')}</label><div className="font-medium bg-gray-50 p-1 rounded border border-gray-100">{v}</div></div>
                    ))}
                </div>
                <div>
                   <h3 className="text-xs font-bold uppercase border-b pb-2 mb-4">Attachments</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {selectedApp.documents?.map((url, i) => <DocumentPreview key={`doc-${i}`} url={url} label={`Legacy Doc ${i+1}`} />)}
                      {selectedApp.custom_fields && Object.entries(selectedApp.custom_fields).map(([k, v]) => typeof v === 'string' && v.startsWith('http') && <DocumentPreview key={k} url={v} label={k.replace(/_/g, ' ').replace('file ', '')} />)}
                      {(!selectedApp.documents?.length && !Object.values(selectedApp.custom_fields || {}).some(v => typeof v === 'string' && v.startsWith('http'))) && <div className="text-gray-400 italic">No attachments.</div>}
                   </div>
                </div>
                <div><h3 className="text-xs font-bold uppercase border-b pb-2 mb-4">Internal Notes</h3><textarea className="w-full h-24 p-2 border rounded bg-yellow-50" value={noteBuffer} onChange={(e) => setNoteBuffer(e.target.value)} /></div>
              </div>
              <div className="p-6 border-t bg-gray-50"><button onClick={handleSaveNotes} disabled={isUpdating} className="w-full py-3 bg-black text-white rounded-xl font-bold flex justify-center">{isUpdating ? <Loader2 className="animate-spin" /> : 'Save Changes'}</button></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}