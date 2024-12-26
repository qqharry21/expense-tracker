import { cn } from '@/lib/utils';
import { LoaderCircleIcon } from 'lucide-react';

interface LoaderProps {
  className?: string;
  size?: number;
}

export const Loader = ({ className, size = 40 }: LoaderProps) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <LoaderCircleIcon size={size} className="animate-spin" />
    </div>
  );
};
