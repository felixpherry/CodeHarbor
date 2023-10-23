'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Period, RegistrationStatus } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  PenSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import moment from 'moment';

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
      const { id, startDate, endDate } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname();

      const confirmStatus = async (status: RegistrationStatus) => {
        try {
        } catch (error: any) {
          toast.error('Failed to update registration status');
        }
      };

      return (
        <div className='flex items-center gap-6'>
          <ConfirmModal
            title='Approve Registration'
            description='Do you want to approve this registration'
            onConfirm={() => confirmStatus('APPROVED')}
          >
            <Trash2 className='text-red-500 cursor-pointer' />
          </ConfirmModal>
          <ConfirmModal
            title='Reject Registration'
            description='Do you want to reject this registration'
            onConfirm={() => confirmStatus('REJECTED')}
          >
            <PenSquare className='text-primary-blue cursor-pointer' />
          </ConfirmModal>
        </div>
      );
    },
  },
];
