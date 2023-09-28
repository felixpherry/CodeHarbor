'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

import Image from 'next/image';
import { isBase64DataURL } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { AccountValidation } from '@/lib/validations/account';
import { uploadImage } from '@/lib/cloudinary';
import { updateProfile } from '@/lib/actions/account.actions';
import { SessionInterface } from '@/types';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface AccountProfileProps {
  account: {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    image: string;
    address: string;
  };
  session: SessionInterface;
}

const AccountProfile = ({ account, session }: AccountProfileProps) => {
  const form = useForm({
    resolver: zodResolver(AccountValidation),
    defaultValues: {
      name: account.name || '',
      username: account.username || '',
      email: account.email || '',
      password: account.password || '',
      phoneNumber: account.phoneNumber || '',
      address: account.address || '',
      image: account.image || '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const router = useRouter();
  const pathname = usePathname();

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';

        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof AccountValidation>) => {
    try {
      setIsLoading(true);
      const blob = values.image;

      const hasImageChanged = isBase64DataURL(blob);

      if (hasImageChanged) {
        const imageUrl = await uploadImage(values.image);

        if (imageUrl?.url) {
          values.image = imageUrl.url;
        }
      }

      await updateProfile({
        id: account.id,
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        address: values.address,
        image: values.image,
        onboarded: true,
        pathname,
      });

      toast({
        description: 'Successfully updated profile.',
        variant: 'success',
      });

      router.push(`/${session.user.role.toLocaleLowerCase()}/dashboard`);
    } catch (error: any) {
      toast({
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col justify-start gap-10'
      >
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile photo'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/avatar-fallback.svg'
                    alt='profile photo'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray'>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Upload a photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Password
              </FormLabel>
              <FormDescription className='text-red-500'>
                Change your password to secure your account!
              </FormDescription>
              <FormControl>
                <PasswordInput
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Address
              </FormLabel>
              <FormControl>
                <Textarea className='account-form_input no-focus' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isLoading} variant='primary-blue'>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Continue
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
