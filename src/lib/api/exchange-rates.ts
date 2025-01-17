import { cache } from 'react';
import { prisma } from '../prisma';

// Function to fetch exchange rates from the database
async function fetchExchangeRates() {
  const exchangeRates = await prisma.exchangeRate.findMany();
  if (!exchangeRates) throw new Error('Exchange rates not found');
  return exchangeRates;
}

// Wrap the fetch function with `cache` to enable in-memory caching
export const fetchCachedExchangeRates = cache(fetchExchangeRates);

export const fetchExchangeRatesByDate = async (date: string) => {
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const exchangeRate = await prisma.exchangeRate.findFirst({
    where: {
      timestamp: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (!exchangeRate) {
    throw new Error(`No exchange rates found for ${date}`);
  }

  return exchangeRate;
};

export const fetchCachedExchangeRateByDate = cache(fetchExchangeRatesByDate);
