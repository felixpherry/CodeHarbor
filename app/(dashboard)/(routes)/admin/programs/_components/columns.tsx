'use client';

import { Button } from '@/components/ui/button';
import { Program } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import moment from 'moment';

export const columns: ColumnDef<Program>[] = [
  {
    header: 'No.',
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
            // onClick={() => {
            //   modals.openConfirmModal({
            //     title: `Delete ${name}?`,
            //     centered: true,
            //     children: (
            //       <Text size='sm'>
            //         Are you sure you want to delete this period? This action can
            //         not be undone
            //       </Text>
            //     ),
            //     labels: {
            //       confirm: 'Delete',
            //       cancel: 'Cancel',
            //     },
            //     confirmProps: { color: 'red' },
            //     onConfirm: confirmDelete,
            //   });
            // }}
            className='text-red-500 cursor-pointer w-5 h-5'
          />
        </div>
      );
    },
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
    accessorKey: 'subtitle',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Subtitle
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Published
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') || false;

      return (
        <Badge className={cn('bg-slate-500', isPublished && 'bg-sky-700')}>
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return (
        <span className='font-bold text-muted-foreground'>
          {moment(row.getValue('createdAt')).format('DD/MM/YYYY')}
        </span>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      return (
        <span className='font-bold text-muted-foreground'>
          {moment(row.getValue('updatedAt')).format('DD/MM/YYYY')}
        </span>
      );
    },
  },
];
