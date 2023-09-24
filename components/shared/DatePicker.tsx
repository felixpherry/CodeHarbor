'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { SelectSingleEventHandler } from 'react-day-picker';

interface DatePickerProps {
  date: Date;
  setDate: SelectSingleEventHandler;
}

const DatePicker = ({ date, setDate }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal text-sm',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          initialFocus
          classNames={{
            day_selected:
              'bg-primary-blue text-white hover:bg-primary-blue hover:text-white focus:bg-primary-blue focus:text-white',
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
