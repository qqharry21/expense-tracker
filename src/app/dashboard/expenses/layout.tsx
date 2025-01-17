import { ExpenseHeader } from '@/components/expense/ExpenseHeader';

export default function ExpenseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto space-y-8 p-4">
      <ExpenseHeader />
      {children}
    </div>
  );
}
