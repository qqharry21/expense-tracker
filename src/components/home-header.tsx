import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import Link from 'next/link';

export const HomeHeader = () => {
  return (
    <header className='absolute top-0 left-0 right-0 z-10'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20'>
          <div className='flex items-center'>
            <Link
              href='/'
              className='flex items-center space-x-2'>
              <DollarSign className='h-8 w-8 text-primary' />
            </Link>
          </div>
          {/* <nav className='hidden md:flex space-x-8'>
            <Link
              href='/features'
              className='text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors'>
              Features
            </Link>
            <Link
              href='/pricing'
              className='text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors'>
              Pricing
            </Link>
            <Link
              href='/about'
              className='text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors'>
              About
            </Link>
          </nav> */}
          <div className='flex items-center space-x-4'>
            <Link href='/login'>
              <Button
                variant='ghost'
                className='text-base font-medium'>
                登入
              </Button>
            </Link>
            <Link href='/signup'>
              <Button className='text-base font-medium'>註冊</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
