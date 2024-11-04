export {};

declare global {
  interface PropsWithChildren {
    children: React.ReactNode | React.ReactNode[];
  }
  interface WithClassName {
    className?: string;
  }

  let _mongoClientPromise: Promise<MongoClient> | undefined;
}
