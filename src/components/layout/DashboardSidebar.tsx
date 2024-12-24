import { NavUser } from '@/components/NavUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { prisma } from '@/lib/prisma';
import { User } from 'next-auth';
import { NavMain } from '../NavMain';
import { SignoutButton } from '../SignoutButton';
import { DashboardDatePicker } from './DashboardDatePicker';

interface DashboardSidebarProps {
  user: User;
}

export async function DashboardSidebar({ user }: DashboardSidebarProps) {
  const userId = user.id;
  const expenses = (
    await prisma.expense.findMany({
      where: { userId },
      orderBy: [{ amount: 'desc' }, { frequency: 'asc' }],
    })
  ).reverse();

  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={user}>
          <SignoutButton />
        </NavUser>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="gap-0">
        <SidebarSeparator className="mx-0" />
        <DashboardDatePicker expenses={expenses} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
