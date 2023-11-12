'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useState } from 'react';

import { MantineSelectOption } from '@/types';
import FilterSelect from '@/components/shared/FilterSelect';
import TanstackTable from '@/components/shared/TanstackTable';
import { Input } from '@mantine/core';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  courseOptions: MantineSelectOption[];
  periodOptions: MantineSelectOption[];
  currentPeriodId: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  periodOptions,
  courseOptions,
  currentPeriodId,
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
      <div className='flex items-center py-4 gap-x-5 gap-y-2 flex-col md:flex-row'>
        <Input
          placeholder='Search classes...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='w-full md:w-1/3'
        />
        <FilterSelect
          options={courseOptions}
          withSearchParams={true}
          searchParamsKey='course'
        />
        <FilterSelect
          options={periodOptions}
          withSearchParams={true}
          searchParamsKey='period'
          defaultValue={currentPeriodId}
        />
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
