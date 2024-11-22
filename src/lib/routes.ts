export const routes = [
  {
    value: 'dashboard',
    label: '首頁',
  },
  {
    value: 'expense',
    label: '支出列表',
  },
  {
    value: 'tags',
    label: '標籤列表',
  },
  {
    value: 'income',
    label: '收入列表',
  },
  {
    value: 'budget',
    label: '預算列表',
  },
  {
    value: 'setting',
    label: '設定',
  },
];

export const ROOT = '/';
export const PUBLIC_ROUTES = [ROOT, '/api', '/api/auth/callback/google'];
export const PROTECTED_ROUTES = routes.map((route) => `/${route.value}`);
