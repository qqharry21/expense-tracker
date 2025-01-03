import { Loader } from './Loader';

export const PageLoader = () => {
  return (
    <div className="container m-auto flex flex-col items-center justify-center">
      <Loader size={100} className="text-primary" />
      <p className="mt-4 animate-pulse text-xl text-muted-foreground">
        Loading...
      </p>
    </div>
  );
};
