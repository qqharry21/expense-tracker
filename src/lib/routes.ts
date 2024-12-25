import {
  BellIcon,
  ChartBarIcon,
  CogIcon,
  CreditCardIcon,
  FlagIcon,
  LayoutDashboardIcon,
  PieChartIcon,
  ShoppingCartIcon,
  TagsIcon,
} from 'lucide-react';

export interface Route {
  name: string;
  value: string;
  url: string;
  icon: React.FC | null;
  subRoutes?: Route[];
}

export const routes: Route[] = [
  {
    name: '首頁',
    value: 'dashboard',
    url: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    name: '支出',
    value: 'expenses',
    url: '/dashboard/expenses',
    icon: ShoppingCartIcon,
  },
  {
    name: '收入',
    value: 'incomes',
    url: '/dashboard/incomes',
    icon: CreditCardIcon,
  },
  {
    name: '管理',
    url: '#',
    value: 'management',
    icon: CogIcon,
    subRoutes: [
      {
        name: '預算',
        url: '/dashboard/management/budget',
        value: 'budget',
        icon: PieChartIcon,
      },
      {
        name: '標籤管理',
        url: '/dashboard/management/tags',
        value: 'tags',
        icon: TagsIcon,
      },
      {
        name: '通知管理',
        url: '/dashboard/management/notifications',
        value: 'notifications',
        icon: BellIcon,
      },
    ],
  },
  {
    name: '財務計畫',
    url: '#',
    value: 'financial-goals',
    icon: FlagIcon,
    subRoutes: [
      {
        name: '短期目標',
        url: '/dashboard/financial-goals/short-term-goals',
        value: 'short-term-goals',
        icon: null,
      },
      {
        name: '長期目標',
        url: '/dashboard/financial-goals/long-term-goals',
        value: 'long-term-goals',
        icon: null,
      },
    ],
  },
  {
    name: '財務報告',
    url: '#',
    value: 'financial-reports',
    icon: ChartBarIcon,
    subRoutes: [
      {
        name: '收入報告',
        url: '/dashboard/financial-reports/income',
        value: 'income-financial-reports',
        icon: null,
      },
      {
        name: '支出報告',
        url: '/dashboard/financial-reports/expenses',
        value: 'expenses-financial-reports',
        icon: null,
      },
      {
        name: '淨收入報告',
        url: '/dashboard/financial-reports/net-income',
        value: 'net-income-financial-reports',
        icon: null,
      },
    ],
  },
];

const flattenRoutes = (routes: Route[]): Route[] => {
  return routes.flatMap((route) => {
    if (route.subRoutes) {
      const { subRoutes, ...mainRoute } = route;
      return [mainRoute, ...flattenRoutes(subRoutes)];
    }
    return [route];
  });
};

export const routeMap: Map<string, { name: string; url: string }> = (() => {
  const flat = flattenRoutes(routes);
  return new Map(
    flat.map((route) => [
      route.value,
      {
        name: route.name,
        url: route.url,
      },
    ]),
  );
})();

export const ROOT = '/';
export const PUBLIC_ROUTES = [ROOT, '/api', '/api/auth/callback/google'];
export const PROTECTED_ROUTES = routes.map((route) => `/${route.value}`);
