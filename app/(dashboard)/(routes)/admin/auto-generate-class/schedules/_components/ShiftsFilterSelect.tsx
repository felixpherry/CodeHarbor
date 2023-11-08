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

const ShiftsFilterSelect = ({
  shiftOptions,
}: {
  shiftOptions: {
    text: string;
    value: string;
  }[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [shift, setShift] = useState(searchParams.get('shift') || undefined);

  const handleFilter = (newShift: string) => {
    setShift(newShift);
    const params = new URLSearchParams(searchParams);
    !newShift ? params.delete('shift') : params.set('shift', newShift);
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <Select value={shift} onValueChange={handleFilter}>
      <SelectTrigger className='col-span-1 focus:outline-none active:outline-none text-slate-500 text-medium font-semibold w-full md:w-56'>
        <SelectValue placeholder='Shift' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='' className='font-semibold'>
            All Shifts
          </SelectItem>
          {shiftOptions.map(({ text, value }) => (
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

export default ShiftsFilterSelect;