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
  const [status, setStatus] = useState(searchParams.get('status') || 'active');

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
          <SelectItem value='active' className='flex items-center gap-2'>
            Active
          </SelectItem>
          <SelectItem value='banned' className='flex items-center gap-2'>
            Banned
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
