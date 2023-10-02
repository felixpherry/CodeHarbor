'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import type { fileRouter } from '@/app/api/uploadthing/core';
import { useToast } from '../ui/use-toast';

interface FileUploadProps {
  endpoint: keyof fileRouter;
  onChange: (url?: string) => void;
}

const FileUpload = ({ endpoint, onChange }: FileUploadProps) => {
  const { toast } = useToast();
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) => {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }}
    />
  );
};

export default FileUpload;
