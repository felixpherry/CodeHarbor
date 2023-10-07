'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { SessionInterface } from '@/types';
import { Loader2 } from 'lucide-react';
import { createProgram } from '@/lib/actions/program.actions';
import { createClass } from '@/lib/actions/class.actions';
import Combobox from '@/components/ui/combobox';
import { toast } from 'sonner';

interface CreateClassProps {
  session: SessionInterface;
  courseOptions: {
    label: string;
    value: string;
  }[];
  periodOptions: {
    label: string;
    value: string;
  }[];
}

const formSchema = z.object({
  name: z.string().min(1),
  periodId: z.string().min(1),
  courseId: z.string().min(1),
});

const CreateClassForm = ({
  session,
  courseOptions,
  periodOptions,
}: CreateClassProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      periodId: '',
      courseId: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await createClass({
        name: values.name,
        courseId: values.courseId,
        periodId: values.periodId,
      });
      toast.success('Successfully created class.');
      router.push(`/admin/classes/${res.id}`);
    } catch (error: any) {
      toast.success(error.message);
    }
  };
  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div className=''>
        <h1 className='text-2xl font-semibold'>Create Class</h1>
        <p className='text-sm text-slate-600'>
          What would you like to name the class? Class name must be unique
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
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Web Programming'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Class name must be unique</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='courseId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <FormControl>
                    <Combobox
                      options={courseOptions}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='periodId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <Combobox
                      options={periodOptions}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button variant='ghost' asChild>
                <Link href='/admin/classes'>Cancel</Link>
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

export default CreateClassForm;
