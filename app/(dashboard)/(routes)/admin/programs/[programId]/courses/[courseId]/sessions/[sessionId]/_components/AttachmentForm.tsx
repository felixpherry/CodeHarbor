'use client';

import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { File, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Attachment, Session } from '@prisma/client';
import FileUpload from '@/components/shared/FileUpload';
import { addAttachment, deleteAttachment } from '@/lib/actions/program.actions';
import { toast } from 'sonner';

interface AttachmentFormProps {
  initialData: {
    attachments: Attachment[];
  } & Session;
}

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: 'Attachment is required',
  }),
});

const AttachmentForm = ({ initialData }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const pathname = usePathname()!;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const filename = values.fileUrl.split('/').pop();
      await addAttachment({
        filename: filename!,
        fileUrl: values.fileUrl,
        fileType: filename?.split('.').pop() || '',
        sessionId: initialData.id,
        pathname,
      });
      toast.success('Successfully added attachment');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAttachment(id, pathname);
      toast.success('Successfully deleted attachment');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course attachments
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && initialData.attachments.length > 0 && (
        <div className='space-y-2'>
          {initialData.attachments.map(({ id, filename, fileUrl }) => (
            <div
              key={id}
              className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
            >
              <File className='h-4 w-4 mr-2 flex-shrink-0' />
              <a
                href={fileUrl}
                target='_blank'
                className='text-xs line-clamp-1'
              >
                {filename}
              </a>
              {deletingId === id ? (
                <div className='ml-auto'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                </div>
              ) : (
                <button
                  onClick={() => handleDelete(id)}
                  className='ml-auto hover:opacity-75 transition'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ fileUrl: url });
              }
            }}
          />
        </div>
      )}
      {!isEditing && initialData.attachments.length === 0 && (
        <p className={cn('text-sm mt-2 text-slate-500 italic')}>
          No attachments yet
        </p>
      )}
    </div>
  );
};

export default AttachmentForm;
