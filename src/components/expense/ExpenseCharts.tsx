'use client';

import { ExpenseCategoryStackedBarChart } from '../charts/ExpenseCategoryStackedBarChart';
import { TotalExpensesTrendLineChart } from '../charts/TotalExpensesTrendLineChart';

export const ExpenseCharts = () => {
  return (
    <div className="grid gap-8 border-b border-border pb-8 lg:grid-cols-2">
      <ExpenseCategoryStackedBarChart />
      <TotalExpensesTrendLineChart />
    </div>
  );
};

ExpenseCharts.displayName = 'ExpenseCharts';
