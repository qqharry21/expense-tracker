import { auth } from '@/auth';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ExchangeRateProvider } from '@/context/ExchangeRateProvider';
import { fetchCachedExchangeRates } from '@/lib/api/exchange-rates';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }
  const exchangeRates = await fetchCachedExchangeRates();

  return (
    <ExchangeRateProvider exchangeRates={exchangeRates}>
      <SidebarProvider>
        <DashboardSidebar user={session.user} />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ExchangeRateProvider>
  );
}
