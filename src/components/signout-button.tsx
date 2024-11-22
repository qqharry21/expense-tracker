import { signOut } from '@/auth';
import { LogOut } from 'lucide-react';
import { DropdownMenuItem } from './ui/dropdown-menu';

export const SignoutButton = () => {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}>
      <DropdownMenuItem asChild>
        <button
          type='submit'
          className='w-full'>
          <LogOut className='h-4 w-4' />
          <span>登出</span>
        </button>
      </DropdownMenuItem>
    </form>
  );
};
