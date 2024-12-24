import { auth } from '@/auth';
import { BudgetAchievementRadarChart } from '@/components/charts/BudgetAchievementRadarChart';
import { ExpenseCategoryPieChart } from '@/components/charts/ExpenseCategoryPieChart';
import { MonthlyIncomeExpensesChart } from '@/components/charts/MonthlyIncomeExpensesChart';
import { NetWorthAreaChart } from '@/components/charts/NetWorthAreaChart';
import { prisma } from '@/lib/prisma';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
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
  console.log('🚨 - sixMonthExpenses', expenses);

  // 準備月份標籤
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = subMonths(currentDate, 5 - index);
    return format(date, 'yyyy-MM');
  });

  // 初始化每月支出
  const monthlyExpensesData = months.map((month) => ({
    month,
    amount: 0,
  }));

  // 匯總每月支出
  expenses.forEach((expense) => {
    const month = format(new Date(expense.startTime), 'yyyy-MM');
    const monthData = monthlyExpensesData.find((m) => m.month === month);
    if (monthData) {
      monthData.amount += expense.amount;
    }
  });
  console.log('🚨 - monthlyExpensesData', monthlyExpensesData);

  // 準備折線圖數據（支出趨勢）
  const expenseTrends = monthlyExpensesData;

  // 準備支出類別分佈
  const categoryMap: { [key: string]: number } = {};
  expenses.forEach((expense) => {
    categoryMap[expense.category] =
      (categoryMap[expense.category] || 0) + expense.amount;
  });
  const categoriesData = Object.keys(categoryMap).map((category) => ({
    name: category,
    value: categoryMap[category],
  }));
  return (
    <div className="grid flex-1 gap-10 md:grid-cols-2 md:gap-6 xl:gap-10">
      <MonthlyIncomeExpensesChart />
      <NetWorthAreaChart />
      <ExpenseCategoryPieChart />
      <BudgetAchievementRadarChart />
    </div>
  );
}
