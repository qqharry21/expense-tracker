'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { expenseSchema } from '@/lib/schema';
import { Types } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { createExpense, updateExpense } from '@/actions/expense';
import { useMutation } from 'http-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

interface ExpenseFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<Types.Expense>;
  onSuccess?: () => void;
  onError?: () => void;
}

export const ExpenseForm = ({
  mode,
  defaultValues = {
    title: '',
    dueDate: new Date(),
    category: 'food',
    amount: 0,
    frequency: Types.Frequency.ONE_TIME,
    description: '',
  },
  onSuccess,
  onError,
}: ExpenseFormProps) => {
  const form = useForm<Types.Expense>({
    mode: 'onSubmit',
    resolver: zodResolver(expenseSchema),
    defaultValues,
  });

  const { refresh, error, isLoading } = useMutation(
    mode === 'create' ? createExpense : updateExpense,
    {
      params: form.getValues(),
      onResolve() {
        form.reset();
        toast.success(mode === 'create' ? '新增支出成功' : '更新支出成功');
        onSuccess?.();
      },
      onError() {
        toast.error(mode === 'create' ? '新增支出失敗' : '更新支出失敗');
        onError?.();
      },
    }
  );

  const onSubmit = form.handleSubmit(refresh);

  const handleKeydown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };
  return (
    <Form {...form}>
      <form
        onKeyDown={handleKeydown}
        onSubmit={onSubmit}
        className='gap-y-4 gap-x-2 grid-cols-2 grid px-1 py-2 md:px-4 md:py-4'>
        <FormField
          name='title'
          control={form.control}
          render={({ field }) => (
            <FormItem className='col-span-2'>
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
            <FormItem className='col-span-2 md:col-span-1'>
              <FormLabel>扣款日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal truncate',
                        !field.value && 'text-muted-foreground'
                      )}
                      id='dueDate'>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field.value ? format(field.value, 'yyyy-MM-dd') : '選擇日期'}
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
                    modifiersStyles={{
                      hasExpense: {
                        color: 'inherit',
                        position: 'relative',
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
            <FormItem className='col-span-2 md:col-span-1'>
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
            <FormItem className='col-span-2 md:col-span-1'>
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
            <FormItem className='col-span-2 md:col-span-1'>
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
            <FormItem className='col-span-2'>
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
        <Button
          type='submit'
          className='w-full col-span-2'
          disabled={isLoading || !form.formState.isValid || !form.formState.isDirty}>
          {mode === 'create' ? '新增支出' : '更新支出'}
        </Button>
      </form>
    </Form>
  );
};
