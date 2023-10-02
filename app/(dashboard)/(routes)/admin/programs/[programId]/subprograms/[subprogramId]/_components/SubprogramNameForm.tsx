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
import { Subprogram } from '@prisma/client';
import { updateSubprogram } from '@/lib/actions/program.actions';

interface SubprogramNameFormProps {
  initialData: Subprogram;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

const SubprogramNameForm = ({ initialData }: SubprogramNameFormProps) => {
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
      await updateSubprogram({
        id: initialData.id,
        payload: { name: values.name, programId: initialData.programId },
        pathname,
      });
      toast({
        description: 'Successfully updated subprogram',
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
        Name
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Name
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Machine Learning'
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
        <p className='text-sm mt-2'>{initialData.name}</p>
      )}
    </div>
  );
};

export default SubprogramNameForm;
