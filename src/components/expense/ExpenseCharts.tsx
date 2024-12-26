'use client';

import { Types } from '@/lib/types';
import { ExpenseCategoryStackedBarChart } from '../charts/ExpenseCategoryStackedBarChart';
import { TotalExpensesTrendLineChart } from '../charts/TotalExpensesTrendLineChart';

export const ExpenseCharts = ({ expenses }: { expenses: Types.Expense[] }) => {
  return (
    <div className="grid gap-8 border-b border-border pb-8 lg:grid-cols-2">
      <ExpenseCategoryStackedBarChart expenses={expenses} />
      <TotalExpensesTrendLineChart />
    </div>
  );
};

ExpenseCharts.displayName = 'ExpenseCharts';
