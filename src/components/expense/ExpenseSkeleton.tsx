import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const ExpenseChartSkeleton = ({ length }: { length: number }) => {
  return (
    <>
      {[...Array(length)].map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-col">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 md:h-48" />
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export const ExpenseCardListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-4/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const ExpenseStatsSkeleton = ({ length }: { length: number }) => {
  return (
    <>
      {[...Array(length)].map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </>
  );
};
