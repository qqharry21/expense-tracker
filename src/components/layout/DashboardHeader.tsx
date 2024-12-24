'use client';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { routes } from '@/lib/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const DashboardHeader = () => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);
  console.log('🚨 - pathNames', pathNames);

  return (
    <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 dark:bg-gray-950">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {pathNames.length > 4 ? (
            <>
              <DashboardBreadcrumbItem
                path={pathNames[0]}
                index={0}
                isLast={false}
              />
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              {pathNames.slice(-2).map((path, index) => (
                <DashboardBreadcrumbItem
                  key={path}
                  path={path}
                  index={index + pathNames.length - 2}
                  isLast={index === 1}
                />
              ))}
            </>
          ) : (
            pathNames.map((path, index, arr) => (
              <DashboardBreadcrumbItem
                key={index}
                path={path}
                index={index}
                isLast={index === arr.length - 1}
              />
            ))
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};

const DashboardBreadcrumbItem = ({
  path,
  index,
  isLast,
}: {
  path: string;
  index: number;
  isLast: boolean;
}) => {
  const href = `/${path}`;
  const title = routes.find((route) => route.value === path)?.name ?? '';

  return (
    <>
      {index !== 0 && <BreadcrumbSeparator />}
      <BreadcrumbItem>
        {isLast ? (
          <BreadcrumbPage>{title}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={href}>{title}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </>
  );
};
