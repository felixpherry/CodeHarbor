'use client';

import { MasterEvaluation } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { modals } from '@mantine/modals';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { deleteEvaluation } from '../_actions';
import EvaluationForm from './EvaluationForm';

export const columns: ColumnDef<MasterEvaluation>[] = [
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
    accessorKey: 'weight',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Weight
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
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
          await deleteEvaluation({
            id,
            pathname,
          });
          toast.success('Successfully deleted evaluation');
        } catch (error: any) {
          toast.error('Failed to delete evaluation');
        }
      };

      return (
        <div className='flex items-center gap-4'>
          <PencilIcon
            onClick={() => {
              modals.open({
                title: (
                  <p className='text-primary font-semibold'>Edit Evaluation</p>
                ),
                children: (
                  <EvaluationForm type='EDIT' initialData={row.original} />
                ),
                centered: true,
                size: 'xl',
              });
            }}
            className='text-primary-blue cursor-pointer w-5 h-5'
          />
          <ConfirmModal
            title={`Delete ${name}?`}
            description='Are you sure you want to delete this evaluation? This action can
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
