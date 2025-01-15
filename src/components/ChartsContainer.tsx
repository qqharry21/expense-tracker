export const ChartsContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="grid gap-8 border-b border-border pb-8 sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
};
