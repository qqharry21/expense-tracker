import { IExpense } from '@/models/Expense';
import { ExpenseDialog } from './expense-dialog';

interface ExpenseHeaderProps {
  userId?: string | null;
  expenses: IExpense[];
}

export const ExpenseHeader = ({ userId, expenses }: ExpenseHeaderProps) => {
  return (
    <div className='mb-4 flex justify-between items-center'>
      <h2 className='text-xl font-semibold'>支出記錄</h2>
      <ExpenseDialog
        userId={userId}
        expenses={expenses}
      />
    </div>
  );
};
