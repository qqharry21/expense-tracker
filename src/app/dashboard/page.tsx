export default function Page() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-5">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-xl bg-gray-100/50 dark:bg-gray-800/50"
        />
      ))}
    </div>
  );
}
