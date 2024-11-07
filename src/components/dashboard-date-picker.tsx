'use client';

import { Calendar } from '@/components/ui/calendar';
import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { format, isAfter, isEqual, isSameMonth, startOfDay } from 'date-fns';
import { useState } from 'react';

import { IExpense } from '@/models/Expense';
import { zhTW } from 'date-fns/locale';
import { Button } from './ui/button';

interface DashboardDatePickerProps {
  expenses: IExpense[];
}

export function DashboardDatePicker({ expenses }: DashboardDatePickerProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [selectedMonth, setSelectedMonth] = useState<Date>(today);

  const getExpensesForDate = (date: Date) => {
    const filteredExpenses = expenses.filter((expense) => {
      const initialTargetDate = startOfDay(new Date(expense.date));
      return (
        (isAfter(date, initialTargetDate) || isEqual(date, initialTargetDate)) &&
        date.getDate() === 4
      );
    });

    return filteredExpenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      type: expense.type,
    }));
  };

  return (
    <SidebarGroup className='px-0'>
      <SidebarGroupContent>
        <Calendar
          className='[&_[role=gridcell]]:w-[33px]'
          mode='single'
          required
          selected={selectedDate}
          onSelect={setSelectedDate}
          month={selectedMonth}
          onMonthChange={setSelectedMonth}
          locale={zhTW}
          formatters={{
            formatCaption: (date, options) => format(date, 'MMMM yyyy', options),
          }}
          modifiers={{
            hasExpense: (date) => getExpensesForDate(date).length > 0,
          }}
          modifiersClassNames={{
            hasExpense: 'relative',
          }}
          components={{
            DayContent: ({ date }) => {
              const existingExpenses = getExpensesForDate(date);
              return (
                <div className='relative w-full h-full flex items-center justify-center'>
                  {date.getDate()}
                  {existingExpenses.length > 0 && (
                    <div className='absolute bottom-1 left-0 right-0 flex justify-center space-x-1'>
                      {existingExpenses.slice(0, 3).map((expense, index) => (
                        <div
                          key={index}
                          className='size-1 rounded-full bg-primary group-aria-selected:bg-white'
                          title={`${expense.category}: ${expense.amount}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
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
