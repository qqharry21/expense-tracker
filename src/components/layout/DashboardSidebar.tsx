import { Plus } from 'lucide-react';

import { auth } from '@/auth';
import { NavUser } from '@/components/NavUser';
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
import { Types } from '@/lib/types';
import { SignoutButton } from '../SignoutButton';
import { DashboardCalendars } from './DashboardCalendars';

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
}

export async function DashboardSidebar({ expenses }: DashboardSidebarProps) {
  const session = await auth();
  if (!session?.user) {
    return;
    // redirect('/');
  }
  return (
    <Sidebar>
      <SidebarHeader className='h-16 border-b border-sidebar-border'>
        <NavUser user={session.user}>
          <SignoutButton />
        </NavUser>
      </SidebarHeader>
      <SidebarContent>
        {/* <DashboardDatePicker expenses={expenses} /> */}
        <SidebarSeparator className='mx-0' />
        <DashboardCalendars calendars={data.calendars} />
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
