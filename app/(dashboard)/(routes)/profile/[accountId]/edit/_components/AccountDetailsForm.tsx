'use client';

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
import { PhoneNumberValidation } from '@/lib/validations/phone-number';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Textarea } from '@mantine/core';
import { Account } from '@prisma/client';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { updateAccount } from '../_actions';
import { usePathname } from 'next/navigation';

const formSchema = z.object({
  email: z.string(),
  name: z.string(),
  username: z.string(),
  phoneNumber: PhoneNumberValidation,
  image: z.string(),
  address: z.string(),
});

interface AccountDetailsFormProps {
  initialData: Account;
}

const AccountDetailsForm = ({ initialData }: AccountDetailsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData.email || '',
      name: initialData.name || '',
      address: initialData.address || '',
      image: initialData.image || '',
      phoneNumber: initialData.phoneNumber || '',
      username: initialData.username || '',
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateAccount({
        id: initialData.id,
        address: values.address,
        phoneNumber: values.phoneNumber,
        username: values.username,
        pathname,
      });

      toast.success('Successfully updated account');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormDescription>
                You can&apos;t change email due to security reasons
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end items-center'>
          <Button size='sm'>
            {isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Save className='h-4 w-4' />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountDetailsForm;
