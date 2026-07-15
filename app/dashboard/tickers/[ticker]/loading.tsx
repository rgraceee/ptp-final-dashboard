export default function TickerLoading() {
  return (
    <div className="p-6">
      <div className="h-4 w-32 rounded mb-4 shimmer" />
      <div className="flex flex-wrap gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-4 w-64">
      <div className="h-3 w-20 rounded mb-3 shimmer" />
      <div className="h-7 w-28 rounded mb-3 shimmer" />
      <div className="h-3 w-16 rounded shimmer" />
    </div>
  );
}