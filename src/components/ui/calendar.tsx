'use client';

import * as React from 'react';
import { DayPicker, DropdownProps } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zhTW } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={zhTW}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        month: 'space-y-4',
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-y-0 relative',
        month_caption: 'flex justify-center relative items-center',
        month_grid: 'w-full border-collapse space-y-1',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center justify-between absolute inset-x-0',
        dropdowns: 'flex items-center justify-center gap-x-2',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10',
        ),
        weeks: 'w-full border-collapse space-y-',
        weekdays: 'flex',
        weekday:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day_button:
          'size-8 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal group aria-selected:opacity-100',
        ),
        range_end: 'day-range-end',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        ...components,
        Dropdown: CustomMonthYearDropdown,
        Chevron: ({ ...props }) =>
          props.orientation === 'left' ? (
            <ChevronLeftIcon {...props} className="size-4" />
          ) : (
            <ChevronRightIcon {...props} className="size-4" />
          ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

const CustomMonthYearDropdown = ({
  value,
  onChange,
  options,
  ...props
}: DropdownProps) => {
  const selected = React.useMemo(
    () => options?.find((option) => option.value === value),
    [value, options],
  );
  const handleChange = (value: string) => {
    const changeEvent = {
      target: { value },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(changeEvent);
  };
  return (
    <Select
      value={value?.toString()}
      onValueChange={(value) => {
        handleChange(value);
      }}
    >
      <SelectTrigger
        className="h-7 border-none p-0 shadow-none focus:ring-0"
        aria-label={props['aria-label']}
        disabled={props.disabled}
      >
        <SelectValue>{selected?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent position="popper">
        <ScrollArea className="h-40">
          {options?.map((option, id: number) => (
            <SelectItem
              key={`${option.value}-${id}`}
              value={option.value?.toString() ?? ''}
            >
              {option.label}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

export { Calendar };
