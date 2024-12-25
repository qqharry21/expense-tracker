'use client';

import { EditIcon, EllipsisIcon, Loader, TrashIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Types } from '@/lib/types';
import { useCallback, useMemo, useState } from 'react';

import { deleteIncome } from '@/actions/income';
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
import { currency, frequency, incomeCategory, Level } from '@/lib';
import { cn, getAmountAndFrequencyLevel, getFrequencyColor } from '@/lib/utils';
import { formatDate } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { IncomeForm } from './IncomeForm';

export const IncomeCard = ({ income }: { income: Types.Income }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const targetCategory = useMemo(
    () => incomeCategory[income.category],
    [income.category],
  );

  const frequencyColor = useMemo(
    () => getFrequencyColor(income.frequency),
    [income.frequency],
  );

  const level = useMemo(
    () => getAmountAndFrequencyLevel(income.amount, income.frequency),
    [income.amount, income.frequency],
  );

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
      await deleteIncome(income.id);
      setAlertDialogOpen(false);
      toast.success('刪除收入成功');
    } catch (error) {
      toast.error('刪除收入失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="relative space-y-0 pb-3">
          <CardTitle className="mb-3 truncate pr-8" title={income.title}>
            {income.title}
          </CardTitle>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-500">
              {formatDate(new Date(income.date), 'MM/dd')}
            </span>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-x-1"
            >
              {/* <targetCategory.icon size={14} /> */}
              <span>{targetCategory.label}</span>
            </Badge>
          </div>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="absolute right-6 top-6">
              <EllipsisIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleOpenDialog}>
                <EditIcon className="size-4" />
                編輯
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleOpenAlertDialog}>
                <TrashIcon className="size-4" />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge
                variant="outline"
                className={cn(`text-xs ${frequencyColor}`)}
              >
                {frequency[income.frequency]}
              </Badge>
              <span
                className={cn(`text-lg font-medium`, {
                  'text-red-500': level === Level.HIGH,
                  'text-yellow-500': level === Level.MEDIUM,
                  'text-green-500': level === Level.LOW,
                })}
              >
                {currency[income.currency].symbol} {income.amount}
              </span>
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
            <div>
              <p className="truncate text-sm text-muted-foreground">
                {income.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯收入</DialogTitle>
          </DialogHeader>
          <div className="max-h-[600px] overflow-auto">
            <IncomeForm
              mode="edit"
              defaultValues={income}
              onSuccess={() => setDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>您確定要刪除這筆紀錄？</AlertDialogTitle>
            <AlertDialogDescription>
              這個動作無法復原，請確認是否要刪除這筆紀錄
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <Button variant="destructive" disabled={loading} onClick={onDelete}>
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <TrashIcon className="size-4" />
              )}
              {loading ? '刪除中...' : '刪除'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
