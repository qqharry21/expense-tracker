import { cn } from '@/lib/utils';

export const ChartsContainer = ({
  children,
  className,
}: PropsWithChildren & { className?: string }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-6 border-b border-border pb-8',
        className,
      )}
    >
      {children}
    </div>
  );
};
