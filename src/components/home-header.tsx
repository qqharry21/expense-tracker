import { auth } from '@/auth';
import { DollarSign } from 'lucide-react';
import Link from 'next/link';
import { SigninButton } from './signin-button';
import { UserAvatarDropdown } from './user-avatar-dropdown';

export const HomeHeader = async () => {
  const session = await auth();
  console.log('🚨 - session', session);
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
          <div className='flex items-center space-x-4'>
            {session?.user ? <UserAvatarDropdown user={session.user} /> : <SigninButton />}
          </div>
        </div>
      </div>
    </header>
  );
};
