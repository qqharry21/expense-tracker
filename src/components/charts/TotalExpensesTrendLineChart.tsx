'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Types } from '@/lib/types';
import {
  getDecimal,
  getLastMonthsTotalExpenses,
  getMonthlyGrowth,
} from '@/lib/utils';
import { useMemo } from 'react';

const chartConfig = {
  amount: {
    label: 'Amount',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface ChartProps {
  expenses: Types.Expense[];
  totalMonths: number;
}

export function TotalExpensesTrendLineChart({
  expenses,
  totalMonths,
}: ChartProps) {
  const data = useMemo(
    () => getLastMonthsTotalExpenses(expenses, totalMonths).reverse(),
    [expenses, totalMonths],
  );

  const monthlyGrowth = useMemo(
    () => getDecimal((getMonthlyGrowth(expenses) ?? 0) / 100, 2),
    [expenses],
  );
  console.log('🚨 - monthlyGrowth', monthlyGrowth);
  return (
    <Card>
      <CardHeader>
        <CardTitle>總支出趨勢</CardTitle>
        <CardDescription>顯示過去{totalMonths}個月的總支出金額</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              formatter={(value: number) => `共${value}元`}
            />
            <Line
              dataKey="amount"
              type="natural"
              stroke="var(--color-amount)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          本月支出比上月{monthlyGrowth > 0 ? '增長' : '減少'}{' '}
          <span
            className={monthlyGrowth > 0 ? 'text-red-500' : 'text-green-500'}
          >
            {Math.abs(monthlyGrowth)}%
          </span>
          {monthlyGrowth > 0 ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
