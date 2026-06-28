const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div className="h-5 w-2/3 rounded-md bg-zinc-200" />
      <div className="h-6 w-16 rounded-full bg-zinc-200" />
    </div>
    <div className="mt-3 h-4 w-full rounded-md bg-zinc-100" />
    <div className="mt-2 h-4 w-4/5 rounded-md bg-zinc-100" />
    <div className="mt-5 flex gap-2">
      <div className="h-6 w-16 rounded-md bg-zinc-200" />
      <div className="h-6 w-20 rounded-md bg-zinc-200" />
    </div>
    <div className="mt-5 flex gap-4">
      <div className="h-3 w-24 rounded-md bg-zinc-100" />
      <div className="h-3 w-28 rounded-md bg-zinc-100" />
    </div>
  </div>
);

const StatSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div className="h-10 w-10 rounded-lg bg-zinc-200" />
    <div className="mt-4 h-4 w-24 rounded-md bg-zinc-100" />
    <div className="mt-2 h-8 w-12 rounded-md bg-zinc-200" />
  </div>
);

const LoadingSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatSkeleton key={`stat-skeleton-${index}`} />
        ))}
      </div>

      <div className="animate-pulse rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-32 rounded-md bg-zinc-200" />
        <div className="mt-5 space-y-4">
          <div className="h-10 w-full rounded-lg bg-zinc-100" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-10 rounded-lg bg-zinc-100" />
            <div className="h-10 rounded-lg bg-zinc-100" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={`task-skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
