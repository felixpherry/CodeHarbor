'use client';

import * as z from 'zod';
import { studentInfoSchema } from './StudentInfoForm';
import { parentInfoSchema } from './ParentInfoForm';
import { Card, CardContent } from '@/components/ui/card';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface CourseConfirmationFormProps {
  currentStep: number;
  setCurrentStep: (newStep: number) => void;
  studentInfo: z.infer<typeof studentInfoSchema>;
  parentInfo: z.infer<typeof parentInfoSchema>;
}

const CourseConfirmationForm = ({
  currentStep,
  setCurrentStep,
  studentInfo,
  parentInfo,
}: CourseConfirmationFormProps) => {
  const [useCoupon, setUseCoupon] = useState(false);

  const handleStepBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <h2 className='text-3xl font-bold'>Konfirmasi</h2>
      <p className='text-muted-foreground'>
        Periksa kembali semua data sebelum mengonfirmasi
      </p>
      <div className='flex flex-col gap-5 mt-10'>
        <Card className='shadow p-5'>
          <CardContent>
            <h3 className='text-xl font-semibold'>Data Calon Siswa</h3>
            <div className='flex flex-col gap-3 mt-3'>
              <div className='flex justify-between text-primary font-semibold'>
                <span className='text-muted-foreground'>Nama Anak</span>
                <span>{studentInfo.childName}</span>
              </div>
              <div className='flex justify-between text-primary font-semibold'>
                <span className='text-muted-foreground'>Jenis Kelamin</span>
                <span>
                  {studentInfo.childGender === 'MALE'
                    ? 'Laki-laki'
                    : 'Perempuan'}
                </span>
              </div>
              <div className='flex justify-between text-primary font-semibold'>
                <span className='text-muted-foreground'>
                  Tempat, Tanggal Lahir
                </span>
                <span>
                  {studentInfo.birthPlace},{' '}
                  {moment(studentInfo.dateOfBirth).format('DD MMMM YYYY')}
                </span>
              </div>
              <div className='flex justify-between text-primary font-semibold'>
                <span className='text-muted-foreground'>Kelas</span>
                <span>{studentInfo.gradeClass}</span>
              </div>
              <div className='flex justify-between text-primary font-semibold'>
                <span className='text-muted-foreground'>Asal Sekolah</span>
                <span>{studentInfo.educationInstitution}</span>
              </div>
              <p
                onClick={() => setCurrentStep(1)}
                className='underline text-muted-foreground cursor-pointer hover:text-primary-blue font-medium'
              >
                Ubah data
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className='shadow p-5'>
          <CardContent>
            <h3 className='text-xl font-semibold'>Data Orang Tua</h3>
            <div className='flex flex-col gap-3 mt-3'>
              <div className='flex justify-between text-primary font-semibold'>
                <span className='text-muted-foreground'>Nama Orang Tua</span>
                <span>{parentInfo.parentName}</span>
              </div>
              <div className='flex justify-between text-primary font-semibold'>
                <span className='text-muted-foreground'>Email</span>
                <span>{parentInfo.email}</span>
              </div>
              <div className='flex justify-between text-primary font-semibold'>
                <span className='text-muted-foreground'>No. HP</span>
                <span>{parentInfo.phoneNumber}</span>
              </div>
              <div className='flex justify-between text-primary font-semibold'>
                <span className='text-muted-foreground'>Alamat</span>
                <span>{parentInfo.address}</span>
              </div>
              <p
                onClick={() => setCurrentStep(2)}
                className='underline text-muted-foreground cursor-pointer hover:text-primary-blue font-medium'
              >
                Ubah data
              </p>
            </div>
          </CardContent>
        </Card>
        {useCoupon ? (
          <div className='relative'>
            <Input placeholder='Masukkan Kode Kupon' />
            <span className='text-primary-blue absolute right-4 cursor-pointer top-2 underline text-sm'>
              Gunakan Kupon
            </span>
          </div>
        ) : (
          <span
            onClick={() => setUseCoupon(true)}
            className='bg-sky-200/20 text-primary-blue underline w-fit cursor-pointer p-2 rounded-sm font-normal'
          >
            Klik untuk menggunakan kupon
          </span>
        )}

        <div className='flex justify-between'>
          <Button type='button' variant='outline' onClick={handleStepBack}>
            Kembali
          </Button>
          <Button type='submit'>
            {/* {isSubmitting && <Loader2 className='animate-spin mr-2 h-4 w-4' />} */}
            Konfirmasi
          </Button>
        </div>
      </div>
    </>
  );
};

export default CourseConfirmationForm;
