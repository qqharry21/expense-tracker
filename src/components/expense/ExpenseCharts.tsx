import { prisma } from '@/lib/prisma';
import { ExpenseCategoryStackedBarChart } from '../charts/ExpenseCategoryStackedBarChart';
import { TotalExpensesTrendLineChart } from '../charts/TotalExpensesTrendLineChart';

export const ExpenseCharts = async ({ userId }: { userId?: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const expenses = (
    await prisma.expense.findMany({
      where: { userId },
      orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
    })
  ).reverse();

  return (
    <div className="grid gap-8 border-b border-border pb-8 sm:grid-cols-2 xl:grid-cols-4">
      <ExpenseCategoryStackedBarChart expenses={expenses} />
      <TotalExpensesTrendLineChart expenses={expenses} totalMonths={6} />
    </div>
  );
};
