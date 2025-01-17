'use client';

import { Types } from '@/lib/types';
import React, { createContext, useContext } from 'react';

const ExchangeRateContext = createContext<Types.ExchangeRate[] | null>(null);

export const ExchangeRateProvider = ({
  children,
  exchangeRates,
}: {
  children: React.ReactNode;
  exchangeRates: Types.ExchangeRate[];
}) => {
  return (
    <ExchangeRateContext.Provider value={exchangeRates}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRates = () => {
  const context = useContext(ExchangeRateContext);
  if (!context) {
    throw new Error(
      'useExchangeRates must be used within an ExchangeRateProvider',
    );
  }
  return context;
};
