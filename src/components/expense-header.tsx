'use client';

import { format } from 'date-fns';
import { CalendarIcon, PlusIcon, XIcon } from 'lucide-react';

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
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IExpense } from '@/models/Expense';
import { useState } from 'react';

interface ExpenseHeaderProps {
  expenses: IExpense[];
}

export const ExpenseHeader = ({ expenses }: ExpenseHeaderProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('🚨 - form submitted');
    // Here you would typically handle form submission,
    // update the expenses state, and close the dialog
    setIsDialogOpen(false);
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleTagKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const getExpensesForDate = (date: Date) => {
    return expenses.filter((expense) => expense.date === format(date, 'yyyy-MM-dd'));
  };
  return (
    <div className='mb-4 flex justify-between items-center'>
      <h2 className='text-xl font-semibold'>支出記錄</h2>
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className='mr-2 h-4 w-4' />
            新增支出
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px] max-h-[100dvh] md:max-h-[85vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>新增支出</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className='space-y-4 px-1 py-2 md:px-4 md:py-4'>
            <div className='space-y-2'>
              <Label htmlFor='date'>日期</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                    id='date'>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'PPP') : '選擇日期'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto p-0'
                  align='start'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
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
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category'>類別</Label>
              <Select>
                <SelectTrigger id='category'>
                  <SelectValue placeholder='選擇類別' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='食物'>食物</SelectItem>
                  <SelectItem value='交通'>交通</SelectItem>
                  <SelectItem value='娛樂'>娛樂</SelectItem>
                  <SelectItem value='住宿'>住宿</SelectItem>
                  <SelectItem value='其他'>其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='amount'>金額</Label>
              <Input
                id='amount'
                type='number'
                placeholder='輸入金額'
                onKeyDown={handleKeydown}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='type'>類型</Label>
              <Select>
                <SelectTrigger id='type'>
                  <SelectValue placeholder='選擇類型' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='一次性'>一次性</SelectItem>
                  <SelectItem value='每月固定開銷'>每月固定開銷</SelectItem>
                  <SelectItem value='每年固定開銷'>每年固定開銷</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>描述</Label>
              <Textarea
                id='description'
                placeholder='輸入描述'
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='tags'>標籤</Label>
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
                  id='tags'
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
            </div>

            <Button
              type='submit'
              className='w-full'>
              提交支出
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
