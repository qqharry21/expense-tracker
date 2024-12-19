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

export const category = {
  [Types.Category.FOOD]: {
    label: '食物',
    icon: PizzaIcon,
  },
  [Types.Category.TRANSPORTATION]: {
    label: '交通',
    icon: TramFrontIcon,
  },
  [Types.Category.ENTERTAINMENT]: {
    label: '娛樂',
    icon: DramaIcon,
  },
  [Types.Category.HEALTH]: {
    label: '健康',
    icon: HeartPulseIcon,
  },
  [Types.Category.BILLS]: {
    label: '帳單',
    icon: ReceiptIcon,
  },
  [Types.Category.SHOPPING]: {
    label: '購物',
    icon: ShoppingCartIcon,
  },
  [Types.Category.LEARNING]: {
    label: '教育',
    icon: GraduationCapIcon,
  },
  [Types.Category.TRAVEL]: {
    label: '旅遊',
    icon: PlaneIcon,
  },
  [Types.Category.INVESTMENT]: {
    label: '投資',
    icon: CircleDollarSignIcon,
  },
  [Types.Category.INSURANCE]: {
    label: '保險',
    icon: ShieldPlusIcon,
  },
  [Types.Category.OTHER]: {
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
