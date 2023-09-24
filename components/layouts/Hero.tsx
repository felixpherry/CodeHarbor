'use client';

import { useEffect, useState } from 'react';

import { SessionInterface } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { CameraIcon, ArrowRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { isBase64DataURL } from '@/lib/utils';
import { uploadImage } from '@/lib/cloudinary';
import { updateHero } from '@/lib/actions/hero.actions';
import { usePathname } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';
import TrialClassForm from '../forms/TrialClassForm';

interface HeroProps {
  session: SessionInterface;
  type: 'view' | 'edit';
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

const Hero = ({ session, type, id, title, subtitle, image }: HeroProps) => {
  const [form, setForm] = useState({
    title: title || '',
    subtitle: subtitle || '',
    image: image || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const pathname = usePathname();

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

  if (session?.user.role !== 'ADMIN' && type === 'edit') {
    return null;
  }

  return (
    <section className='text-center md:text-left px-6 pb-10 md:pb-0 w-full bg-inherit'>
      <div className='grid max-w-screen-xl px-4 py-6 mx-auto lg:gap-8 xl:gap-0 lg:py-8 lg:grid-cols-12'>
        <div className='lg:hidden lg:mt-0 lg:col-span-5 relative'>
          <Image
            src={form.image}
            width={400}
            height={400}
            className='mx-auto'
            priority
            alt='Hero Image'
          />
          {type === 'edit' && (
            <>
              <input
                id='image'
                type='file'
                accept='image/*'
                required
                className='form_image-input'
                onChange={handleChangeImage}
                disabled={isLoading}
              />
              <CameraIcon className='absolute bottom-4 left-[50%]' />
            </>
          )}
        </div>
        <div className='mr-auto place-self-center lg:col-span-7'>
          {type === 'edit' ? (
            <>
              <textarea
                className='hero_title bg-inherit focus:outline-none resize-none w-full'
                name='title'
                value={form.title}
                onChange={handleChange}
                placeholder={title}
                required
              ></textarea>
              <textarea
                className='hero_subtitle bg-inherit focus:outline-none resize-none w-full'
                name='subtitle'
                value={form.subtitle}
                onChange={handleChange}
                placeholder={title}
                required
              ></textarea>
            </>
          ) : (
            <>
              <h1 className='hero_title'>{title}</h1>
              <p className='hero_subtitle'>{subtitle}</p>
              <div className='flex flex-col gap-y-2 lg:flex-row lg:gap-y-0 lg:gap-x-3'>
                {session?.user ? (
                  <Button variant='primary-blue' asChild>
                    <Link
                      href={`/${session.user.role.toLocaleLowerCase()}/dashboard`}
                    >
                      Lihat Dashboard
                      <ArrowRight />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <TrialClassForm />
                    <Button variant='light' asChild>
                      <Link href='/#program'>Lihat Program Kami</Link>
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div className='hidden relative lg:mt-0 lg:col-span-5 lg:flex'>
          <Image
            src={form.image}
            alt='Hero Image'
            width={700}
            height={700}
            priority
          />

          {type === 'edit' && (
            <>
              <input
                id='image'
                type='file'
                accept='image/*'
                required
                className='form_image-input'
                onChange={handleChangeImage}
                disabled={isLoading}
              />
              <CameraIcon className='absolute bottom-12 left-6' />
            </>
          )}
        </div>
      </div>
      {type === 'edit' && (
        <div className='mt-4 w-full flex gap-1 justify-end'>
          <Button
            variant='primary-blue'
            size='sm'
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      )}
    </section>
  );
};

export default Hero;
