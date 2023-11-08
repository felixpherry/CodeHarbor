'use client';

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import StatusSelect from '../../_components/StatusSelect';
import CoursesFilterSelect from '../../../_components/CoursesFilterSelect';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  courseOptions: {
    text: string;
    value: string;
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  courseOptions,
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

  const page = table.getState().pagination.pageIndex + 1;

  return (
    <div>
      <div className='flex items-center py-4 gap-x-5 gap-y-2 flex-col md:flex-row'>
        <Input
          placeholder='Search name...'
          value={
            (table.getColumn('childName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn('childName')?.setFilterValue(event.target.value)
          }
          className='w-full md:w-1/3'
        />
        <StatusSelect />
        <CoursesFilterSelect courseOptions={courseOptions} />
      </div>
      <div className='rounded-md border'>
        <Table className='text-muted-foreground font-semibold'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIdx) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell, cellIdx) => {
                    if (cellIdx === 0)
                      return (
                        <TableCell>{(page - 1) * 10 + rowIdx + 1}</TableCell>
                      );
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex justify-between items-center'>
          <p className='text-muted-foreground'>
            Page {page} of {table.getPageCount()}
          </p>
        </div>
        <div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
