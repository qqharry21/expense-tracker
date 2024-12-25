import {
  CircleDollarSignIcon,
  CogIcon,
  DramaIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  PizzaIcon,
  PlaneIcon,
  ReceiptIcon,
  ShieldPlusIcon,
  ShoppingCartIcon,
  TramFrontIcon,
} from 'lucide-react';
import { Types } from './types';

export const expenseCategory = {
  [Types.ExpenseCategory.FOOD]: {
    label: '食物',
    icon: PizzaIcon,
  },
  [Types.ExpenseCategory.TRANSPORTATION]: {
    label: '交通',
    icon: TramFrontIcon,
  },
  [Types.ExpenseCategory.ENTERTAINMENT]: {
    label: '娛樂',
    icon: DramaIcon,
  },
  [Types.ExpenseCategory.HEALTH]: {
    label: '健康',
    icon: HeartPulseIcon,
  },
  [Types.ExpenseCategory.BILLS]: {
    label: '帳單',
    icon: ReceiptIcon,
  },
  [Types.ExpenseCategory.SHOPPING]: {
    label: '購物',
    icon: ShoppingCartIcon,
  },
  [Types.ExpenseCategory.LEARNING]: {
    label: '教育',
    icon: GraduationCapIcon,
  },
  [Types.ExpenseCategory.TRAVEL]: {
    label: '旅遊',
    icon: PlaneIcon,
  },
  [Types.ExpenseCategory.INVESTMENT]: {
    label: '投資',
    icon: CircleDollarSignIcon,
  },
  [Types.ExpenseCategory.INSURANCE]: {
    label: '保險',
    icon: ShieldPlusIcon,
  },
  [Types.ExpenseCategory.OTHER]: {
    label: '其他',
    icon: CogIcon,
  },
} as const;

export const frequency = {
  [Types.Frequency.ONE_TIME]: '一次性',
  [Types.Frequency.DAILY]: '每日',
  [Types.Frequency.WEEKLY]: '每週',
  [Types.Frequency.MONTHLY]: '每月',
  [Types.Frequency.ANNUALLY]: '每年',
} as const;

export const currency = {
  [Types.Currency.TWD]: {
    label: '台幣',
    symbol: 'NT$',
  },
  [Types.Currency.USD]: {
    label: '美金',
    symbol: '$',
  },
  [Types.Currency.JPY]: {
    label: '日幣',
    symbol: '¥',
  },
  [Types.Currency.RM]: {
    label: '馬來幣',
    symbol: 'RM',
  },
  [Types.Currency.SGD]: {
    label: '新加坡幣',
    symbol: 'S$',
  },
} as const;

export const thresholds = {
  [Types.Frequency.ONE_TIME]: [3000, 1000],
  [Types.Frequency.DAILY]: [300, 100],
  [Types.Frequency.WEEKLY]: [2100, 700],
  [Types.Frequency.MONTHLY]: [9000, 3000],
  [Types.Frequency.ANNUALLY]: [108000, 36000],
};

export enum Level {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export const incomeCategory = {
  [Types.IncomeCategory.SALARY]: {
    label: '薪資',
  },
  [Types.IncomeCategory.BONUS]: {
    label: '獎金',
  },
  [Types.IncomeCategory.DIVIDEND]: {
    label: '股息',
  },
  [Types.IncomeCategory.SIDE_JOB]: {
    label: '副業收入',
  },
  [Types.IncomeCategory.INVESTMENT]: {
    label: '投資收益',
  },
  [Types.IncomeCategory.RENTAL]: {
    label: '租金收入',
  },
  [Types.IncomeCategory.ROYALTY]: {
    label: '版稅',
  },
  [Types.IncomeCategory.CAPITAL_GAINS]: {
    label: '資本利得',
  },
  [Types.IncomeCategory.PENSION]: {
    label: '退休金',
  },
  [Types.IncomeCategory.INHERITANCE]: {
    label: '繼承收入',
  },
  [Types.IncomeCategory.FREELANCE]: {
    label: '自由職業收入',
  },
  [Types.IncomeCategory.LOTTERY]: {
    label: '彩票或賭博收入',
  },
  [Types.IncomeCategory.TRUST]: {
    label: '信託收入',
  },
  [Types.IncomeCategory.TAX_REFUND]: {
    label: '退稅',
  },
  [Types.IncomeCategory.ANNUITY]: {
    label: '年金',
  },
  [Types.IncomeCategory.GIFT]: {
    label: '禮物',
  },
  [Types.IncomeCategory.OTHER]: {
    label: '其他',
  },
};
