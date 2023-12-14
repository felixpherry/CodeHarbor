'use client';

import { Button } from '@/components/ui/button';
import { CourseRegistration } from '@prisma/client';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createAccountForStudent } from '../_actions';
import { useState } from 'react';

interface CourseRegistrationSuccessProps {
  toastId: string | number;
  payload: CourseRegistration;
}

const CourseRegistrationSuccess = ({
  toastId,
  payload,
}: CourseRegistrationSuccessProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateAccount = async () => {
    try {
      setIsLoading(true);
      const { email, password } = await createAccountForStudent(payload);
      toast.success('Successfully created account');
    } catch (error: any) {
      toast.error('Failed creating account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-3 items-center w-full p-8 bg-white rounded-lg shadow-lg'>
      <h1 className='font-semibold text-base text-center flex items-center gap-2'>
        <CheckCircle2 className='text-green-600 h-5 w-5' />
        Successfully updated the status
      </h1>
      <p>Do you want to create an account for this user?</p>

      <div className='flex justify-end gap-3 w-full'>
        <Button
          onClick={() => toast.dismiss(toastId)}
          size='sm'
          variant='secondary'
          disabled={isLoading}
        >
          No
        </Button>
        <Button onClick={handleCreateAccount} size='sm' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Yes
        </Button>
      </div>
    </div>
  );
};

export default CourseRegistrationSuccess;
