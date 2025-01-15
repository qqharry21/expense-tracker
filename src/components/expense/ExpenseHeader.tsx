'use client';

import { Types } from '@/lib/types';
import { EyeIcon, EyeOffIcon, PlusIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useLayoutEffect, useState } from 'react';
import { ChartSkeleton } from '../ChartSkeleton';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Toggle } from '../ui/toggle';
import { ExpenseForm } from './ExpenseForm';

const ExpenseCharts = dynamic(
  () => import('./ExpenseCharts').then((mod) => mod.ExpenseCharts),
  {
    ssr: false,
    loading: () => <ChartSkeleton length={2} />,
  },
);

export const ExpenseHeader = ({ expenses }: { expenses: Types.Expense[] }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const onShowChartChange = () => {
    setShowChart((prev) => !prev);
    window.localStorage.setItem('showExpenseChart', JSON.stringify(!showChart));
  };

  useLayoutEffect(() => {
    const showExpenseChart =
      window.localStorage.getItem('showExpenseChart') === 'true';
    if (showExpenseChart) setShowChart(showExpenseChart);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">支出</h1>
        <div className="inline-flex items-center justify-center gap-x-4">
          <Toggle
            pressed={showChart}
            onPressedChange={onShowChartChange}
            asChild
          >
            <Button type="button" variant="outline" size="sm" className="h-8">
              {showChart ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
              <span className="ml-2 max-md:hidden">圖表</span>
            </Button>
          </Toggle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="default" size="sm">
                <PlusIcon size={16} />
                <span className="ml-2 max-md:hidden">新增支出</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增支出</DialogTitle>
              </DialogHeader>
              <div className="overflow-auto md:max-h-[650px]">
                <ExpenseForm
                  mode="create"
                  onSuccess={() => setDialogOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {showChart && <ExpenseCharts expenses={expenses} />}
    </>
  );
};
