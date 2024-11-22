'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'next-auth';
import { useState } from 'react';
import { SignoutButton } from '../signout-button';

interface UserAvatarDropdownProps extends PropsWithChildren {
  user: User;
}

export function UserAvatarDropdown({ user, children }: UserAvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={user.image ?? ''}
              alt={user.name ?? ''}
            />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        align='end'
        forceMount>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            <p className='font-medium'>{user.name}</p>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
