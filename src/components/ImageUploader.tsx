// src/components/ImageUploader.tsx
import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploaderProps {
  folder: string;
  onUploadComplete: (url: string) => void;
  onProgress?: (progress: number) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  folder, 
  onUploadComplete,
  onProgress 
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = (file: File) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    const extension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;
    const storageRef = ref(storage, `${folder}/${filename}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot: any) => {
        const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressValue);
        if (onProgress) onProgress(progressValue);
      },
      (error: Error) => {
        setError(error.message);
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(downloadURL);
          setUploading(false);
        } catch (err) {
          setError('Failed to get download URL');
          setUploading(false);
        }
      }
    );
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="file-input"
      />
      
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            {Math.round(progress)}%
          </div>
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ImageUploader;