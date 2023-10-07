'use client';

import DatePicker from '@/components/shared/DatePicker';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chip, Select, SelectItem, SelectedItems } from '@nextui-org/react';
import { Skill } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { registerInstructor } from '../_actions';
import { toast } from 'sonner';
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  dateOfBirth: z.date(),
  lastEducation: z.enum(['SMA', 'S1', 'S2', 'S3']),
  educationInstitution: z.string().min(1, {
    message: 'Education institution is required',
  }),
  email: z.string().email(),
  phoneNumber: z.coerce.string().nonempty({
    message: 'Phone number is required',
  }),
  address: z.string().min(1, {
    message: 'Address is required',
  }),
  skills: z.any(),
});

const InstructorRegistrationForm = ({ skills }: { skills: Skill[] }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      dateOfBirth: new Date(),
      educationInstitution: '',
      lastEducation: undefined,
      phoneNumber: '',
      skills: [],
    },
  });
  const pathname = usePathname();
  const router = useRouter();

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await registerInstructor({
        payload: {
          data: {
            address: values.address,
            dateOfBirth: values.dateOfBirth,
            educationInstitution: values.educationInstitution,
            email: values.email,
            lastEducation: values.lastEducation,
            name: values.name,
            phoneNumber: values.phoneNumber,
          },
          skills: Array.from(values.skills),
        },
        pathname,
      });

      form.reset();

      router.push('/');

      toast.success(
        'Succesfully registered. Waiting for admin to process the registration'
      );
    } catch (error: any) {
      toast.error('Failed to register');
    }
  };

  const lastEducations = [
    {
      label: 'SMA',
      value: 'SMA',
    },
    {
      label: 'S1',
      value: 'S1',
    },
    {
      label: 'S2',
      value: 'S2',
    },
    {
      label: 'S3',
      value: 'S3',
    },
  ];

  return (
    <div className='container max-w-xl py-28'>
      <h2 className='text-center font-bold text-3xl font-josefin mb-20'>
        Register as Instructor
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
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
                  <Input type='number' disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dateOfBirth'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} setDate={field.onChange} />
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
                  <Textarea disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastEducation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Education</FormLabel>
                <FormControl>
                  <Select {...field}>
                    {lastEducations.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='educationInstitution'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education Institution</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name='skills'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    label='Skills'
                    selectionMode='multiple'
                    placeholder='Choose'
                    selectedKeys={field.value ?? []}
                    onSelectionChange={field.onChange}
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                    classNames={{
                      base: 'w-full',
                      trigger: 'min-h-unit-12 py-2',
                    }}
                    labelPlacement='outside'
                    renderValue={(items: SelectedItems<string>) => {
                      return (
                        <div className='flex gap-2 overflow-hidden'>
                          {items.map((item) => (
                            <Chip key={item.key}>{item.textValue ?? ''}</Chip>
                          ))}
                        </div>
                      );
                    }}
                  >
                    {skills.map(({ id, name }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit'>
            {isSubmitting && <Loader2 className='animate-spin mr-2 h-4 w-4' />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InstructorRegistrationForm;
