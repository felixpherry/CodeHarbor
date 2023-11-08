'use client';

import { GraduationCap, PencilIcon, PlusCircle, X } from 'lucide-react';
import { MappedClass } from '../../_stores/use-create-class-store';
import { Button } from '@/components/ui/button';

interface MappedClassDetailProps {
  mappedClass: MappedClass;
}

const MappedClassDetail = ({ mappedClass }: MappedClassDetailProps) => {
  console.log({ mappedClass });
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-3'>
        <div className='flex justify-between'>
          <h2 className='text-muted-foreground font-medium'>Instructor</h2>
          <PencilIcon className='h-4 w-4' />
        </div>
        <p className='text-primary font-semibold'>
          {mappedClass.instructorSchedule.instructor.account.name}
        </p>
      </div>
      <div className='flex flex-col gap-3'>
        <div className='flex justify-between'>
          <h2 className='text-muted-foreground font-medium'>Students</h2>
          <PlusCircle className='h-4 w-4' />
        </div>

        {mappedClass.studentCourses.map(({ id, student }) => (
          <div
            key={id}
            className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
          >
            <GraduationCap className='h-4 w-4 mr-2 flex-shrink-0' />
            <span className='text-xs line-clamp-1'>{student.account.name}</span>

            <button
              // onClick={() => handleDelete(id)}
              className='ml-auto hover:opacity-75 transition'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
        ))}
      </div>
      <div className='flex w-full items-center gap-3 justify-end'>
        <Button variant='outline' size='sm'>
          Close
        </Button>
        <Button size='sm'>Save</Button>
      </div>
    </div>
  );
};

export default MappedClassDetail;
