'use client';

import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { modals } from '@mantine/modals';
import { Plus } from 'lucide-react';
import { Input } from '@mantine/core';
import TanstackTable from '@/components/shared/TanstackTable';
import EvaluationForm from './EvaluationForm';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col items-start md:flex-row md:items-center justify-between py-4 gap-y-3'>
        <Input
          placeholder='Search evaluation...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='w-full md:w-1/3'
        />
        <Button
          size='sm'
          variant='primary-blue'
          onClick={() => {
            modals.open({
              title: (
                <p className='text-primary font-semibold'>Add Evaluation</p>
              ),
              children: <EvaluationForm type='ADD' />,
              centered: true,
              size: 'lg',
            });
          }}
        >
          <Plus className='h-4 w-4' />
          Add
        </Button>
      </div>

      <TanstackTable
        columns={columns}
        data={data}
        table={table}
        withPagination={true}
      />
    </div>
  );
}
