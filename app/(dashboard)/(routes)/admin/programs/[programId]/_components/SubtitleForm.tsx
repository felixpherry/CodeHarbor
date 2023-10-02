'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { usePathname } from 'next/navigation';
import { Program } from '@prisma/client';
import { updateProgram } from '@/lib/actions/program.actions';

interface SubtitleFormProps {
  initialData: Program;
}

const formSchema = z.object({
  subtitle1: z.string().min(1, {
    message: 'Subtitle 1 is required',
  }),
  subtitle2: z.string().min(1, {
    message: 'Subtitle 2 is required',
  }),
});

const SubtitleForm = ({ initialData }: SubtitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subtitle1: initialData.subtitle1 || '',
      subtitle2: initialData.subtitle2 || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { toast } = useToast();

  const pathname = usePathname();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateProgram({
        id: initialData.id,
        payload: { subtitle1: values.subtitle1, subtitle2: values.subtitle2 },
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
        Subtitle
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Subtitle
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='subtitle1'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='For Age 13-16'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='subtitle2'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='MiT Inventor App'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                {isSubmitting && (
                  <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <>
          <p className='text-sm mt-2'>{initialData.subtitle1}</p>
          <p className='text-sm mt-2'>{initialData.subtitle2}</p>
        </>
      )}
    </div>
  );
};

export default SubtitleForm;
