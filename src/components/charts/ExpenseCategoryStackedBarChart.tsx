'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
import { expenseCategory } from '@/lib';
import { getMonthlyExpenseSummary, getTopFiveCategories } from '@/lib/helper';
import { Types } from '@/lib/types';
import { useCallback, useMemo } from 'react';

const chartConfig = {
  amount: {
    label: '總金額',
  },
  ...expenseCategory,
} satisfies ChartConfig;

interface ChartProps {
  expenses: Types.Expense[];
}

export function ExpenseCategoryStackedBarChart({ expenses }: ChartProps) {
  const transformSummaryToChartData = useCallback(
    (data: { name: string; amount: number }[]) => {
      return data.map(({ name, amount }) => ({
        category: name,
        amount,
        fill: expenseCategory[name as keyof typeof expenseCategory].color,
      }));
    },
    [],
  );

  const data = useMemo(
    () =>
      transformSummaryToChartData(
        getTopFiveCategories(getMonthlyExpenseSummary(expenses)),
      ),
    [expenses],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>當月支出類別分佈</CardTitle>
        <CardDescription>顯示前五大支出類別的分佈情況</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis
              dataKey="amount"
              type="number"
              tickLine={false}
              axisLine={false}
              tickCount={6}
              tickMargin={8}
              tickFormatter={(value) =>
                value === 0 ? value : `${value / 1000}k`
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="amount" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <p className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp size={16} />
        </p>
      </CardFooter>
    </Card>
  );
}
