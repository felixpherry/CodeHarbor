'use client';

import { Badge } from '@/components/ui/badge';
import { MasterDay } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Switch, rem, useMantineTheme } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { changeDayStatus } from '../_actions';
import { useOptimistic } from 'react';

export const columns: ColumnDef<MasterDay>[] = [
  {
    header: 'No',
  },
  {
    accessorKey: 'day',
    header: 'Day',
    cell: ({ row }) => {
      return (
        <span className='font-bold text-primary'>{row.getValue('day')}</span>
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

      const changeStatus = async (event: any) => {
        try {
          setOptimisticStatus(event.currentTarget.checked);
          await changeDayStatus({
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
        <Switch
          checked={optimisticStatus}
          onChange={changeStatus}
          color='teal'
          size='md'
          thumbIcon={
            optimisticStatus ? (
              <IconCheck
                style={{ width: rem(12), height: rem(12) }}
                color={theme.colors.teal[6]}
                stroke={3}
              />
            ) : (
              <IconX
                style={{ width: rem(12), height: rem(12) }}
                color={theme.colors.red[6]}
                stroke={3}
              />
            )
          }
        />
      );
    },
  },
];
