'use client';

import * as React from 'react';
import { DateTime } from 'luxon';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { SelectSingleEventHandler } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

const DateTimePicker = ({ date, setDate }: DatePickerProps) => {
  const [selectedDateTime, setSelectedDateTime] = React.useState<DateTime>(
    DateTime.fromJSDate(date)
  );

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected);
    const modifiedDay = selectedDay.set({
      hour: selectedDateTime.hour,
      minute: selectedDateTime.minute,
    });

    setSelectedDateTime(modifiedDay);
    setDate(modifiedDay.toJSDate());
  };

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    const hours = Number.parseInt(value.split(':')[0] || '00', 10);
    const minutes = Number.parseInt(value.split(':')[1] || '00', 10);
    const modifiedDay = selectedDateTime.set({ hour: hours, minute: minutes });

    setSelectedDateTime(modifiedDay);
    setDate(modifiedDay.toJSDate());
  };

  const footer = (
    <>
      <div className='w-full px-6 pt-0 pb-4 flex flex-col justify-start gap-3'>
        <Label>Time</Label>
        <Input
          type='time'
          onChange={handleTimeChange}
          value={selectedDateTime.toFormat('HH:mm')}
        />
      </div>
      {!selectedDateTime && <p>Please pick a day.</p>}
    </>
  );

  return (
    <Popover>
      <PopoverTrigger className='z-10'>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal text-sm',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? (
            selectedDateTime.toFormat('DDD HH:mm')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={selectedDateTime.toJSDate()}
          onSelect={handleSelect}
          initialFocus
          classNames={{
            day_selected:
              'bg-primary-blue text-white hover:bg-primary-blue hover:text-white focus:bg-primary-blue focus:text-white',
          }}
        />
        {footer}
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
