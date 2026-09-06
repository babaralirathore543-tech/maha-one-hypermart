// src/components/common/CloudinaryUpload.tsx
import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaTimes } from 'react-icons/fa';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  onUploadStart?: () => void;
  buttonText?: string;
  folder?: string;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

const CloudinaryUpload = ({
  onUploadSuccess,
  onUploadError,
  onUploadStart,
  buttonText = 'Upload Image',
  folder = 'maha-one/products',
  multiple = false,
  maxFiles = 5,
  accept = 'image/*',
  className = ''
}: CloudinaryUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);
    onUploadStart?.();

    const uploaded: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', folder);

      try {
        const xhr = new XMLHttpRequest();
        
        const uploadPromise = new Promise((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setProgress(percent);
            }
          });

          xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(response.secure_url);
            } else {
              const error = JSON.parse(xhr.responseText);
              reject(error.error?.message || 'Upload failed');
            }
          };

          xhr.onerror = () => {
            reject('Network error. Please try again.');
          };

          xhr.send(formData);
        });

        const url = await uploadPromise as string;
        uploaded.push(url);
        setUploadedUrls(prev => [...prev, url]);
        
        console.log(`✅ Cloudinary upload success (${i + 1}/${files.length}):`, url);

      } catch (error: any) {
        console.error('❌ Cloudinary upload error:', error);
        onUploadError?.(error.message || 'Upload failed');
        break;
      }
    }

    setUploading(false);
    setProgress(0);

    if (uploaded.length > 0) {
      const result = multiple ? JSON.stringify(uploaded) : uploaded[0];
      console.log('🔵 Calling onUploadSuccess with:', result);
      onUploadSuccess(result);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          id="cloudinary-upload"
          accept={accept}
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
          multiple={multiple}
        />
        
        <label
          htmlFor="cloudinary-upload"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 ${
            uploading
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-[#0F766E] hover:bg-[#065F46] text-white hover:shadow-lg'
          }`}
        >
          {uploading ? (
            <>
              <FaSpinner className="animate-spin" />
              {progress}% Uploading...
            </>
          ) : (
            <>
              <FaCloudUploadAlt />
              {buttonText}
            </>
          )}
        </label>

        {uploading && (
          <div className="mt-2 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {uploadedUrls.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {uploadedUrls.length} image{uploadedUrls.length > 1 ? 's' : ''} uploaded
          </p>
          <div className="flex flex-wrap gap-2">
            {uploadedUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-[#D4AF37] shadow-sm"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition shadow-md opacity-0 group-hover:opacity-100"
                >
                  <FaTimes className="text-xs" />
                </button>
                <FaCheckCircle className="absolute -bottom-1 -right-1 text-green-500 text-sm bg-white rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;