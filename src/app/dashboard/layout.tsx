import { auth } from '@/auth';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: PropsWithChildren) {
  const expenses = (await prisma.expense.findMany({})).reverse();
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      <DashboardSidebar expenses={expenses} />
      <SidebarInset>
        <DashboardHeader />
        <div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
