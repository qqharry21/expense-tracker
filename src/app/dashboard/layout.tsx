import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { fetchExpenses } from './actions/fetchExpenses';

export default async function Layout({ children }: PropsWithChildren) {
  const expenses = await fetchExpenses();

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
