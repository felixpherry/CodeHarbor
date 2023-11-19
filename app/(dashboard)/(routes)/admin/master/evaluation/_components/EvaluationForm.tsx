import { ColorInput, Input, NumberInput, Textarea } from '@mantine/core';
import { MasterEvaluation } from '@prisma/client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { modals } from '@mantine/modals';
import { addNewEvaluation, updateEvaluation } from '../_actions';

interface EvaluationFormProps {
  type: 'ADD' | 'EDIT';
  initialData?: MasterEvaluation;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Evaluation name is required',
  }),
  weight: z
    .number()
    .min(0, {
      message: 'Minimum weight must be greater than or equal to zero',
    })
    .max(100, {
      message: 'Maximum weight must be less than or equal to 100',
    }),
});

const EvaluationForm = ({ type, initialData }: EvaluationFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      weight: initialData?.weight,
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    try {
      if (type === 'ADD') {
        await addNewEvaluation({
          payload: values,
          pathname,
        });
      } else {
        await updateEvaluation({
          id: initialData?.id!,
          payload: values,
          pathname,
        });
      }

      toast.success(
        `Successfully ${type === 'ADD' ? 'added' : 'updated'} evaluation`
      );

      modals.closeAll();
    } catch (error: any) {
      toast.error(`Failed to ${type === 'ADD' ? 'add' : 'update'} evaluation`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evaluation Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='weight'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <NumberInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='pt-3 w-full flex justify-end'>
          <Button disabled={isSubmitting} type='submit' size='sm'>
            {isSubmitting ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Save className='mr-2 h-4 w-4' />
            )}{' '}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EvaluationForm;
