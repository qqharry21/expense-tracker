import { Plus } from 'lucide-react';

import { Calendars } from '@/components/calendars';
import { DashboardDatePicker } from '@/components/dashboard-date-picker';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { IExpense } from '@/models/Expense';

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
  expenses: IExpense[];
}

export function DashboardSidebar({ expenses }: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className='h-16 border-b border-sidebar-border'>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <DashboardDatePicker expenses={expenses} />
        <SidebarSeparator className='mx-0' />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
