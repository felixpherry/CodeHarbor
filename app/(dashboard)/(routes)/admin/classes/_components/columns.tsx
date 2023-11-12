'use client';

import { Button } from '@/components/ui/button';
import { Class, Course, Period, Program } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  PencilIcon,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type ClassTableInterface = {
  _count: {
    studentCourses: number;
  };
  course: Course;
  period: Period;
} & Class;

export const columns: ColumnDef<ClassTableInterface>[] = [
  {
    header: 'No.',
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
  },
  {
    accessorKey: 'course.name',
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
    accessorKey: 'period.name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Period
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <Badge>{row.original.period.name}</Badge>;
    },
  },
  {
    accessorKey: '_count.studentCourses',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Students
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <Badge>{row.original._count.studentCourses}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, name } = row.original;

      // const confirmDelete = async () => {
      //   try {
      //     await deletePeriod({
      //       id,
      //       pathname,
      //     });
      //     toast.success('Successfully deleted period');
      //   } catch (error: any) {
      //     toast.error('Failed to delete period');
      //   }
      // };

      return (
        <div className='flex items-center gap-4'>
          <Link href={`/admin/programs/${id}`}>
            <PencilIcon className='text-primary-blue cursor-pointer w-5 h-5' />
          </Link>
          <Trash2
            onClick={() => {
              // modals.openConfirmModal({
              //   title: `Delete ${name}?`,
              //   centered: true,
              //   children: (
              //     <Text size='sm'>
              //       Are you sure you want to delete this period? This action can
              //       not be undone
              //     </Text>
              //   ),
              //   labels: {
              //     confirm: 'Delete',
              //     cancel: 'Cancel',
              //   },
              //   confirmProps: { color: 'red' },
              //   onConfirm: confirmDelete,
              // });
            }}
            className='text-red-500 cursor-pointer w-5 h-5'
          />
        </div>
      );
    },
  },
];
