'use client';

import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import StudentInfoForm, { studentInfoSchema } from './StudentInfoForm';
import ParentInfoForm, { parentInfoSchema } from './ParentInfoForm';
import CourseFormStepper from './CourseFormStepper';
import CourseConfirmationForm from './CourseConfirmationForm';

const steps = ['Data Calon Siswa', 'Data Orang Tua', 'Konfirmasi'];

const CourseRegistrationForm = ({ courseId }: { courseId: string }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [studentInfo, setStudentInfo] = useState<
    z.infer<typeof studentInfoSchema>
  >({
    childName: '',
    birthPlace: '',
    dateOfBirth: new Date(),
    childGender: 'MALE',
    educationInstitution: '',
    gradeClass: '',
  });

  const [parentInfo, setParentInfo] = useState<
    z.infer<typeof parentInfoSchema>
  >({
    address: '',
    email: '',
    parentName: '',
    phoneNumber: '',
  });

  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className='container max-w-7xl py-28'>
      <div className='flex gap-10 flex-col md:flex-row'>
        <CourseFormStepper currentStep={currentStep} steps={steps} />
        <div className='w-full md:w-2/3 p-4'>
          {currentStep === 1 && (
            <StudentInfoForm
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              initialStudentInfo={studentInfo}
              setStudentInfo={setStudentInfo}
            />
          )}{' '}
          {currentStep === 2 && (
            <ParentInfoForm
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              initialParentInfo={parentInfo}
              setParentInfo={setParentInfo}
            />
          )}
          {currentStep === 3 && (
            <CourseConfirmationForm
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              studentInfo={studentInfo}
              parentInfo={parentInfo}
            />
          )}
        </div>
      </div>
      <div className='mt-28 px-20'>
        <button
          onClick={() =>
            setCurrentStep(Math.min(steps.length, currentStep + 1))
          }
        >
          next
        </button>
        <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>
          prev
        </button>
      </div>
      {/* 
        <li className="flex md:w-full items-center text-blue-600 sm:after:content-[''] after:w-full after:h-1 after:border-x-0 after:border-t-0 after:border-gray-100 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10">
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-100">
            <svg
              className='w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
            </svg>
            Personal <span className='hidden sm:inline-flex sm:ml-2'>Info</span>
          </span>
        </li>
        <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10">
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-100">
            <span className='mr-2'>2</span>
            Account <span className='hidden sm:inline-flex sm:ml-2'>Info</span>
          </span>
        </li>
        <li className='flex items-center'>
          <span className='mr-2'>3</span>
          Confirmation
        </li> */}
      {/* </ol> */}
      {/* <Card className='p-5 pt-14 shadow-xl'>
        <CardTitle className='text-center font-bold text-3xl font-josefin mb-20'>
          Daftar Trial Class
        </CardTitle>
        <CardContent>
          
        </CardContent>
      </Card> */}
    </div>
  );
};

export default CourseRegistrationForm;
