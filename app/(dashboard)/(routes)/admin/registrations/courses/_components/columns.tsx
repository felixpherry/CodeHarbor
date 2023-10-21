'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { CourseRegistration, RegistrationStatus } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
  createAccountForStudent,
  updateCourseRegistrationStatus,
} from '../_actions';
import CourseRegistrationDetail from './CourseRegistrationDetail';
import CourseRegistrationSuccess from './CourseRegistrationSuccess';
import moment from 'moment';

export const columns: ColumnDef<CourseRegistration>[] = [
  {
    header: 'No',
  },
  {
    accessorKey: 'childName',
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
          {row.getValue('childName')}
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
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Phone Number
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status: RegistrationStatus = row.getValue('status') || 'PENDING';

      const statusVariant = (
        row.getValue('status') as string
      ).toLocaleLowerCase() as BadgeProps['variant'];
      return (
        <Badge variant={statusVariant}>
          {status[0] + status.substring(1).toLocaleLowerCase()}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname();

      const confirmStatus = async (status: RegistrationStatus) => {
        try {
          await updateCourseRegistrationStatus({
            id,
            status,
            pathname,
          });

          toast.success('Successfully updated registration status');
          // toast.custom(
          //   (t) => (
          //     <CourseRegistrationSuccess toastId={t} payload={row.original} />
          //   ),
          //   {
          //     duration: 100000,
          //   }
          // );
          if (status === 'APPROVED') {
            try {
              await createAccountForStudent(row.original);

              toast.success(
                'Successfully created account for the user. Please contact the user for the account credentials'
              );
            } catch (error: any) {
              toast.error('Failed to create account for the user');
            }
          }
        } catch (error: any) {
          toast.error('Failed to update registration status');
        }
      };

      return (
        <div className='flex items-center gap-6'>
          {row.getValue('status') === 'PENDING' && (
            <>
              <ConfirmModal
                title='Approve Registration'
                description='Do you want to approve this registration'
                onConfirm={() => confirmStatus('APPROVED')}
              >
                <ThumbsUp className='text-green-500 cursor-pointer' />
              </ConfirmModal>
              <ConfirmModal
                title='Reject Registration'
                description='Do you want to reject this registration'
                onConfirm={() => confirmStatus('REJECTED')}
              >
                <ThumbsDown className='text-red-500 cursor-pointer' />
              </ConfirmModal>
            </>
          )}

          <CourseRegistrationDetail
            data={
              row.original as {
                course: {
                  name: string;
                };
                coupon: {
                  code: string;
                };
              } & CourseRegistration
            }
          />
        </div>
      );
    },
  },
];
