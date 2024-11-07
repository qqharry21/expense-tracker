import { clsx, type ClassValue } from 'clsx';
import { formatDate } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentDate(format: string = 'yyyy-MM-dd') {
  return formatDate(new Date(), format);
}
