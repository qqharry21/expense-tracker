'use client';

import { Calendar } from '@/components/ui/calendar';
import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { format, isSameMonth } from 'date-fns';
import { useCallback, useState } from 'react';

import { Types } from '@/lib/types';
import { isExpenseOnDate } from '@/lib/utils';
import { zhTW } from 'date-fns/locale';
import { DayContentProps } from 'react-day-picker';
import { Button } from '../ui/button';

interface DashboardDatePickerProps {
  expenses: Types.Expense[];
}

export function DashboardDatePicker({ expenses }: DashboardDatePickerProps) {
  const today = new Date();
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
          className='[&_[role=gridcell]]:w-[34.3px] [&_th]:w-[34.3px]'
          mode='single'
          required
          selected={selectedDate}
          onSelect={setSelectedDate}
          month={selectedMonth}
          onMonthChange={setSelectedMonth}
          locale={zhTW}
          modifiers={{
            marked: (date) => getExpensesForDate(date).length > 0,
          }}
          modifiersClassNames={{
            marked: 'relative',
          }}
          components={{
            DayContent: ({ date, ...props }) => {
              const existExpenses = getExpensesForDate(date);
              return (
                <CustomDayContent
                  date={date}
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

interface CustomDayContentProps extends DayContentProps {
  existExpenses: Types.Expense[];
}

const CustomDayContent = ({ date, existExpenses }: CustomDayContentProps) => {
  return (
    <div className='flex justify-center items-center'>
      <span>{format(date, 'd')}</span>
      <div className='absolute bottom-[2.5px] flex items-center justify-center gap-x-1'>
        {existExpenses.map((expense, index) => (
          <div
            key={`expense-${expense.id}-${index}`}
            className='size-[5px] rounded-full bg-primary border border-primary group-aria-selected:bg-primary-foreground transition-colors ease-in-out duration-200'
          />
        ))}
      </div>
    </div>
  );
};
