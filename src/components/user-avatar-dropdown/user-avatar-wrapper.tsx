import { UserIcon } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';
import { SignoutButton } from '../signout-button';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { UserAvatarDropdown } from './user-avatar-dropdown';

interface UserAvatarWrapperProps {
  user: User;
}

export const UserAvatarWrapper = ({ user }: UserAvatarWrapperProps) => {
  return (
    <UserAvatarDropdown user={user}>
      <DropdownMenuItem asChild>
        <Link
          href='/dashboard'
          className='flex items-center'>
          <UserIcon className='mr-2 h-4 w-4' />
          <span>前往後台頁面</span>
        </Link>
      </DropdownMenuItem>
      <SignoutButton />
    </UserAvatarDropdown>
  );
};
