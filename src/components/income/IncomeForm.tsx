'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { incomeSchema } from '@/lib/schema';
import { Types } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { createIncome } from '@/actions/income';
import { frequency, incomeCategory } from '@/lib';
import { useMutation } from 'http-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CurrencySelectInput } from '../CurrencySelectInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

interface IncomeFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<Types.Income>;
  onSuccess?: () => void;
  onError?: () => void;
}

export const IncomeForm = ({
  mode,
  defaultValues = {
    title: '',
    date: new Date(),
    category: Types.IncomeCategory.SALARY,
    currency: Types.Currency.TWD,
    amount: 500,
    frequency: Types.Frequency.MONTHLY,
    description: '',
  },
  onSuccess,
  onError,
}: IncomeFormProps) => {
  const form = useForm<Types.Income>({
    mode: 'onSubmit',
    resolver: zodResolver(incomeSchema),
    defaultValues,
  });

  console.log('form', form.getValues());

  const { refresh, error, isLoading } = useMutation(
    mode === 'create' ? createIncome : createIncome,
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
    },
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
        className="grid grid-cols-2 gap-x-2 gap-y-4 px-1 py-2 md:px-4 md:py-4"
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>項目名稱</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="輸入項目名稱" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>開始日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'col-span-4 w-full justify-start truncate text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                      id="startTime"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, 'yyyy-MM-dd')
                        : '選擇日期'}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="mx-auto w-full max-w-[280px]"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel>類別</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="選擇類別" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(incomeCategory).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        {/* <value.icon size={16} /> */}
                        <span>{value.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="frequency"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel>頻率</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="選擇頻率" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(frequency).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>單位/金額</FormLabel>
              <FormControl>
                <CurrencySelectInput
                  {...field}
                  onChange={(event) => {
                    field.onChange(formatNumber(event.target.value));
                  }}
                  selectedOption={form.watch('currency')}
                  onSelectChange={(value) =>
                    form.setValue('currency', value as Types.Currency)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="輸入描述" rows={3} />
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
          type="submit"
          className="col-span-2 w-full"
          disabled={
            isLoading || !form.formState.isValid || !form.formState.isDirty
          }
        >
          {mode === 'create' ? '新增支出' : '更新支出'}
        </Button>
      </form>
    </Form>
  );
};