'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { SessionInterface } from '@/types';
import { Loader2 } from 'lucide-react';
import { createProgram } from '@/lib/actions/program.actions';

interface CreateProgramFormProps {
  session: SessionInterface;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Program name is required',
  }),
});

const CreateProgramForm = ({ session }: CreateProgramFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await createProgram({
        name: values.name,
        accountId: session.user.id,
      });
      toast({
        description: 'Successfully created program.',
        variant: 'success',
      });
      router.push(`/admin/programs/${res.id}`);
    } catch (error: any) {
      toast({
        description: 'Failed to create program',
        variant: 'destructive',
      });
    }
  };
  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div className=''>
        <h1 className='text-2xl font-semibold'>Create Program</h1>
        <p className='text-sm text-slate-600'>
          What would you like to name the program? Program name can be changed
          later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 mt-8'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Web Programming'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button variant='ghost' asChild>
                <Link href='/admin/programs'>Cancel</Link>
              </Button>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                {isSubmitting && (
                  <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                )}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProgramForm;
