import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const Stats = ({
  title,
  content,
  className,
}: {
  title: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card className={cn('flex w-full flex-col', className)}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full items-center text-2xl font-bold leading-none sm:text-3xl lg:items-start">
        {content}
      </CardContent>
    </Card>
  );
};
