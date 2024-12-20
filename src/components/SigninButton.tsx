import { signIn } from '@/auth';
import { Button } from './ui/button';

export const SigninButton = () => {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google', { redirectTo: '/dashboard' });
      }}
    >
      <Button className="text-base font-medium">登入/註冊</Button>
    </form>
  );
};
