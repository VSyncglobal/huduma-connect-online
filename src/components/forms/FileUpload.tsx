"use client";

import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadCloud, X, FileText, CheckCircle2, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  bucketName?: string;
}

export const FileUpload = ({ onUploadComplete, bucketName = 'application-uploads' }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const files = Array.from(e.target.files);
    const newUrls: string[] = [];

    try {
      for (const file of files) {
        // 1. Create unique path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // 2. Upload
        const { error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (error) throw error;

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      const updatedList = [...uploadedFiles, ...newUrls];
      setUploadedFiles(updatedList);
      onUploadComplete(updatedList);

    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (urlToRemove: string) => {
    const updated = uploadedFiles.filter(url => url !== urlToRemove);
    setUploadedFiles(updated);
    onUploadComplete(updated);
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group
          ${isUploading ? 'bg-gray-50 border-gray-300' : 'border-gray-200 hover:bg-blue-50 hover:border-blue-300'}
        `}
      >
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileSelect}
          accept="image/*,.pdf"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
            <p className="text-sm text-gray-500 font-medium">Uploading documents...</p>
          </div>
        ) : (
          <>
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="font-bold text-gray-900">Click to upload documents</p>
            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
          </>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((url, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center overflow-hidden">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate max-w-[200px]">
                  Document {index + 1}
                </span>
              </div>
              <button 
                onClick={() => removeFile(url)}
                className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};