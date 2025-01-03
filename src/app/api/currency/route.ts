import { NextResponse } from 'next/server';

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;

// Define cache variables
let cachedRates: { [key: string]: number } | null = null;
let lastFetchTime: number | null = null;

// Cache duration in milliseconds (e.g., 1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

export const runtime = 'edge'; // Run this route on Vercel Edge

export const GET = async () => {
  const currentTime = Date.now();
  console.log('🚨 - currentTime', currentTime);

  // Serve cached data if valid
  if (
    cachedRates &&
    lastFetchTime &&
    currentTime - lastFetchTime < CACHE_DURATION
  ) {
    console.log('cachedRates', cachedRates, lastFetchTime);
    return NextResponse.json(cachedRates, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  }

  try {
    // Fetch data from Exchange Rate API
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/TWD`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch currency data');
    }

    const data = await response.json();

    // Extract the required rates
    const requiredRates = {
      TWD: 1,
      USD: 1 / data.conversion_rates.USD,
      JPY: 1 / data.conversion_rates.JPY,
      SGD: 1 / data.conversion_rates.SGD,
      RM: 1 / data.conversion_rates.MYR,
    };
    console.log('🚨 - requiredRates', requiredRates);

    // Cache the rates
    cachedRates = requiredRates;
    lastFetchTime = currentTime;

    return NextResponse.json(requiredRates, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 },
    );
  }
};
