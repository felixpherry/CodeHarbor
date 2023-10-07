'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateLogo } from '@/lib/actions/logo.actions';
import { uploadImage } from '@/lib/cloudinary';
import { isBase64DataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface LogoFormProps {
  id: string;
  image: string;
}

const LogoForm = ({ id, image }: LogoFormProps) => {
  const [form, setForm] = useState({
    id,
    image,
  });

  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';

        setForm((prev) => ({
          ...prev,
          image: imageDataUrl,
        }));
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const blob = form.image;

      const hasImageChanged = isBase64DataURL(blob);

      if (!hasImageChanged) return;

      const imageUrl = await uploadImage(form.image);

      if (imageUrl?.url) {
        form.image = imageUrl.url;
      }

      await updateLogo({
        id: form.id,
        image: form.image,
        pathname,
      });

      toast.success('Successfully updated logo.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = form.image !== image;

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <Image
        src={form.image}
        height={150}
        width={150}
        alt='logo'
        className='object-contain'
      />
      <div className='mt-6 w-full'>
        <Label className='text-slate-700 font-semibold text-lg'>Logo</Label>
        <Input
          type='file'
          accept='image/*'
          placeholder='Upload a photo'
          className='file:text-primary-500 file:cursor-pointer mt-5 text-slate-500'
          onChange={handleImage}
        />
        <Button
          variant='primary-blue'
          size='sm'
          className='mt-6'
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
        >
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Save
        </Button>
      </div>
    </div>
  );
};

export default LogoForm;
