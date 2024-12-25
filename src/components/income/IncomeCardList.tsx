import { Types } from '@/lib/types';
import { IncomeCard } from './IncomeCard';

export const IncomeCardList = ({ incomes }: { incomes: Types.Income[] }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {incomes.map((income) => (
        <IncomeCard key={income.id} income={income} />
      ))}
    </div>
  );
};
