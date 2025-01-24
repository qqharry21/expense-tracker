import CountdownTimer from './CountdownTimer';

export const ComingSoon = () => {
  return (
    <div className="container m-auto grid place-items-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Coming Soon</h1>
        <p className="mb-8 text-lg md:text-xl">
          Our new content is almost ready!
        </p>
        <CountdownTimer targetDate="2025-01-31T00:00:00" />
      </div>
    </div>
  );
};
