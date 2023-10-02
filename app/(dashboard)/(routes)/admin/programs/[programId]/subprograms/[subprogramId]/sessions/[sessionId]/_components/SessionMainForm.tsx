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
import { Session } from '@prisma/client';
import { updateSession } from '@/lib/actions/program.actions';

interface SessionMainFormProps {
  initialData: Session;
}

const formSchema = z.object({
  main: z.string().min(1, {
    message: 'Main is required',
  }),
});

const SessionMainForm = ({ initialData }: SessionMainFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const { toast } = useToast();

  const pathname = usePathname();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateSession({
        id: initialData.id,
        payload: { main: values.main },
        pathname,
      });
      toast({
        description: 'Successfully updated session',
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
        Main
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Main
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
              name='main'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Getting Started'
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
        <p className='text-sm mt-2'>{initialData.main}</p>
      )}
    </div>
  );
};

export default SessionMainForm;
