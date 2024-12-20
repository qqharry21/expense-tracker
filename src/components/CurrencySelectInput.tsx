import { currency } from '@/lib';
import { formatNumber } from '@/lib/utils';
import React from 'react';
import { SelectInput } from './ui/select-input';

const currencyOptions = Object.entries(currency).map(([key, value]) => ({
  label: value.label,
  value: key,
}));

export const CurrencySelectInput = ({
  ...props
}: Omit<React.ComponentProps<typeof SelectInput>, 'selectOptions'>) => {
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = formatNumber(e.target.value);
    e.target.value = value.toString();
    props.onBlur?.(e);
  };
  return (
    <SelectInput
      {...props}
      type="number"
      placeholder="輸入金額"
      selectOptions={currencyOptions}
      selectPlaceholder="請選擇"
      onBlur={onBlur}
      prefix={
        <span className="text-sm text-gray-500">
          {currency[props.selectedOption as keyof typeof currency].symbol}
        </span>
      }
    />
  );
};
