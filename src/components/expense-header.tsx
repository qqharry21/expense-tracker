import { Types } from '@/lib/types';
import { ExpenseDialog } from './expense-dialog';

interface ExpenseHeaderProps {
  expenses: Types.Expense[];
}

export const ExpenseHeader = ({  expenses }: ExpenseHeaderProps) => {
  return (
    <div className='mb-4 flex justify-between items-center'>
      <h2 className='text-xl font-semibold'>支出記錄</h2>
      <ExpenseDialog expenses={expenses} />
    </div>
  );
};
