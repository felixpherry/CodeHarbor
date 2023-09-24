'use client';

import { useState } from 'react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { TrialClassValidation } from '@/lib/validations/trial-class';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import DatePicker from '../shared/DatePicker';
import DateTimePicker from '../shared/DateTimePicker';
import { insertTrialClassData } from '@/lib/actions/trial-class.actions';
import { useToast } from '../ui/use-toast';

const TrialClassForm = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof TrialClassValidation>>({
    resolver: zodResolver(TrialClassValidation),
    defaultValues: {
      childName: '',
      dateOfBirth: new Date(),
      birthPlace: '',
      educationInstitution: '',
      gradeClass: '',
      parentName: '',
      email: '',
      phoneNumber: '',
      address: '',
      hobby: '',
      ambition: '',
      trialClassDate: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof TrialClassValidation>) => {
    try {
      setIsLoading(true);
      await insertTrialClassData(values);
      toast({
        description:
          'Pendaftaran berhasil. Mohon untuk menunggu info lebih lanjut dari kami.',
        variant: 'success',
      });
    } catch (error: any) {
      toast({
        description: 'Pendaftaran gagal. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };

  return (
    <>
      <Button variant='primary-blue' onClick={onOpen}>
        Daftar Trial Class
        <ArrowRight />
      </Button>
      <Modal
        size='3xl'
        placement='top-center'
        scrollBehavior='outside'
        shouldBlockScroll={true}
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Daftar Trial Class
              </ModalHeader>
              <ModalBody>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-3 bg-transparent'
                  >
                    <FormField
                      control={form.control}
                      name='childName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Anak</FormLabel>
                          <FormControl>
                            <Input placeholder='' autoFocus {...field} />
                          </FormControl>
                          <FormDescription>
                            Nama lengkap sesuai akta lahir
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='dateOfBirth'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='block mb-1'>
                            Tanggal Lahir Anak
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              setDate={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='birthPlace'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempat Lahir</FormLabel>
                          <FormControl>
                            <Input placeholder='' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='childGender'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Kelamin</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Pilih jenis kelamin anak' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='MALE'>Laki-laki</SelectItem>
                              <SelectItem value='FEMALE'>Perempuan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='educationInstitution'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asal Sekolah</FormLabel>
                          <FormControl>
                            <Input placeholder='' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='gradeClass'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kelas</FormLabel>
                          <FormControl>
                            <Input placeholder='' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='parentName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Orang Tua</FormLabel>
                          <FormControl>
                            <Input placeholder='' {...field} />
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
                          <FormLabel>Alamat</FormLabel>
                          <FormControl>
                            <Textarea placeholder='' {...field} />
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
                          <FormLabel>No. HP</FormLabel>
                          <FormControl>
                            <Input placeholder='' {...field} />
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
                            <Input placeholder='' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='hobby'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hobi</FormLabel>
                          <FormControl>
                            <Input placeholder='' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='ambition'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cita-cita</FormLabel>
                          <FormControl>
                            <Input placeholder='' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='trialClassDate'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='block mb-1'>
                            Pilihan Hari Trial Class
                          </FormLabel>
                          <FormControl>
                            <DateTimePicker
                              date={new Date(field.value)}
                              setDate={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='flex py-3 gap-2 justify-end'>
                      <Button
                        type='button'
                        variant='light'
                        size='sm'
                        onClick={onClose}
                      >
                        Kembali
                      </Button>
                      <Button
                        type='submit'
                        disabled={isLoading}
                        variant='primary-blue'
                        size='sm'
                      >
                        {isLoading && (
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        Simpan
                      </Button>
                    </div>
                  </form>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TrialClassForm;
