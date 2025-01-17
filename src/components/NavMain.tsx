'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { routes } from '@/lib/routes';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function NavMain() {
  const showRoutes = routes.filter((route) => !route.hideInSidebar);
  return (
    <SidebarGroup>
      <SidebarMenu>
        {showRoutes.map((route) => {
          return (
            <Collapsible key={route.name} asChild className="group/collapsible">
              <SidebarMenuItem>
                {route.subRoutes && !route.hideSubRoutes ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={route.name}>
                        {route.icon && <route.icon />}
                        <span>{route.name}</span>
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {route.subRoutes?.map((subRoute) => {
                          if (subRoute.hideInSidebar) {
                            return null;
                          } else {
                            return (
                              <SidebarMenuSubItem key={subRoute.name}>
                                <SidebarMenuSubButton asChild>
                                  <Link href={subRoute.url}>
                                    {subRoute.icon && <subRoute.icon />}
                                    <span>{subRoute.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          }
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton tooltip={route.name} asChild>
                    <Link href={route.url}>
                      {route.icon && <route.icon />}
                      <span>{route.name}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
