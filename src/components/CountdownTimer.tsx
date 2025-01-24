'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<
    Record<string, number> | Record<string, never>
  >(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timeComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <Card key={interval} className="max-md:border-none max-md:shadow-none">
        <CardContent className="p-0 md:p-4">
          <div className="text-base font-bold md:text-2xl">
            {timeLeft[interval]}
          </div>
          <div className="text-sm uppercase">{interval}</div>
        </CardContent>
      </Card>
    );
  });

  return (
    <div className="flex justify-center space-x-4">
      {timeComponents.length ? timeComponents : <span>Time's up!</span>}
    </div>
  );
}
