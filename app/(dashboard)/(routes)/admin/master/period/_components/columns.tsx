'use client';

import { Period } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import moment from 'moment';
import PeriodForm from './PeriodForm';
import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';
import { deletePeriod } from '../_actions';
import { ConfirmModal } from '@/components/modals/ConfirmModal';

export const columns: ColumnDef<Period>[] = [
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
          className='whitespace-nowrap'
        >
          Period
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='font-bold text-primary'>{row.getValue('name')}</span>
      );
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Start Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { startDate } = row.original;
      return <>{moment(startDate).format('DD-MM-YYYY')}</>;
    },
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          End Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { endDate } = row.original;
      return <>{moment(endDate).format('DD-MM-YYYY')}</>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, name } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname();

      const confirmDelete = async () => {
        try {
          await deletePeriod({
            id,
            pathname,
          });
          toast.success('Successfully deleted period');
        } catch (error: any) {
          toast.error('Failed to delete period');
        }
      };

      return (
        <div className='flex items-center gap-4'>
          <PencilIcon
            onClick={() => {
              modals.open({
                title: (
                  <p className='text-primary font-semibold'>Edit Period</p>
                ),
                children: <PeriodForm type='EDIT' initialData={row.original} />,
                centered: true,
              });
            }}
            className='text-primary-blue cursor-pointer w-5 h-5'
          />
          <ConfirmModal
            title={`Delete ${name}?`}
            description='Are you sure you want to delete this period? This action can
          not be undone'
            onConfirm={confirmDelete}
            variant={{
              confirm: 'destructive',
            }}
          >
            <Trash2 className='text-red-500 cursor-pointer w-5 h-5' />
          </ConfirmModal>
        </div>
      );
    },
  },
];
