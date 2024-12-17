'use client';

import { format } from 'date-fns';
import { AlertCircle, CalendarIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ExpenseFormValue, expenseSchema } from '@/lib/schema';
import { Types } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useState } from 'react';

import { createExpense } from '@/actions/expense';
import { useMutation } from 'http-react';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

interface ExpenseDialogProps {
  expenses: Types.Expense[];
}

export const ExpenseDialog = ({ expenses }: ExpenseDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ExpenseFormValue>({
    mode: 'onSubmit',
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      dueDate: new Date(),
      category: 'food',
      amount: 0,
      frequency: Types.Frequency.ONE_TIME,
      description: '',
    },
  });

  const { refresh, error } = useMutation(createExpense, {
    params: form.getValues(),
    onResolve() {
      form.reset();
      setIsDialogOpen(false);
    },
  });

  const onSubmit = form.handleSubmit(refresh);

  const handleKeydown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleTagKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const getExpensesForDate = useCallback(
    (date: Date) => {
      return expenses.filter(
        (expense) => format(expense.dueDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
    },
    [expenses]
  );

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button type='button'>
          <PlusIcon className='mr-2 h-4 w-4' />
          新增支出
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] max-h-[100dvh] md:max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>新增支出</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onKeyDown={handleKeydown}
            onSubmit={onSubmit}
            className='space-y-4 px-1 py-2 md:px-4 md:py-4'>
            <FormField
              name='title'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>項目名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      placeholder='輸入項目名稱'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='dueDate'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                          id='dueDate'>
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {field.value ? format(field.value, 'PPP') : '選擇日期'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto p-0'
                      align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        modifiers={{
                          hasExpense: (date) => getExpensesForDate(date).length > 0,
                        }}
                        modifiersStyles={{
                          hasExpense: {
                            color: 'inherit',
                            position: 'relative',
                          },
                        }}
                        components={{
                          DayContent: ({ date }) => {
                            const expenses = getExpensesForDate(date);
                            return (
                              <div className='relative w-full h-full flex items-center justify-center text-sm md:text-base'>
                                {date.getDate()}
                                {expenses.length > 0 && (
                                  <div className='absolute bottom-0 left-0 right-0 flex justify-center'>
                                    <div className='w-1 h-1 bg-primary rounded-full' />
                                  </div>
                                )}
                              </div>
                            );
                          },
                        }}
                        className='w-full max-w-[280px] mx-auto'
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='category'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>類別</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger id='category'>
                        <SelectValue placeholder='選擇類別' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='food'>食物</SelectItem>
                      <SelectItem value='traffic'>交通</SelectItem>
                      <SelectItem value='entertainment'>娛樂</SelectItem>
                      <SelectItem value='accommodation'>住宿</SelectItem>
                      <SelectItem value='others'>其他</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='amount'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>金額</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      placeholder='輸入金額'
                      onChange={(event) => {
                        field.onChange(formatNumber(event.target.value));
                      }}
                      onBlur={(event) => {
                        event.target.value = formatNumber(event.target.value).toString();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='frequency'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>頻率</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger id='frequency'>
                        <SelectValue placeholder='選擇頻率' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Types.Frequency.ONE_TIME}>一次性</SelectItem>
                      <SelectItem value={Types.Frequency.DAILY}>每日固定開銷</SelectItem>
                      <SelectItem value={Types.Frequency.WEEKLY}>每週固定開銷</SelectItem>
                      <SelectItem value={Types.Frequency.MONTHLY}>每月固定開銷</SelectItem>
                      <SelectItem value={Types.Frequency.ANNUALLY}>每年固定開銷</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='description'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='輸入描述'
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              name='tags'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>標籤</FormLabel>
                  <div className='flex flex-wrap gap-2 mb-2'>
                    <div className='flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded'>
                      範例標籤
                      <button
                        type='button'
                        className='ml-2 text-blue-600 hover:text-blue-800'>
                        <XIcon size={14} />
                      </button>
                    </div>
                  </div>
                  <div className='flex'>
                    <Input
                      {...field}
                      placeholder='新增標籤'
                      onKeyDown={handleTagKeydown}
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='ml-2'>
                      <PlusIcon className='h-4 w-4' />
                    </Button>
                  </div>
                  <p className='text-sm text-gray-500'>按下 Enter 或點擊 + 按鈕來新增標籤</p>
                </FormItem>
              )}
            /> */}
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>An error occurred</AlertTitle>
                <AlertDescription>{JSON.stringify(error)}</AlertDescription>
              </Alert>
            )}
            <Button
              type='submit'
              className='w-full'>
              新增支出
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
