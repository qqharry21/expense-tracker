'use client';

import { EditIcon, Loader } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Types } from '@/lib/types';
import { useState } from 'react';

import { deleteExpense } from '@/actions/expense';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from 'date-fns';
import { EllipsisIcon, TrashIcon } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { ExpenseForm } from './ExpenseForm';

export const ExpenseCard = ({ expense }: { expense: Types.Expense }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenDialog = useCallback(() => {
    setDropdownOpen(false);
    setDialogOpen(true);
  }, []);

  const handleOpenAlertDialog = useCallback(() => {
    setDropdownOpen(false);
    setAlertDialogOpen(true);
  }, []);

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteExpense(expense.id);
      setAlertDialogOpen(false);
      toast.success('刪除支出成功');
    } catch (error) {
      toast.error('刪除支出失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className='flex flex-col'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle>{expense.title}</CardTitle>
          <DropdownMenu
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger>
              <EllipsisIcon className='size-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={handleOpenDialog}>
                <EditIcon className='size-4 ' />
                編輯
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={handleOpenAlertDialog}>
                <TrashIcon className='size-4' />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className='flex-grow'>
          <div className='flex flex-col space-y-4'>
            <div className='flex flex-wrap mt-2 items-center gap-2 justify-between'>
              <span className='text-sm text-muted-foreground'>
                {formatDate(new Date(expense.dueDate), 'MM/dd')}
              </span>
              <Badge variant='outline'>{expense.category}</Badge>
            </div>
            <div className='flex justify-between items-center gap-2 flex-wrap'>
              <Badge
                variant='outline'
                className={`text-xs ${
                  expense.frequency === Types.Frequency.ONE_TIME
                    ? 'bg-blue-100 text-blue-800'
                    : expense.frequency === Types.Frequency.WEEKLY
                    ? 'bg-green-100 text-green-800'
                    : expense.frequency === Types.Frequency.MONTHLY
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                {expense.frequency}
              </Badge>
              <span className='text-lg font-semibold text-green-600'>${expense.amount}</span>
            </div>
            {/* <div className='flex flex-wrap gap-2 mt-2'>
                {expense.tag.map((tag, index) => (
                  <Badge
                    key={index}
                    variant='secondary'
                    className='text-sm'>
                    {tag}
                  </Badge>
                ))}
              </div> */}
            <div className='mt-4'>
              <p className='text-sm truncate text-muted-foreground'>{expense.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯支出</DialogTitle>
          </DialogHeader>
          <div className='overflow-scroll max-h-[600px]'>
            <ExpenseForm
              mode='edit'
              defaultValues={expense}
              onSuccess={() => setDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>您確定要刪除這筆紀錄？</AlertDialogTitle>
            <AlertDialogDescription>
              這個動作無法復原，請確認是否要刪除這筆紀錄
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <Button
              variant='destructive'
              disabled={loading}
              onClick={onDelete}>
              {loading ? <Loader className='animate-spin' /> : <TrashIcon className='size-4' />}
              {loading ? '刪除中...' : '刪除'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
