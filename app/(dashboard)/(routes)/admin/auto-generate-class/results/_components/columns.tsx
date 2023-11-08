'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { convertToTitleCase } from '@/lib/utils';
import { MappedClass } from '../../_stores/use-create-class-store';
import { modals } from '@mantine/modals';
import MappedClassDetail from './MappedClassDetail';

export const columns: ColumnDef<MappedClass>[] = [
  {
    header: 'No',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='font-bold text-primary'>{row.original.name}</span>
      );
    },
  },
  {
    accessorKey: 'instructor',
    accessorFn: (originalRow) => {
      return originalRow.instructorSchedule.instructor.account.name;
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Instructor
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'course',
    accessorFn: (originalRow) => {
      return originalRow.course.name;
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Course
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'instructorSchedule',
    accessorFn: (originalRow) => {
      const dayName = convertToTitleCase(
        originalRow.instructorSchedule.day.day
      );
      const startTime = originalRow.instructorSchedule.shift.startTime;
      const endTime = originalRow.instructorSchedule.shift.endTime;
      return `${dayName}, ${startTime} - ${endTime}`;
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Schedule
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const handleShowDetail = () => {
        modals.open({
          title: (
            <h1 className='text-primary text-lg font-bold'>
              {row.original.name}
            </h1>
          ),
          children: <MappedClassDetail mappedClass={row.original} />,
          size: 'lg',
        });
      };
      return (
        <div className='flex items-center gap-6'>
          <span
            onClick={handleShowDetail}
            className='hover:underline cursor-pointer text-primary-blue'
          >
            Details
          </span>
        </div>
      );
    },
  },
];
