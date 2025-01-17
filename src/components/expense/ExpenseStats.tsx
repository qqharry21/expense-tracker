import { getExpenseData } from '@/lib/api/expense';
import { getMonthlyTotalExpenses, getYearlyTotalExpenses } from '@/lib/helper';
import { formatNumberWithCommas } from '@/lib/utils';
import { Stats } from '../Stats';

export const ExpenseStats = async ({ userId }: { userId?: string }) => {
  const expensesThisMonths = await getExpenseData('month', userId);
  const expensesThisYear = await getExpenseData('year', userId);
  const monthlyTotal = getMonthlyTotalExpenses(expensesThisMonths);
  const yearlyTotal = getYearlyTotalExpenses(expensesThisYear);

  return (
    <>
      <Stats
        title="這個月支出"
        content={<ExpenseStatContent amount={monthlyTotal} />}
        className="col-span-2 h-full sm:col-span-1"
      />
      <Stats
        title="今年預計支出"
        content={<ExpenseStatContent amount={yearlyTotal} />}
        className="col-span-2 h-full sm:col-span-1"
      />
    </>
  );
};

const ExpenseStatContent = ({ amount }: { amount: number }) => {
  return (
    <p>
      {formatNumberWithCommas(amount)}
      <span className="ml-2 text-sm">元</span>
    </p>
  );
};
