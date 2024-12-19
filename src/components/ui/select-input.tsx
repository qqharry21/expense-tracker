'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { forwardRef, useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  selectOptions: SelectOption[];
  selectedOption: string;
  onSelectChange: (value: string) => void;
  selectPlaceholder?: string;
  selectClassName?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const SelectInput = forwardRef<HTMLInputElement, SelectInputProps>(
  (
    {
      selectOptions,
      selectedOption,
      onSelectChange,
      selectPlaceholder = 'Select',
      selectClassName,
      value,
      onChange,
      className,
      prefix,
      suffix,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsFocused(false);
      }
    };

    return (
      <div
        className={cn(
          'flex rounded-md shadow-sm ring-offset-background',
          isFocused ? 'ring-2 ring-ring ring-offset-2' : 'ring-1 ring-input'
        )}
        role='button'
        onFocus={handleFocus}
        onBlur={handleBlur}>
        <Select
          value={selectedOption}
          onValueChange={onSelectChange}
          aria-labelledby='select-label'>
          <SelectTrigger
            className={cn(
              'rounded-l-md min-w-fit max-w-40 rounded-r-none border-0 focus:ring-0 shadow-none focus:ring-offset-0',
              isFocused ? 'ring-0' : '',
              selectClassName
            )}
            aria-haspopup='listbox'
            aria-expanded={isFocused}
            tabIndex={0}>
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent role='presentation'>
            {selectOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                tabIndex={-1}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {prefix && (
          <div className='flex items-center px-3 border-x border-input cursor-default bg-muted'>
            {prefix}
          </div>
        )}
        <Input
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            'rounded-l-none shadow-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0',
            isFocused ? 'ring-0' : '',
            prefix && 'rounded-l-none'
          )}
          {...props}
        />
        {suffix && (
          <div className='flex items-center px-3 border-l border-input cursor-default rounded-r-md bg-muted'>
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';
