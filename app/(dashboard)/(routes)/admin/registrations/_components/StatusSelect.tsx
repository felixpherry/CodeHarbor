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

const StatusSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [status, setStatus] = useState(searchParams.get('status') || 'pending');

  const handleFilter = (newStatus: string) => {
    setStatus(newStatus);
    const params = new URLSearchParams(searchParams);
    !newStatus ? params.delete('status') : params.set('status', newStatus);
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <Select value={status} onValueChange={handleFilter}>
      <SelectTrigger className='col-span-1 focus:outline-none active:outline-none text-slate-500 text-medium font-semibold w-full md:w-56'>
        <SelectValue placeholder='Status' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='approved' className='flex items-center gap-2'>
            Approved
          </SelectItem>
          <SelectItem value='pending' className='flex items-center gap-2'>
            Pending
          </SelectItem>
          <SelectItem value='rejected' className='flex items-center gap-2'>
            Rejected
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
