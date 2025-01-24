import { auth } from '@/auth';
import { HomeFooter } from '@/components/layout/HomeFooter';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader user={session?.user} />
      <main className="flex flex-grow items-center justify-center px-4 pt-20 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 text-5xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-6xl">
            掌握您的 <span className="text-primary">財務</span>
          </h1>
          <p className="mx-auto mb-10 max-w-4xl text-balance text-xl leading-relaxed text-gray-600 dark:text-gray-300 sm:text-2xl">
            使用我們直觀的消費追蹤器，記錄開銷、設定預算，並實現您的財務目標。
          </p>
          {session?.user ? (
            <Link href="/dashboard">
              <Button
                size="lg"
                className="rounded-full px-8 py-4 text-lg shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                前往後台
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup" prefetch={false}>
              <Button
                size="lg"
                className="rounded-full px-8 py-4 text-lg shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                開始使用
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          )}

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <BarChart2 className="mb-4 h-12 w-12 text-primary" />
              <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                追蹤消費
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                輕鬆記錄和分類您的消費
              </p>
            </div>
            <div className="flex flex-col items-center">
              <PieChart className="mb-4 h-12 w-12 text-primary" />
              <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                預算規劃
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                為不同類別設定和管理預算
              </p>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="mb-4 h-12 w-12 text-primary" />
              <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                財務見解
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                獲取詳細報告和視覺化圖表
              </p>
            </div>
          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
