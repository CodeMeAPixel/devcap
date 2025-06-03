"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';
import { Avatar } from '@/components/ui/Avatar';

interface FileUploadProps {
  userId: string;
  userName: string | null;
  userEmail: string;
  currentImage: string | null;
  onUploadComplete?: (url: string) => void;
}

export function FileUpload({ 
  userId, 
  userName, 
  userEmail, 
  currentImage, 
  onUploadComplete 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    if (!file.type.startsWith('image/')) {
      addToast({
        title: 'Invalid file',
        description: 'Please select an image file.',
        type: 'error'
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.[0]) {
      addToast({
        title: 'No file selected',
        description: 'Please select an image to upload.',
        type: 'error'
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      addToast({
        title: 'Upload successful',
        description: 'Your avatar has been updated.',
        type: 'success'
      });
      
      if (onUploadComplete) {
        onUploadComplete(data.url);
      }

      // Reset the form
      fileInput.value = '';
      setPreviewUrl(null);
    } catch (error) {
      console.error('Upload error:', error);
      addToast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Something went wrong.',
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar
          user={{
            id: userId,
            name: userName,
            email: userEmail,
            image: previewUrl || currentImage
          }}
          size="xl"
        />
        
        <div className="space-y-2">
          <h3 className="font-medium">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">
            Upload a new avatar or let us generate one for you.
          </p>
        </div>
      </div>
      
      <form onSubmit={uploadFile} className="flex gap-4 items-end">
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isUploading || !previewUrl}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </form>
    </div>
  );
}
