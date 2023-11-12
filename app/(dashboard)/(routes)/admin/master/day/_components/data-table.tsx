'use client';

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';

import { useState } from 'react';
import { Input } from '@mantine/core';
import TanstackTable from '@/components/shared/TanstackTable';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className='flex flex-col gap-3'>
      <Input
        placeholder='Search day...'
        value={(table.getColumn('day')?.getFilterValue() as string) ?? ''}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          table.getColumn('day')?.setFilterValue(event.target.value)
        }
        className='w-full md:w-1/3'
      />

      <TanstackTable
        columns={columns}
        data={data}
        table={table}
        withPagination={true}
      />
    </div>
  );
}
