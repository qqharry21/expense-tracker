import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const ChartSkeleton = ({ length }: { length: number }) => {
  return (
    <div className="grid gap-8 border-b border-border pb-8 lg:grid-cols-2">
      {[...Array(length)].map((_, i) => (
        <SkeletonChart key={i} />
      ))}
    </div>
  );
};

const SkeletonChart = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 md:h-64" />
      </CardContent>
    </Card>
  );
};
