'use client';

import { SessionInterface } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { usePathname } from 'next/navigation';
import { uploadImage } from '@/lib/cloudinary';
import { isBase64DataURL } from '@/lib/utils';
import { updateHero } from '@/lib/actions/hero.actions';

interface HeroProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  session: SessionInterface;
}

const HeroForm = ({ id, title, subtitle, image, session }: HeroProps) => {
  const [form, setForm] = useState({
    title: title || '',
    subtitle: subtitle || '',
    image: image || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const { toast } = useToast();

  useEffect(() => {
    handleTextareaResize();
    window.addEventListener('resize', handleTextareaResize);

    return () => {
      window.removeEventListener('resize', handleTextareaResize);
    };
  }, []);

  const handleTextareaResize = () => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes('image')) {
      return toast({
        description: 'Hanya dapat mengunggah file gambar',
        variant: 'destructive',
      });
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;
      setForm((prev) => ({
        ...prev,
        image: result,
      }));
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let updatedHero = {
        ...form,
      };

      const isUploadingNewImage = isBase64DataURL(form.image);

      if (isUploadingNewImage) {
        const imageUrl = await uploadImage(form.image);

        if (imageUrl?.url) {
          updatedHero = {
            ...updatedHero,
            image: imageUrl.url,
          };
        }
      }
      await updateHero(
        {
          id,
          ...updatedHero,
        },
        pathname
      );
      toast({ description: 'Successfully updated hero.', variant: 'success' });
    } catch (error: any) {
      toast({
        description: 'Failed to update hero. Try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValid =
    form.title !== '' &&
    form.subtitle !== '' &&
    form.image !== '' &&
    (form.title !== title ||
      form.subtitle !== subtitle ||
      form.image !== image);

  if (session?.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className='flex flex-col text-center lg:flex-row-reverse lg:text-left bg-white'>
      <div className='absolute top-[100px] lg:top-[unset] 2xl:h-[700px] 2xl:w-[700px] lg:h-[600px] lg:w-[600px] h-[40vh] right-5 w-[40vh] hero_animation rounded-[50%] lg:right-8 2xl:right-14'></div>
      <div className='lg:w-[40%] flex lg:min-h-screen items-center justify-end pt-[70px] lg:pt-[0] z-10 relative'>
        <Image
          src={form.image}
          width={400}
          height={400}
          alt='hero image'
          className='object-contain lg:max-w-[90%] w-[90%] 2xl:max-w-[85%] h-[auto] z-[10]'
        />
        <label htmlFor='image'>
          <Camera className='absolute bottom-1/4 lg:bottom-1/3 left-[18%] lg:left-0 z-50 cursor-pointer' />
        </label>

        <input
          id='image'
          type='file'
          accept='image/*'
          required
          className='hidden'
          onChange={handleChangeImage}
          disabled={isLoading}
        />
      </div>
      <div className='lg:w-[60%] flex flex-col gap-5 lg:pt-20 lg:pl-12'>
        <textarea
          className='text-[#000000c7] text-[30px] w-full lg:text-[56px] font-[600] font-josefin lg:leading-[75px] 2xl:w-[60%] lg:w-[78%] px-3 py-2 focus:outline-none resize-none'
          name='title'
          value={form.title}
          onChange={handleChange}
          disabled={isLoading}
          required
        ></textarea>
        <textarea
          className='text-[#000000ac] font-josefin font-[600] text-[18px] 2xl:!w-[55%] lg:!w-[78%] focus:outline-none resize-none'
          name='subtitle'
          value={form.subtitle}
          onChange={handleChange}
          disabled={isLoading}
          required
        ></textarea>
        <Button
          variant='primary-blue'
          size='sm'
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className='w-fit ml-auto mr-5 mb-10 lg:m-0'
        >
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default HeroForm;
