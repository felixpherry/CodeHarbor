'use client';

import { MasterShift } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { IconCheck, IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { Switch, Text, rem, useMantineTheme } from '@mantine/core';
import { Badge } from '@/components/ui/badge';
import { changeShiftStatus, deleteShift } from '../_actions';
import ShiftForm from './ShiftForm';
import { useOptimistic } from 'react';
import { ConfirmModal } from '@/components/modals/ConfirmModal';

export const columns: ColumnDef<MasterShift>[] = [
  {
    header: 'No',
  },
  {
    accessorKey: 'startTime',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Start Time
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'endTime',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          End Time
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    cell: ({ row }) => {
      const isActive: boolean = row.getValue('isActive');

      return (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, isActive } = row.original;
      const [optimisticStatus, setOptimisticStatus] =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useOptimistic<boolean>(isActive);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const theme = useMantineTheme();

      const confirmDelete = async () => {
        try {
          await deleteShift({
            id,
            pathname,
          });
          toast.success('Successfully deleted shift');
        } catch (error: any) {
          toast.error('Failed to delete shift');
        }
      };

      const changeStatus = async (event: any) => {
        try {
          setOptimisticStatus(event.currentTarget.checked);
          await changeShiftStatus({
            id,
            isActive: event.currentTarget.checked,
            pathname,
          });

          toast.success('Successfully changed status');
        } catch (error: any) {
          toast.error('Failed to change status');
        }
      };

      return (
        <div className='flex items-center gap-4'>
          <Switch
            checked={optimisticStatus}
            onChange={changeStatus}
            color='teal'
            size='sm'
            thumbIcon={
              optimisticStatus ? (
                <IconCheck
                  style={{ width: rem(8), height: rem(8) }}
                  color={theme.colors.teal[6]}
                  stroke={3}
                />
              ) : (
                <IconX
                  style={{ width: rem(8), height: rem(8) }}
                  color={theme.colors.red[6]}
                  stroke={3}
                />
              )
            }
          />
          <ConfirmModal
            title='Delete Shift'
            description='Are you sure you want to delete this shift? This action can
            not be undone'
            onConfirm={confirmDelete}
            variant={{
              confirm: 'destructive',
            }}
          >
            <Trash2 className='text-red-500 cursor-pointer h-5 w-5' />
          </ConfirmModal>

          <PencilIcon
            onClick={() => {
              modals.open({
                title: 'Edit Shift',
                children: <ShiftForm type='EDIT' initialData={row.original} />,
                centered: true,
              });
            }}
            className='text-primary-blue cursor-pointer h-5 w-5'
          />
        </div>
      );
    },
  },
];
