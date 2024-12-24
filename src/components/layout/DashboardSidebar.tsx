import { NavUser } from '@/components/NavUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Types } from '@/lib/types';
import { User } from 'next-auth';
import { NavMain } from '../NavMain';
import { SignoutButton } from '../SignoutButton';
import { DashboardDatePicker } from './DashboardDatePicker';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  calendars: [
    {
      name: 'My Calendars',
      items: ['Personal', 'Work', 'Family'],
    },
    {
      name: 'Favorites',
      items: ['Holidays', 'Birthdays'],
    },
    {
      name: 'Other',
      items: ['Travel', 'Reminders', 'Deadlines'],
    },
  ],
};

interface DashboardSidebarProps {
  expenses: Types.Expense[];
  user: User;
}

export async function DashboardSidebar({
  expenses,
  user,
}: DashboardSidebarProps) {
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
