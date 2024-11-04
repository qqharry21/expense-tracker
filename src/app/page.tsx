import { HomeFooter } from '@/components/home-footer';
import { HomeHeader } from '@/components/home-header';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <HomeHeader />
        <main className='flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20'>
          <div className='container mx-auto text-center'>
            <h1 className='text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight'>
              掌握您的 <span className='text-primary'>財務</span>
            </h1>
            <p className='text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto text-balance leading-relaxed'>
              使用我們直觀的消費追蹤器，記錄開銷、設定預算，並實現您的財務目標。
            </p>
            <Link href='/signup'>
              <Button
                size='lg'
                className='text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300'>
                開始使用
                <ArrowRight className='w-6 h-6 ml-2' />
              </Button>
            </Link>

            <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='flex flex-col items-center'>
                <BarChart2 className='h-12 w-12 text-primary mb-4' />
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>追蹤消費</h2>
                <p className='text-gray-600 dark:text-gray-400'>輕鬆記錄和分類您的消費</p>
              </div>
              <div className='flex flex-col items-center'>
                <PieChart className='h-12 w-12 text-primary mb-4' />
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>預算規劃</h2>
                <p className='text-gray-600 dark:text-gray-400'>為不同類別設定和管理預算</p>
              </div>
              <div className='flex flex-col items-center'>
                <TrendingUp className='h-12 w-12 text-primary mb-4' />
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>財務見解</h2>
                <p className='text-gray-600 dark:text-gray-400'>獲取詳細報告和視覺化圖表</p>
              </div>
            </div>
          </div>
        </main>
        <HomeFooter />
      </div>
    </>
  );
}
