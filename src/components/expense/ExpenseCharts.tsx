import { getExpenseData } from '@/lib/api/expense';
import { ExpenseCategoryStackedBarChart } from '../charts/ExpenseCategoryStackedBarChart';
import { TotalExpensesTrendLineChart } from '../charts/TotalExpensesTrendLineChart';

export const ExpenseCharts = async ({ userId }: { userId?: string }) => {
  const expenses6Months = await getExpenseData('6months', userId);
  const expensesThisMonths = await getExpenseData('month', userId);

  return (
    <>
      <ExpenseCategoryStackedBarChart
        expenses={expensesThisMonths}
        className="col-span-2 sm:col-span-1"
      />
      <TotalExpensesTrendLineChart
        expenses={expenses6Months}
        totalMonths={6}
        className="col-span-2 sm:col-span-1"
      />
    </>
  );
};
