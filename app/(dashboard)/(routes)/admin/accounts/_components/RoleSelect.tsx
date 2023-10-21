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

const RoleSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [role, setRole] = useState(searchParams.get('role') || '');

  const handleFilter = (newRole: string) => {
    setRole(newRole);
    const params = new URLSearchParams(searchParams);
    !newRole ? params.delete('role') : params.set('role', newRole);
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <Select value={role} onValueChange={handleFilter}>
      <SelectTrigger className='col-span-1 focus:outline-none active:outline-none text-slate-500 text-medium font-semibold w-full md:w-56'>
        <SelectValue placeholder='Role' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            value=''
            className='flex items-center gap-2 font-semibold'
          >
            All Roles
          </SelectItem>
          <SelectItem value='admin' className='flex items-center gap-2'>
            Admin
          </SelectItem>
          <SelectItem value='instructor' className='flex items-center gap-2'>
            Instructor
          </SelectItem>
          <SelectItem value='parent' className='flex items-center gap-2'>
            Parent
          </SelectItem>
          <SelectItem value='student' className='flex items-center gap-2'>
            Student
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;
