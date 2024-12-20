import { Types } from '@/lib/types';
import { ExpenseCard } from './ExpenseCard';

export const ExpenseCardList = ({
  expenses,
}: {
  expenses: Types.Expense[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  );
};
