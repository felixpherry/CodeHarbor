'use client';

import { Account, Course, Student, StudentCourse } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CreateClassStudentsTable = {
  course: Course;
  student: {
    account: Account;
  } & Student;
} & StudentCourse;

export const columns: ColumnDef<CreateClassStudentsTable>[] = [
  {
    header: 'No',
  },
  {
    accessorKey: 'student',
    accessorFn: (originalRow) => {
      return originalRow.student.account.name;
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='font-bold text-primary'>
          {row.original.student.account.name}
        </span>
      );
    },
  },
  {
    accessorKey: 'course.name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Course
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
];
