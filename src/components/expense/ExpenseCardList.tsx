import { prisma } from '@/lib/prisma';
import { EmptyData } from '../EmptyData';
import { ExpenseCard } from './ExpenseCard';

export const ExpenseCardList = async ({ userId }: { userId?: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const expenses = (
    await prisma.expense.findMany({
      where: { userId },
      orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
    })
  ).reverse();

  if (expenses.length === 0) {
    return <EmptyData />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  );
};
