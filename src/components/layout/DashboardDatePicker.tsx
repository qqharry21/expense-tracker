'use client';

import { format, isSameMonth } from 'date-fns';
import { useCallback, useState } from 'react';
import { DayButtonProps, TZDate } from 'react-day-picker';

import { Types } from '@/lib/types';
import { cn, isExpenseOnDate } from '@/lib/utils';

import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';

interface DashboardDatePickerProps {
  expenses: Types.Expense[];
}

export function DashboardDatePicker({ expenses }: DashboardDatePickerProps) {
  const today = new TZDate(new Date(), 'Asia/Taipei');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [selectedMonth, setSelectedMonth] = useState<Date>(today);

  const getExpensesForDate = useCallback(
    (date: Date) => expenses.filter((expense) => isExpenseOnDate(date, expense)),
    [expenses]
  );

  return (
    <SidebarGroup className='px-0'>
      <SidebarGroupContent>
        <Calendar
          mode='single'
          required
          captionLayout='dropdown'
          showOutsideDays={false}
          selected={selectedDate}
          month={selectedMonth}
          startMonth={new Date(1990, 1)}
          endMonth={new Date(2050, 11)}
          onSelect={setSelectedDate}
          onMonthChange={setSelectedMonth}
          className='[&_[role=gridcell]]:w-[33px] [&_th]:w-[33px]'
          classNames={{}}
          modifiers={{
            marked: (date) => getExpensesForDate(date).length > 0,
          }}
          modifiersClassNames={{
            marked: 'relative',
          }}
          components={{
            DayButton: ({ day, ...props }) => {
              const existExpenses = getExpensesForDate(day.date);
              return (
                <CustomDayButton
                  day={day}
                  existExpenses={existExpenses}
                  {...props}
                />
              );
            },
          }}
        />
        {!isSameMonth(today, selectedMonth) && (
          <div className='flex justify-center'>
            <Button
              size='sm'
              variant='link'
              className='hover:no-underline'
              onClick={() => {
                setSelectedMonth(today);
                setSelectedDate(today);
              }}>
              今天
            </Button>
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

interface CustomDayContentProps extends DayButtonProps {
  existExpenses: Types.Expense[];
}

const CustomDayButton = ({
  day,
  className,
  existExpenses,
  modifiers,
  ...props
}: CustomDayContentProps) => {
  return (
    <button
      className={cn('flex justify-center w-full h-full items-center relative', className)}
      {...props}>
      <span>{format(day.date, 'd')}</span>
      <div className='absolute bottom-[2.5px] flex items-center justify-center gap-x-0.5'>
        {existExpenses.slice(0, 3).map((expense, index) => (
          <div
            key={`expense-${expense.id}-${index}`}
            className='size-[5px] rounded-full bg-primary border border-primary group-aria-selected:bg-primary-foreground transition-colors ease-in-out duration-200'
          />
        ))}
      </div>
      <HoverCard
        openDelay={500}
        closeDelay={0}>
        <HoverCardTrigger asChild>
          <div className='absolute w-full h-full left-0 top-0'></div>
        </HoverCardTrigger>
        {existExpenses.length > 0 && (
          <HoverCardContent className='w-fit flex flex-col gap-2'>
            {existExpenses.map((expense) => (
              <div
                key={expense.id}
                className='flex items-center gap-2'>
                <span className='text-sm'>{expense.title}</span>
                <span className='text-sm text-primary'>{expense.amount.toLocaleString()}</span>
              </div>
            ))}
          </HoverCardContent>
        )}
      </HoverCard>
    </button>
  );
};
