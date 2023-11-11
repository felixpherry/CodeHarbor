'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2 } from 'lucide-react';
import { convertToTitleCase } from '@/lib/utils';
import {
  MappedClass,
  useCreateClassStore,
} from '../../_stores/use-create-class-store';
import { modals } from '@mantine/modals';
import MappedClassForm from './MappedClassForm';

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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const instructorSchedule = useCreateClassStore((state) =>
        state.instructorSchedules.find(
          ({ id }) => id === originalRow.instructorScheduleId
        )
      );
      return instructorSchedule?.instructor.account.name || '-';
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const course = useCreateClassStore((state) =>
        state.courses.find(({ id }) => id === originalRow.courseId)
      );

      return course?.name || '-';
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const instructorSchedule = useCreateClassStore((state) =>
        state.instructorSchedules.find(
          ({ id }) => originalRow.instructorScheduleId === id
        )
      );
      const dayName = convertToTitleCase(instructorSchedule?.day.day || '-');
      const startTime = instructorSchedule?.shift.startTime || '-';
      const endTime = instructorSchedule?.shift.endTime || '-';
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
          title: <h1 className='text-primary text-lg font-bold'>Edit Class</h1>,
          children: (
            <MappedClassForm type='EDIT' initialMappedClass={row.original} />
          ),
          size: 'xl',
        });
      };

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const setMappedClasses = useCreateClassStore(
        (state) => state.setMappedClasses
      );

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const mappedClasses = useCreateClassStore((state) => state.mappedClasses);

      const handleDelete = () => {
        setMappedClasses(
          mappedClasses.filter(({ id }) => row.original.id !== id)
        );
      };

      return (
        <div className='flex items-center gap-3'>
          <PencilIcon
            onClick={handleShowDetail}
            className='h-4 w-4 cursor-pointer text-primary-blue'
          />
          <Trash2
            onClick={handleDelete}
            className='h-4 w-4 cursor-pointer text-red-500'
          />
        </div>
      );
    },
  },
];
