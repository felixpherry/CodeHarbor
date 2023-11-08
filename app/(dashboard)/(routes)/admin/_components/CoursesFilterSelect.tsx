'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const CoursesFilterSelect = ({
  courseOptions,
}: {
  courseOptions: {
    text: string;
    value: string;
  }[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [course, setCourse] = useState(searchParams.get('course') || undefined);

  const handleFilter = (newCourse: string) => {
    setCourse(newCourse);
    const params = new URLSearchParams(searchParams);
    !newCourse ? params.delete('course') : params.set('course', newCourse);
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <Select value={course} onValueChange={handleFilter}>
      <SelectTrigger className='col-span-1 focus:outline-none active:outline-none text-slate-500 text-medium font-semibold w-full md:w-56'>
        <SelectValue placeholder='Course' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='' className='font-semibold'>
            All Courses
          </SelectItem>
          {courseOptions.map(({ text, value }) => (
            <SelectItem
              key={value}
              value={value}
              className='flex items-center gap-2'
            >
              {text}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CoursesFilterSelect;
