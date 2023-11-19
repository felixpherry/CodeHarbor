'use client';

import { MasterGrade } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { modals } from '@mantine/modals';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { deleteGradeCategory } from '../_actions';
import GradeForm from './GradeForm';

export const columns: ColumnDef<MasterGrade>[] = [
  {
    header: 'No',
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Category
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='font-bold text-primary'>{row.original.category}</span>
      );
    },
  },
  {
    accessorKey: 'minScore',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Min Score
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'maxScore',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Min Score
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Description
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'hexCode',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Hex Color
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-3'>
          <div
            className='h-5 w-5 rounded-full'
            style={{
              backgroundColor: row.original.hexCode,
            }}
          />
          <span className='text-muted-foreground'>{row.original.hexCode}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, category } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname();

      const confirmDelete = async () => {
        try {
          await deleteGradeCategory({
            id,
            pathname,
          });
          toast.success('Successfully deleted grade category');
        } catch (error: any) {
          toast.error('Failed to delete grade category');
        }
      };

      return (
        <div className='flex items-center gap-4'>
          <PencilIcon
            onClick={() => {
              modals.open({
                title: (
                  <p className='text-primary font-semibold'>
                    Edit Grade Category
                  </p>
                ),
                children: <GradeForm type='EDIT' initialData={row.original} />,
                centered: true,
                size: 'xl',
              });
            }}
            className='text-primary-blue cursor-pointer w-5 h-5'
          />
          <ConfirmModal
            title={`Delete ${category}?`}
            description='Are you sure you want to delete this grade category? This action can
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
