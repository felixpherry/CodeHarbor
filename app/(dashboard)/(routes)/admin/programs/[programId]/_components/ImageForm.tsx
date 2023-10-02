'use client';

import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { updateProgram } from '@/lib/actions/program.actions';
import { usePathname } from 'next/navigation';
import { Program } from '@prisma/client';
import Image from 'next/image';
import FileUpload from '@/components/shared/FileUpload';

interface ImageFormProps {
  initialData: Program;
}

const formSchema = z.object({
  image: z.string().min(1, {
    message: 'Image is required',
  }),
});

const ImageForm = ({ initialData }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const { toast } = useToast();

  const pathname = usePathname();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateProgram({
        id: initialData.id,
        payload: { image: values.image },
        pathname,
      });
      toast({
        description: 'Successfully updated program',
        variant: 'success',
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Program Image
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.image && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add an Image
            </>
          )}

          {!isEditing && initialData.image && (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.image ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <ImageIcon className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <Image
              alt='Upload'
              fill
              className='object-cover rounded-md'
              src={initialData.image}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint='programImage'
            onChange={(url) => {
              if (url) {
                onSubmit({ image: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            16:9 ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
