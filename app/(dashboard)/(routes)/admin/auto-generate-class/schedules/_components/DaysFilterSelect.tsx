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

const DaysFilterSelect = ({
  dayOptions,
}: {
  dayOptions: {
    text: string;
    value: string;
  }[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [day, setDay] = useState(searchParams.get('day') || undefined);

  const handleFilter = (newDay: string) => {
    setDay(newDay);
    const params = new URLSearchParams(searchParams);
    !newDay ? params.delete('day') : params.set('day', newDay);
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <Select value={day} onValueChange={handleFilter}>
      <SelectTrigger className='col-span-1 focus:outline-none active:outline-none text-slate-500 text-medium font-semibold w-full md:w-56'>
        <SelectValue placeholder='Day' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='' className='font-semibold'>
            All Days
          </SelectItem>
          {dayOptions.map(({ text, value }) => (
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

export default DaysFilterSelect;
