import { auth } from '@/auth';
import { BudgetAchievementRadarChart } from '@/components/charts/BudgetAchievementRadarChart';
import { ExpenseCategoryPieChart } from '@/components/charts/ExpenseCategoryPieChart';
import { MonthlyIncomeExpensesChart } from '@/components/charts/MonthlyIncomeExpensesChart';
import { NetWorthAreaChart } from '@/components/charts/NetWorthAreaChart';
import { prisma } from '@/lib/prisma';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { redirect } from 'next/navigation';
export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  const userId = session.user.id;

  const currentDate = new Date();
  const sixMonthsAgo = subMonths(currentDate, 5);

  const startDate = startOfMonth(sixMonthsAgo);
  const endDate = endOfMonth(currentDate);

  const expenses = (
    await prisma.expense.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    })
  ).reverse();

  return (
    <div className="grid flex-1 gap-10 md:grid-cols-2 md:gap-6 xl:gap-10">
      <MonthlyIncomeExpensesChart />
      <NetWorthAreaChart />
      <ExpenseCategoryPieChart />
      <BudgetAchievementRadarChart />
    </div>
  );
}
